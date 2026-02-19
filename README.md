# Komodo Kingdom

Komodo Kingdom is a Vite + React + TypeScript trading-card web app with quiz, pack opening, and battle flows.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Required Runtime Config

- `VITE_AUTH_BASE_URL`: Base URL for the backend auth API (default: `/api`).
- `VITE_MONITORING_ENDPOINT`: Optional endpoint that accepts client error reports.

The frontend now expects server-side auth endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /auth/me`

All requests are sent with `credentials: "include"` for secure cookie-based sessions.

## Quality Gates

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run budget`
- `npm run check` (runs all checks above)

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

PRs and pushes to `main` run lint, typecheck, tests, build, and bundle budget checks.

## Deployment Notes

- Update canonical and sitemap host values in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.
- The `dist/` folder is treated as a build artifact and should not be committed.
- Configure production monitoring by setting `VITE_MONITORING_ENDPOINT`.
