# Vmais Agenda API

Backend Java/Spring Boot para a area administrativa da agenda interna.

## Requisitos

- Java 21
- PostgreSQL 16+

## Desenvolvimento

Suba apenas o banco:

```bash
docker compose -f ../infra/docker-compose.yml up -d
```

Rode a API:

```bash
./mvnw spring-boot:run
```

Ou suba o stack completo pela raiz do monorepo:

```bash
npm run dev:stack
```

Admin local criado automaticamente quando o banco esta vazio:

```text
email: admin@vmais.local
senha: admin123
```

Troque essas credenciais em producao usando `VMAIS_ADMIN_EMAIL`, `VMAIS_ADMIN_PASSWORD` e `VMAIS_ADMIN_NAME`.

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/contact-messages`
- `GET /api/auth/me`
- `GET/POST/PUT /api/sectors`
- `GET/POST/PUT /api/employees`
- `GET/POST/PUT /api/agenda-items`
- `PATCH /api/agenda-items/{id}/status`
- `GET /api/reminders/preview`
- `GET /api/reminders/upcoming`
- `GET /api/reminders/weekly-summary`
- `POST /api/reminders/dispatches/materialize`
- `GET /api/reminders/dispatches/pending`
- `PATCH /api/reminders/dispatches/{id}/sent`
- `PATCH /api/reminders/dispatches/{id}/failed`

## Contrato inicial para o bot

O bot de WhatsApp deve consumir os endpoints de lembrete usando o token admin no header `Authorization`.

### Resumo semanal

`GET /api/reminders/weekly-summary`

Parametros opcionais:

```text
weekStart=2026-06-01
```

Se `weekStart` nao for enviado, a API usa a segunda-feira da semana atual. A resposta traz:

```text
weekStart
weekEnd
dispatch
items
```

`dispatch.type` vem como `WEEKLY_DIGEST`, com `scheduledAt` na segunda-feira as 08:00. `items` traz as pautas da semana, e `dispatch.mentions` traz os escalados para o bot marcar no grupo.

### Lembretes por evento

`GET /api/reminders/upcoming`

Parametros opcionais:

```text
from=2026-06-05
to=2026-06-12
days=7
```

Quando `from` e `to` nao forem enviados, a API retorna as pautas de cobertura dos proximos `days` dias, ignorando itens `DONE`, `CANCELED` e trabalhos de design.

Campos principais retornados:

```text
agendaItemId
title
category
status
eventDate
startTime
eventAt
meetingPoint
notes
responsible
assignments
dispatches
```

`assignments` traz os responsaveis escalados com nome, telefone, funcao, status ativo e papel na cobertura. `dispatches` traz o horario calculado de disparo, o grupo WhatsApp, uma mensagem sugerida e `mentions`.

Regra inicial de disparo:

```text
Resumo semanal: segunda-feira as 08:00.
Evento antes de 09:00: noite anterior as 20:00.
Demais eventos: eventAt - reminderMinutesBefore.
```

### Controle de envios

Antes de enviar mensagens reais, o bot deve materializar os disparos e buscar pendentes:

```text
POST /api/reminders/dispatches/materialize?days=7
GET /api/reminders/dispatches/pending?dueUntil=2026-06-08T08:05:00
```

Depois de enviar:

```text
PATCH /api/reminders/dispatches/{id}/sent
```

Se falhar:

```text
PATCH /api/reminders/dispatches/{id}/failed
```
