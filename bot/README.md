# Vmais WhatsApp Bot

Bot para consumir a API da agenda e preparar/enviar os disparos de WhatsApp.

O `dry_run.py` em Python continua como ferramenta de diagnostico. O envio real fica no `worker.js`, usando Baileys para conectar no WhatsApp Web via dispositivo vinculado.

## Configuracao

Copie o exemplo:

```bash
cp bot/.env.example bot/.env
```

Preencha:

```text
VMAIS_API_URL=http://localhost:8080/api
VMAIS_ADMIN_EMAIL=admin@vmais.local
VMAIS_ADMIN_PASSWORD=admin123
VMAIS_WHATSAPP_GROUP_NAME=Nome exato do grupo
```

## Dry-run

Pela raiz do monorepo:

```bash
npm run bot:dry-run
```

Para simular outro horario:

```bash
python3 bot/dry_run.py --now 2026-06-08T08:05:00
```

Para imprimir todos os disparos retornados pela API, mesmo que ainda nao estejam na hora:

```bash
python3 bot/dry_run.py --force
```

Para simular o envio e marcar os disparos como enviados no backend:

```bash
python3 bot/dry_run.py --mark-sent
```

## Worker Baileys

Instale as dependencias do worker:

```bash
npm run bot:install
```

Liste os grupos da conta conectada:

```bash
npm run bot:groups
```

Na primeira execucao, o terminal mostra um QR Code. Leia com o WhatsApp que sera usado pelo bot. A sessao fica salva em `bot/auth/`.

Para testar o worker sem enviar mensagem:

```bash
npm run bot:worker
```

Para enviar os disparos pendentes e marcar como enviados no backend:

```bash
npm run bot:worker:send
```

Para deixar rodando em loop, consultando a API a cada `VMAIS_BOT_INTERVAL_SECONDS`:

```bash
npm run bot:worker:loop
```

O envio real procura o grupo pelo nome em `whatsappGroupName` do disparo. Se a pauta nao tiver grupo, usa `VMAIS_WHATSAPP_GROUP_NAME`.

## Fluxo tecnico

1. `POST /api/reminders/dispatches/materialize`
2. `GET /api/reminders/dispatches/pending`
3. envia pelo Baileys ou imprime no dry-run
4. se enviou com sucesso: `PATCH /api/reminders/dispatches/{id}/sent`
5. se falhou: `PATCH /api/reminders/dispatches/{id}/failed`

## Regras atuais

- Toda segunda-feira as 08:00: resumo semanal no grupo.
- Evento antes de 09:00: lembrete na noite anterior as 20:00.
- Demais eventos: lembrete em `eventAt - reminderMinutesBefore`.

O backend calcula `scheduledAt`; o bot apenas executa os disparos pendentes.
