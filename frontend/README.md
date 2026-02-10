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
