# AssetFlow

Enterprise Asset & Resource Management System for the Oddo hackathon.

Organizations can manage departments, employees, assets, allocations, shared-resource bookings, maintenance approvals, audits, notifications, and operational analytics — with proper role-based access.

## Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind
- **Backend:** Express 5 + TypeScript
- **Database:** PostgreSQL 16 (Docker)

## Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Organization setup, employee role promotion, audits, org-wide analytics |
| **Asset Manager** | Register/allocate assets, approve transfers/maintenance/returns |
| **Department Head** | Approve dept transfers, book for department, view dept assets |
| **Employee** | View own assets, book resources, raise maintenance, request transfer/return |

Signup always creates an **Employee** account. Admins promote people from Organization → Employees.

## Modules

| Area | API prefix | Dashboard route |
|------|------------|-----------------|
| Auth | `/api/auth` | `/auth/signin`, `/auth/signup`, forgot/reset/verify |
| Organization | `/api/departments`, `/api/categories`, `/api/users` | `/dashboard/organization` |
| Assets | `/api/assets` | `/dashboard/assets` |
| Allocations & Transfers | `/api/allocations`, `/api/transfers` | `/dashboard/allocations` |
| Bookings | `/api/bookings` | `/dashboard/bookings` |
| Maintenance | `/api/maintenance` | `/dashboard/maintenance` |
| Audits | `/api/audits` | `/dashboard/audits` |
| Notifications & logs | `/api/notifications` | `/dashboard/notifications` |
| KPIs | `/api/dashboard` | `/dashboard` |
| Analytics / Reports | `/api/analytics`, `/api/reports` | `/dashboard/analytics` |

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Start Postgres (Docker Desktop must be running):

```bash
docker compose up -d db
```

3. Env files:

- Root: `.env.local` (from `.env.example`)
- Backend: `server/.env` (from `server/.env.example`) — default DB URL `postgresql://starter:starter@localhost:5432/starter`

4. Run migrations (schema + seed admin + demo users/assets):

```bash
npm run server:migrate
```

5. Start API + web app:

```bash
npm run server:dev
npm run dev
```

Open http://localhost:3000

## Seed logins (password for all: `Admin1234!`)

| Email | Role |
|-------|------|
| `admin@assetflow.local` | Admin |
| `manager@assetflow.local` | Asset Manager |
| `head@assetflow.local` | Department Head |
| `employee@assetflow.local` | Employee |

Signup creates Employee accounts only. Promote roles from Organization → Employees.

## Core workflows covered

1. Login / signup (employee-only signup; email verify when Resend is configured; auto-active + auto-login locally without `RESEND_API_KEY`)
2. KPI dashboard with overdue returns highlighted + notifications
3. Organization setup: departments, categories, employee directory + role promotion
4. Asset registration with auto tags (`AF-0001`…), lifecycle statuses, search/filter
5. Allocation with double-allocation blocked + transfer request workflow
6. Shared resource booking with overlap validation
7. Maintenance approval workflow (Pending → Approved → Technician Assigned → In Progress → Resolved)
8. Audit cycles with auditor assignment + discrepancy report on close
9. Live analytics + CSV exportable reports
10. Notifications + activity logs

## Useful commands

```bash
npm run dev
npm run server:dev
npm run server:migrate
npm run build
npm run server:build
docker compose up -d db
```
