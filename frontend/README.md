# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Environment

Create a local env file:

```bash
cp .env.example .env
```

Key variables:

- `NUXT_PUBLIC_API_BASE`: Backend base URL (default: `http://localhost:4000`).
- `NUXT_PUBLIC_PERSIST_AUTH`: `true` to persist token in `sessionStorage`, `false` for memory-only.

## Architecture (DDD)

- `app/contexts/*/domain`: entities and ports (no Vue/HTTP).
- `app/contexts/*/application`: use-cases and mappers.
- `app/contexts/*/infrastructure`: HTTP adapters.
- `app/app/di`: composition root (DI).
- `app/shared`: cross-cutting utilities and infrastructure.
- `app/pages`: route-level shells.
- `app/components`: shared UI (see conventions).
- `app/domain/models`: compatibility re-exports for domain entities.
- `tests/domain`, `tests/application`, `tests/ui`: unit and component tests.

### Component conventions

- `app/components/ui`: dumb UI only (no API, no router, no business store).
- `app/components/layout`: layout-level components (navigation, shell).
- `app/features/<feature>/components`: feature UI and orchestration.

x### Pages organization

Pages are grouped with Nuxt route groups to keep URLs unchanged:

- `app/pages/(home)`, `app/pages/(auth)`, `app/pages/(recipes)`, `app/pages/(tools)`

## Auth flow

The frontend uses a short-lived access token stored in memory and optionally in
`sessionStorage` for reload persistence. API calls add `Authorization: Bearer`
when a token is present, and 401 responses trigger a logout redirect.

For stronger protection (HttpOnly cookies), the backend must support cookie-based
auth and CSRF mitigation.

## Security headers (production)

The app sets a minimal CSP and other headers in `nuxt.config.ts` for production
builds. If you deploy behind a reverse proxy, ensure these headers are preserved
or set at the edge.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
