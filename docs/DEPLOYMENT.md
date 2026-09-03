# Deployment Guide

## Overview

The same `main` branch is deployed to Vercel + Neon and Dokploy + PostgreSQL. Each deployment uses only its own `DATABASE_URL`; the application has no synchronization, replication, or dual-write behaviour.

**Vercel + Neon is test/dev only and must never hold real customer data** — it exists to preview changes before they reach production. **Dokploy + VPS PostgreSQL (karifa.hu) is the production deployment** that real customers use, and is the only environment relevant to the app's GDPR/privacy notice.

## Prerequisites

1. **GitHub Repository** - connected to both deployments from `main`
2. **Vercel + Neon** - test/dev environment only, seeded with fake data
3. **Dokploy + VPS PostgreSQL** - production (karifa.hu, Contabo VPS, EU datacenter)

## Environment Variables

Use the same application code in both environments. Copy the complete variable list from [`.env.example`](../.env.example); do not copy secrets between independent environments.

### Vercel + Neon

```env
DEPLOY_TARGET=vercel
DATABASE_URL=postgresql://...neon.tech/...
```

Use Neon’s pooled connection string. Configure the same `AUTH_SECRET`, email, Cloudinary, and optional `SEED_ADMIN_KEY` values required by the application.

### Dokploy + VPS PostgreSQL

```env
DEPLOY_TARGET=vps
DATABASE_URL=postgresql://USER:PASSWORD@POSTGRES_HOST:5432/DATABASE
NIXPACKS_NODE_VERSION=22
```

Configure the same application secrets independently. Do not relax the secure cookie setting while the generated domain is HTTP; use an HTTPS domain before relying on admin login sessions.

### Required Variables

#### `AUTH_SECRET`
Secret key used for signing session cookies. Must be a strong, random string.

**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Set in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable: `AUTH_SECRET`
3. Set the generated value
4. Apply to: Production, Preview, Development

#### `DATABASE_URL`
PostgreSQL connection string for the current deployment.

**Format:**
```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**Vercel / Neon:**
1. Log into Neon console
2. Go to your project and database
3. Click "Connection string"
4. Copy the "Pooled connection" string
5. Use the pooled connection string

**Set in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable: `DATABASE_URL`
3. Paste the connection string
4. Apply to: Production, Preview, Development

#### `RESEND_API_KEY`
API key used to send reservation notification emails through Resend.

**Set in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable: `RESEND_API_KEY`
3. Paste the API key from Resend
4. Apply to: Production, Preview, Development

#### `RESERVATION_NOTIFY_TO`
Comma-separated list of internal email recipients for new reservation notifications.

**Example:**
```env
RESERVATION_NOTIFY_TO=owner@example.com,staff@example.com
```

**Set in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable: `RESERVATION_NOTIFY_TO`
3. Paste the recipient list
4. Apply to: Production, Preview, Development

#### `RESERVATION_EMAIL_FROM`
Verified sender identity in Resend.

**Example:**
```env
RESERVATION_EMAIL_FROM=Foglalás <noreply@yourdomain.tld>
```

**Set in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable: `RESERVATION_EMAIL_FROM`
3. Paste the verified sender identity
4. Apply to: Production, Preview, Development

#### `CLOUDINARY_CLOUD_NAME`
Cloudinary cloud name for admin reservation photo uploads.

#### `CLOUDINARY_API_KEY`
Cloudinary API key for signed upload and destroy calls.

#### `CLOUDINARY_API_SECRET`
Cloudinary API secret for request signing.

## Database Setup

### Initial Setup

1. **Create an empty PostgreSQL database** in Neon or on the VPS.
2. **Create tables** by running the canonical schema. There are no automated migrations:
   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

   After tables exist, seed an admin via:
   ```bash
   curl -X POST "$DEPLOYED_URL/api/seed-admin" \
     -H "x-seed-key: $SEED_ADMIN_KEY" \
     -H "content-type: application/json" \
     -d '{"username":"admin","password":"<at-least-12-chars>"}'
   ```

### Schema

[`db/schema.sql`](../db/schema.sql) is the single canonical schema file. It contains all required tables, indexes, foreign keys, checks, and the one-active-year constraint. It uses idempotent `CREATE ... IF NOT EXISTS` statements and does not delete existing data.

### Legacy schema reference

The app requires the following tables in PostgreSQL. Field names below match what the code reads/writes (see `lib/db.ts`, `lib/reservations.ts`, `lib/expenses.ts`, `lib/settings.ts`, `lib/years.ts`, `lib/auth.ts`).

Operational data is partitioned by calendar year: `reservations`, `expenses`, and `settings` all have a `year` column with an FK to `years.year`. The `years` table is the source of truth for which seasons exist and which one is currently active (used by the public booking page).

For an existing database that predates this partitioning, run [scripts/add-year-partitioning.sql](../scripts/add-year-partitioning.sql) once — it adds the `year` columns, backfills 2026, creates the `years` table, and adds the FK constraints.

#### `admin_users` table
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

`password_hash` stores PBKDF2-SHA256 output as `<salt-hex>:<hash-hex>` (100k iterations, 16-byte salt). Use `POST /api/seed-admin` with the `SEED_ADMIN_KEY` header to insert the initial admin without hashing manually.

#### `years` table
```sql
CREATE TABLE years (
  year       INTEGER PRIMARY KEY,
  is_active  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX years_one_active ON years (is_active) WHERE is_active = TRUE;

INSERT INTO years (year, is_active) VALUES (2026, TRUE);
```

The partial unique index enforces that at most one row has `is_active = TRUE`. The app's `activateYear` helper runs the swap in a transaction.

#### `reservations` table
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL REFERENCES years(year),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  visit_date DATE NOT NULL,
  pickup_date DATE,
  tree_count INTEGER NOT NULL,
  notes TEXT,
  tree_numbers TEXT,            -- comma-separated integers; uniqueness enforced in app code, scoped per year
  status VARCHAR(50) NOT NULL DEFAULT 'BOOKED',
  paid_to VARCHAR(50),          -- a partner name from lib/partners.ts, once paid
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX reservations_year_idx ON reservations (year);
```

#### `expenses` table
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL REFERENCES years(year),
  person VARCHAR(50) NOT NULL,  -- a partner name from lib/partners.ts
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX expenses_year_idx ON expenses (year);
```

#### `settings` table

One row per year. Created automatically when `createYear` runs; if missing, the app falls back to in-memory defaults (see `lib/years.ts` `defaultSettingsFor`).

```sql
CREATE TABLE settings (
  year INTEGER PRIMARY KEY REFERENCES years(year),
  available_days TEXT,                            -- comma-separated YYYY-MM-DD
  max_bookings_per_day INTEGER NOT NULL DEFAULT 20, -- cap on reservation COUNT per visit_date, not tree count
  max_trees_per_season INTEGER NOT NULL DEFAULT 500, -- season-wide cap on SUM(tree_count)
  retrieval_days TEXT,                            -- comma-separated YYYY-MM-DD
  price NUMERIC NOT NULL DEFAULT 8000             -- price per tree in HUF
);

INSERT INTO settings (year, max_bookings_per_day, max_trees_per_season, price) VALUES (2026, 20, 500, 8000);
```

## Deployment Process

### Production (Dokploy + VPS, karifa.hu)

1. Push/merge to `main`
2. Dokploy detects changes and builds/deploys to the Contabo VPS
3. Check build logs and container status in the Dokploy dashboard
4. Verify `https://karifa.hu` after deployment

### Test/Dev (Vercel)

1. Push/merge to `main`
2. Vercel auto-deploys to its own preview/test project (points at Neon, never real customer data)
3. Monitor via the Vercel Dashboard as before

## Configuration

### Custom Domain (production)

`karifa.hu` is configured directly in Dokploy/the VPS reverse proxy (not through Vercel's domain settings). Point DNS at the VPS IP and let the reverse proxy (or `certbot`) issue/renew the TLS certificate.

### Environment Variables

- **Production**: set in the Dokploy app's environment variables panel; redeploy for changes to take effect
- **Test/dev**: set in Vercel Project Settings → Environment Variables

## Monitoring & Maintenance

### View Logs

- **Production**: Dokploy dashboard → app → Logs, or `docker logs`/journal on the VPS depending on setup
- **Test/dev**: Vercel Dashboard → Project → deployment → Logs tab

### Performance & Error Tracking

There is no analytics/APM service wired up (Vercel Analytics/Speed Insights were removed). For production, rely on Dokploy/VPS-level logs and the `/api/health` endpoint; add a dedicated monitoring tool later if needed.

## Troubleshooting

### Build Failures

**Problem:** Deployment fails during build

**Solutions:**
1. Check build logs (Dokploy for production, Vercel for test/dev)
2. Verify all environment variables are set for that environment
3. Check for TypeScript errors: `pnpm exec tsc --noEmit`
4. Ensure database schema is correct

### Database Connection Issues

**Problem:** "DATABASE_URL environment variable is required"

**Solutions:**
1. Verify `DATABASE_URL` is set in the environment that's failing (Dokploy for production, Vercel for test/dev)
2. Check connection string format is correct
3. Production: confirm the VPS PostgreSQL instance is running; test/dev: confirm the Neon database is active
4. Test/dev only: verify IP whitelist settings in Neon

### Reservation Email Issues

**Problem:** New reservations are saved but notification emails are not sent

**Solutions:**
1. Verify `RESEND_API_KEY` is set in the relevant environment
2. Verify `RESERVATION_NOTIFY_TO` contains valid comma-separated email addresses
3. Verify `RESERVATION_EMAIL_FROM` is a verified sender in Resend
4. Check application logs for `[email]` warnings and API errors

### Authentication Issues

**Problem:** Can't log in to admin panel

**Solutions:**
1. Verify `AUTH_SECRET` is set in the relevant environment
2. Check that `admin_users` table exists in the database
3. Verify the admin account exists with the correct username/password
4. Check session cookie settings

### Tree Number Conflicts

**Problem:** "Tree numbers already in use"

**Solutions:**
1. Check existing reservations for the same tree numbers
2. Verify `tree_numbers` field is not corrupted
3. Run database integrity check

## Rollback

**Production (Dokploy):** redeploy the previous known-good commit/tag through Dokploy, or `git revert` on `main` and let it redeploy automatically.

**Test/dev (Vercel):** Vercel Dashboard → find the previous working deployment → "Promote to Production" (of the Vercel project, i.e. its own test/dev environment).

## Security Checklist

Before relying on the production (karifa.hu) deployment:

- [ ] `AUTH_SECRET` is set to a strong random value, distinct from the test/dev value
- [ ] `DATABASE_URL` uses a secure connection string (postgresql://) to the VPS PostgreSQL instance
- [ ] `RESEND_API_KEY` is configured
- [ ] `RESERVATION_NOTIFY_TO` includes at least one valid recipient
- [ ] `RESERVATION_EMAIL_FROM` is verified in Resend
- [ ] Database credentials are not in code
- [ ] Same-origin (`enforceSameOrigin`) checks active in production (automatic when `NODE_ENV=production`)
- [ ] All environment variables are configured on the VPS/Dokploy, independently from Vercel
- [ ] TLS is enabled for `karifa.hu` (via the reverse proxy / certbot)
- [ ] Database backups are configured for the VPS PostgreSQL instance (Neon backups do not cover production)
- [ ] Admin credentials are changed from defaults
- [ ] `SEED_ADMIN_KEY` is a strong random value and is rotated/removed once the initial admin account is seeded — `/api/seed-admin` stays live in production and can overwrite admin credentials for anyone holding that key
- [ ] The Vercel test/dev deployment is confirmed to point at a separate Neon database seeded with fake data only — never real customer data

## Backup & Recovery

### Database Backups

Production data lives in PostgreSQL on the VPS, not Neon — Neon's automatic backups only cover the test/dev database. Configure your own backup strategy for the VPS instance (e.g. scheduled `pg_dump`, or Contabo/VPS-level snapshots) and verify restores periodically.

### Code Backup

The entire codebase is backed up via the GitHub repository (version control). Dokploy deployment history depends on your Dokploy retention settings.

## Performance Optimization

### Database Optimization

1. Add indexes to frequently queried columns:
   ```sql
   CREATE INDEX idx_reservations_date ON reservations(date);
   CREATE INDEX idx_reservations_status ON reservations(status);
   ```

2. Monitor slow queries directly against the VPS PostgreSQL instance

### Frontend Optimization

Next.js automatically optimizes code splitting and static generation where possible. `images.unoptimized: true` is set in `next.config.mjs`, so image optimization is not applied — revisit this if the VPS setup should serve optimized images.

## Support

For issues or questions:
1. Check Dokploy documentation for production deployment issues
2. Check Neon/Vercel documentation for test/dev environment issues
3. Review GitHub repository issues


### Cloudinary Reservation Photo Variables
- CLOUDINARY_CLOUD_NAME - Cloudinary cloud name.
- CLOUDINARY_API_KEY - Cloudinary API key.
- CLOUDINARY_API_SECRET - Cloudinary API secret.

