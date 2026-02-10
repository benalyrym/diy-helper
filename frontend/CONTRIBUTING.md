# Contributing (Frontend)

## Structure

- `app/pages`: routing and page shells.
- `app/components`: presentational components.
- `app/composables`: stateful UI logic.
- `app/services/api`: HTTP accessors (no direct `$fetch` in components).
- `app/domain/models`: shared domain types.
- `tests/domain` and `tests/ui`: unit/component tests.

## Conventions

- Keep UI components free of business logic; move rules to composables/services.
- Use shared types from `app/domain/models` or `app/types`.
- Prefer `useApi()` over direct HTTP calls.
- Add tests for new composables and UI components.

## Scripts

```bash
npm run lint
npm run format
npm run test
```
