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
- `GET /api/auth/me`
- `GET/POST/PUT /api/sectors`
- `GET/POST/PUT /api/employees`
- `GET/POST/PUT /api/agenda-items`
- `PATCH /api/agenda-items/{id}/status`
- `GET /api/reminders/preview`
