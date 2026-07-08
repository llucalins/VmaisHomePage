# Vmais Comunicacao - Monorepo

Monorepo com o site institucional da Vmais Comunicacao e a primeira base do sistema interno de agenda.

## Estrutura

```text
frontend/  React + Vite
backend/   Java 21 + Spring Boot
infra/     Docker Compose e suporte local
```

## Frontend

- React 18
- Vite
- Styled Components
- Framer Motion
- Lenis

```bash
npm install
npm run dev:frontend
```

A landing publica fica em `/`, o login admin em `/login` e o painel em `/admin`.

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Flyway
- PostgreSQL

Suba o banco:

```bash
docker compose -f infra/docker-compose.yml up -d
```

Rode a API:

```bash
cd backend
./mvnw spring-boot:run
```

Credencial local inicial:

```text
email: admin@vmais.local
senha: admin123
```

## Stack completa com Docker

Para subir banco, backend e frontend juntos:

```bash
npm run dev:stack
```

Se a porta `5173` ja estiver ocupada:

```bash
FRONTEND_PORT=5174 npm run dev:stack
```

Servicos locais:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
Postgres: localhost:5432
```

Para parar:

```bash
npm run stop:stack
```

## Stack com banco em nuvem

Para rodar backend e frontend apontando para um Postgres externo, como Neon, use o compose de producao/staging. Ele nao sobe Postgres local.

1. Crie o arquivo de variaveis:

```bash
cp infra/.env.prod.example infra/.env.prod
```

2. Preencha `infra/.env.prod` com a conexao do Neon:

```text
DATABASE_URL=jdbc:postgresql://SEU_HOST_NEON/neondb?sslmode=require
DATABASE_USERNAME=SEU_USUARIO_NEON
DATABASE_PASSWORD=SUA_SENHA_NEON
```

3. Ajuste tambem:

```text
CORS_ALLOWED_ORIGINS=http://localhost:4173
VITE_API_URL=http://localhost:8080/api
JWT_SECRET=um-segredo-longo-e-unico
VMAIS_ADMIN_EMAIL=...
VMAIS_ADMIN_PASSWORD=...
```

4. Suba a stack:

```bash
npm run prod:stack
```

Servicos locais nesse modo:

```text
Frontend: http://localhost:4173
Backend:  http://localhost:8080
Banco:    Neon/Postgres externo
```

Para acompanhar logs:

```bash
npm run prod:logs
```

Para parar:

```bash
npm run stop:prod
```

## Proximos passos

- Trocar as credenciais locais por variaveis de ambiente antes de publicar.
- Evoluir o quadro para drag-and-drop real.
- Criar rotina de envio WhatsApp em Python a partir de `/api/reminders/upcoming`.
- Validar com o provedor escolhido se o envio sera em grupo ou por mensagens individuais.

## Dados para o bot

Os endpoints de lembrete preparam o contrato inicial para o bot. Eles retornam somente pautas de foto/video/stories, com responsaveis escalados, ponto de encontro, observacoes, horarios de disparo calculados e dados para mencoes.

Resumo semanal, pensado para disparo toda segunda-feira no grupo:

```bash
curl "http://localhost:8080/api/reminders/weekly-summary" \
  -H "Authorization: Bearer SEU_TOKEN"
```

Lembretes por evento:

```bash
curl "http://localhost:8080/api/reminders/upcoming?days=7" \
  -H "Authorization: Bearer SEU_TOKEN"
```

Regra inicial:

```text
Resumo semanal: segunda-feira as 08:00.
Evento antes de 09:00: noite anterior as 20:00.
Demais eventos: eventAt - reminderMinutesBefore.
```

## Bot WhatsApp

O bot fica em `bot/`. O `dry_run.py` em Python autentica na API, consulta os lembretes e imprime o que enviaria. O `worker.js` em Node usa Baileys para enviar mensagens reais em grupo pelo WhatsApp Web.

Configure:

```bash
cp bot/.env.example bot/.env
```

Rode:

```bash
npm run bot:dry-run
```

Para simular um horario:

```bash
python3 bot/dry_run.py --now 2026-06-08T08:05:00
```

Para listar todos os disparos retornados, mesmo futuros:

```bash
npm run bot:dry-run:all
```

Depois que quiser simular o envio e gravar no backend para nao repetir:

```bash
python3 bot/dry_run.py --mark-sent
```

Para usar o worker real com Baileys:

```bash
npm run bot:install
npm run bot:groups
npm run bot:worker:send
```
