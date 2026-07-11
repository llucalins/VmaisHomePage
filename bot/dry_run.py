#!/usr/bin/env python3
import argparse
import json
import os
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


@dataclass
class Config:
    api_url: str
    email: str
    password: str
    lookahead_minutes: int
    lookback_minutes: int


class ApiClient:
    def __init__(self, config: Config) -> None:
        self.config = config
        self.token: str | None = None

    def login(self) -> None:
        response = self.request(
            "/auth/login",
            method="POST",
            body={
                "email": self.config.email,
                "password": self.config.password,
            },
            authenticated=False,
        )
        self.token = response["token"]

    def get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        query = f"?{urlencode(params)}" if params else ""
        return self.request(f"{path}{query}")

    def post(self, path: str, params: dict[str, Any] | None = None, body: dict[str, Any] | None = None) -> Any:
        query = f"?{urlencode(params)}" if params else ""
        return self.request(f"{path}{query}", method="POST", body=body)

    def patch(self, path: str, body: dict[str, Any] | None = None) -> Any:
        return self.request(path, method="PATCH", body=body)

    def request(
        self,
        path: str,
        method: str = "GET",
        body: dict[str, Any] | None = None,
        authenticated: bool = True,
    ) -> Any:
        url = f"{self.config.api_url.rstrip('/')}{path}"
        data = None
        headers = {"Content-Type": "application/json"}
        if body is not None:
            data = json.dumps(body).encode("utf-8")
        if authenticated:
            if not self.token:
                raise RuntimeError("Token ausente. Execute login antes de chamar a API.")
            headers["Authorization"] = f"Bearer {self.token}"

        request = Request(url, data=data, headers=headers, method=method)
        try:
            with urlopen(request, timeout=20) as response:
                content = response.read().decode("utf-8")
                return json.loads(content) if content else None
        except HTTPError as error:
            content = error.read().decode("utf-8")
            raise RuntimeError(f"API respondeu {error.code} em {path}: {content}") from error
        except URLError as error:
            raise RuntimeError(f"Nao foi possivel conectar na API em {url}: {error.reason}") from error


def parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)


def dispatch_scheduled_at(dispatch: dict[str, Any]) -> datetime:
    return parse_datetime(dispatch["scheduledAt"])


def dispatch_due(
    scheduled_at: datetime,
    now: datetime,
    lookahead_minutes: int,
    lookback_minutes: int,
    force: bool,
) -> bool:
    if force:
        return True
    window_start = now - timedelta(minutes=lookback_minutes)
    window_end = now + timedelta(minutes=lookahead_minutes)
    return window_start <= scheduled_at <= window_end


def collect_pending_dispatches(
    pending_dispatches: list[dict[str, Any]],
    now: datetime,
    lookahead_minutes: int,
    lookback_minutes: int,
    force: bool,
) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []
    for dispatch in pending_dispatches:
        scheduled_at = dispatch_scheduled_at(dispatch)
        if not dispatch_due(scheduled_at, now, lookahead_minutes, lookback_minutes, force):
            continue
        raw_payload = dispatch.get("payload") or {}
        payload = json.loads(raw_payload) if isinstance(raw_payload, str) else raw_payload
        entries.append({
            "id": dispatch["id"],
            "source": dispatch.get("dispatchType"),
            "title": payload.get("title") or f"Resumo semanal {payload.get('weekStart')} a {payload.get('weekEnd')}",
            "eventAt": payload.get("eventAt"),
            "dispatch": {
                "type": dispatch.get("dispatchType"),
                "scheduledAt": dispatch.get("scheduledAt"),
                "whatsappGroupName": dispatch.get("whatsappGroupName"),
                "message": dispatch.get("message"),
                "mentions": payload.get("dispatch", {}).get("mentions")
                    or payload.get("dispatches", [{}])[0].get("mentions", []),
            },
        })
    return sorted(entries, key=lambda entry: entry["dispatch"]["scheduledAt"])


def format_mentions(mentions: list[dict[str, Any]]) -> str:
    if not mentions:
        return "sem mencoes"
    return ", ".join(f"{mention.get('name')} ({mention.get('phoneNumber')})" for mention in mentions)


def print_dispatch(entry: dict[str, Any]) -> None:
    dispatch = entry["dispatch"]
    print("=" * 72)
    print(f"Tipo: {dispatch.get('type')}")
    print(f"Dispatch ID: {entry.get('id')}")
    print(f"Origem: {entry.get('source')}")
    print(f"Titulo: {entry.get('title')}")
    if entry.get("eventAt"):
        print(f"Evento: {entry.get('eventAt')}")
    print(f"Disparo: {dispatch.get('scheduledAt')}")
    print(f"Grupo: {dispatch.get('whatsappGroupName') or 'nao informado'}")
    print(f"Mencoes: {format_mentions(dispatch.get('mentions', []))}")
    print("-" * 72)
    print(dispatch.get("message", ""))


def config_from_env() -> Config:
    load_env_file(ROOT / ".env")
    api_url = os.getenv("VMAIS_API_URL", "http://localhost:8080/api")
    email = os.getenv("VMAIS_ADMIN_EMAIL", "admin@vmais.local")
    password = os.getenv("VMAIS_ADMIN_PASSWORD", "admin123")
    lookahead = int(os.getenv("VMAIS_BOT_LOOKAHEAD_MINUTES", "0"))
    lookback = int(os.getenv("VMAIS_BOT_LOOKBACK_MINUTES", "60"))
    return Config(
        api_url=api_url,
        email=email,
        password=password,
        lookahead_minutes=lookahead,
        lookback_minutes=lookback,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Dry-run do bot de lembretes da Vmais.")
    parser.add_argument("--now", help="Horario atual simulado no formato ISO, ex: 2026-06-08T08:05:00")
    parser.add_argument("--days", type=int, default=7, help="Quantidade de dias para buscar lembretes por evento.")
    parser.add_argument("--force", action="store_true", help="Mostra todos os disparos, mesmo os futuros.")
    parser.add_argument("--mark-sent", action="store_true", help="Marca como enviado depois de imprimir.")
    parser.add_argument("--lookahead-minutes", type=int, help="Janela extra para considerar disparos pendentes.")
    parser.add_argument("--lookback-minutes", type=int, help="Janela retroativa para considerar disparos pendentes.")
    args = parser.parse_args()

    config = config_from_env()
    lookahead = args.lookahead_minutes if args.lookahead_minutes is not None else config.lookahead_minutes
    lookback = args.lookback_minutes if args.lookback_minutes is not None else config.lookback_minutes
    now = parse_datetime(args.now) if args.now else datetime.now()

    client = ApiClient(config)
    client.login()
    client.post("/reminders/dispatches/materialize", {
        "from": now.date().isoformat(),
        "days": args.days,
    })
    due_until = now + timedelta(minutes=lookahead)
    pending_dispatches = client.get(
        "/reminders/dispatches/pending",
        {"dueUntil": due_until.isoformat(timespec="seconds")},
    )
    dispatches = collect_pending_dispatches(pending_dispatches, now, lookahead, lookback, args.force)

    print(
        f"Dry-run Vmais Bot | now={now.isoformat(timespec='seconds')} | "
        f"lookback={lookback}min | lookahead={lookahead}min"
    )
    print(f"Disparos prontos: {len(dispatches)}")
    if not dispatches:
        print("Nenhuma mensagem seria enviada agora.")
        return 0

    for entry in dispatches:
        print_dispatch(entry)
        if args.mark_sent:
            client.patch(
                f"/reminders/dispatches/{entry['id']}/sent",
                {"at": now.isoformat(timespec="seconds"), "message": "Marcado pelo dry-run."},
            )
            print("Marcado como enviado.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"Erro: {error}", file=sys.stderr)
        raise SystemExit(1)
