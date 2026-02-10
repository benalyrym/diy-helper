# Backend (Fastify)

## Setup

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env
```

Key variables:

- `JWT_SECRET`: signing secret for access tokens.
- `JWT_EXPIRES_IN`: short-lived access token TTL (default `30m`).
- `CORS_ORIGIN`: comma-separated list of allowed frontend origins.
- `DB_PATH`: SQLite file path or `:memory:` for tests.
- `PASSWORD_PEPPER`: optional secret pepper for password hashing.

## Auth flow

The API uses JWT access tokens via `Authorization: Bearer <token>`.
For cookie-based auth, you must add HttpOnly cookies and CSRF protection.

## Security headers

Security headers are applied with `@fastify/helmet`. Enable HSTS only when
serving HTTPS (`HSTS_ENABLED=true`).
