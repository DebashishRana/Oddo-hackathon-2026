# SaaS Starter

This repository is a stripped-down starter template for hackathons and new SaaS apps.

It keeps the shared infrastructure:

- Frontend shell with landing, auth, and dashboard routes
- Backend API with JWT cookie auth, RBAC, logging, and Postgres access
- Migration structure for local development
- A sample backend module you can copy for new features

It removes the old product-specific OCR, compliance, pricing, and billing flows, while keeping a generic auth and dashboard scaffold.

## Structure

- `src/app/` - Next.js app router pages and layouts
- `src/features/` - Frontend feature modules
- `server/src/modules/` - Backend modules
- `server/src/db/` - Database repositories and models
- `server/migrations/` - SQL migrations

## What is included

- Landing page with hero, feature placeholders, and auth links
- Dashboard shell with sidebar, topbar, and example pages
- Auth endpoints for register, login, logout, current session, Google OAuth, and email verification
- Profile endpoints for `me` and profile updates
- Role-based access control middleware
- Sample module: `sample-entity`

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Copy env files and fill them in.

- Root frontend env: `.env.local`
- Backend env: `server/.env`

3. Start Postgres.

```bash
docker compose up -d db
```

4. Run migrations.

```bash
npm run server:migrate
```

5. Start the backend.

```bash
npm run server:dev
```

6. Start the frontend.

```bash
npm run dev
```

## Environment Variables

Frontend:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_API_BASE_URL`

Backend:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `APP_URL`
- `CORS_ORIGINS`
- `COOKIE_NAME`
- `COOKIE_SECURE`
- `APP_NAME`
- `RESEND_API_KEY`
- `RESEND_FROM`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `VERIFICATION_CODE_TTL_MINUTES`

## Adding a new feature module

Backend:

- Create a folder in `server/src/modules/<feature-name>/`
- Add a controller, service, and routes file
- Register the router in `server/src/modules/index.ts`
- Add any tables or columns in `server/migrations/`

Frontend:

- Create a folder in `src/features/<feature-name>/`
- Add page or component files there
- Wire the feature into `src/app/` routes or layouts

## Useful commands

```bash
npm run dev
npm run server:dev
npm run server:migrate
npm run server:build
npm run build
```

## Example backend endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`
- `POST /api/auth/email/send-verification`
- `POST /api/auth/email/verify`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users` - admin only
- `GET /api/sample-entities` - authenticated
- `POST /api/sample-entities` - authenticated
