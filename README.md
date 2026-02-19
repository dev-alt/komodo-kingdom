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
- `VITE_APP_ENV`: Optional environment label used in telemetry payloads (example: `staging`, `production`).
- `VITE_APP_RELEASE`: Optional release identifier/version used in telemetry payloads.

The frontend now expects server-side auth endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /auth/me`

All requests are sent with `credentials: "include"` for secure cookie-based sessions.

## Auth Security Contract (Frontend ↔ Backend)

Before production launch, backend auth implementation should satisfy all of the following:

- Session cookies are `HttpOnly`, `Secure` in production, and `SameSite=Lax` (or stricter) unless explicit cross-site requirements exist.
- Server enforces CSRF protection for state-changing cookie-authenticated requests.
- Password storage uses strong adaptive hashing (Argon2id/bcrypt/scrypt) with unique salts; never plaintext.
- Login/register endpoints are rate-limited and protected by abuse controls (lockout/backoff/captcha where needed).
- Session TTL and idle timeout are documented and enforced.
- Logout invalidates server-side session state and rotates session identifiers after authentication.
- `GET /auth/me` returns only non-sensitive profile data required by UI (minimum necessary fields).
- Auth error responses avoid leaking sensitive account-enumeration details.

Operational recommendation:

- Record auth events (`login_success`, `login_failed`, `register_success`, `logout`) in monitoring/analytics with non-sensitive metadata only.

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
