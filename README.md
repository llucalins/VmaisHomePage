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

## Proximos passos

- Trocar as credenciais locais por variaveis de ambiente antes de publicar.
- Evoluir o quadro para drag-and-drop real.
- Criar rotina de envio WhatsApp a partir de `/api/reminders/preview`.
- Validar com o provedor escolhido se o envio sera em grupo ou por mensagens individuais.
