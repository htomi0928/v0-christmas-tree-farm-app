# Deployment Guide

## Overview

This app is deployed on Vercel and uses Neon PostgreSQL for the database. Changes are automatically synchronized from this repository.

## Prerequisites

1. **Vercel Account** - Already set up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Repository connected to Vercel
3. **Neon Database** - PostgreSQL database set up with tables

## Environment Variables

The following environment variables must be configured in Vercel:

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
PostgreSQL connection string from Neon.

**Format:**
```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

**Get from Neon:**
1. Log into Neon console
2. Go to your project and database
3. Click "Connection string"
4. Copy the "Pooled connection" string
5. Use the `postgres://` variant (not `postgresql://`)

**Set in Vercel:**
1. Go to Project Settings → Environment Variables
2. Add variable: `DATABASE_URL`
3. Paste the connection string
4. Apply to: Production, Preview, Development

## Database Setup

### Initial Setup

1. **Create Database** in Neon
2. **Run migrations** to create tables:
   ```bash
   pnpm run build
   # Then manually run SQL scripts from /scripts directory
   ```

### Required Tables

The app requires the following tables in PostgreSQL:

#### `users` table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `reservations` table
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  date DATE NOT NULL,
  trees INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  tree_numbers TEXT,
  paid_to VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `expenses` table
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment Process

### Automatic Deployments

Changes are automatically deployed when:
1. Code is pushed to the main branch
2. Pull requests are merged to main
3. Vercel detects changes in the repository

### Manual Deployment

Trigger a manual deployment:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the `v0-christmas-tree-farm-app` project
3. Click "Redeploy" on the latest deployment

### Deployment Status

Monitor deployments:
1. Go to Vercel Dashboard → Project
2. View deployment history
3. Check build logs if deployment fails
4. View live URL when deployment is complete

## Configuration

### Custom Domain

If using a custom domain:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate generation

### Environment Variables

Update environment variables:
1. Go to Project Settings → Environment Variables
2. Modify values as needed
3. Redeploy the project for changes to take effect

## Monitoring & Maintenance

### View Logs

Check application logs:
1. Go to Vercel Dashboard → Project
2. Click on a deployment
3. View "Logs" tab

### Performance

Monitor performance:
1. Go to Project Settings → Analytics
2. View request metrics and response times
3. Check Vercel Speed Insights

### Error Tracking

For production errors:
1. Check Vercel logs
2. Monitor database connection health
3. Verify environment variables are correctly set

## Troubleshooting

### Build Failures

**Problem:** Deployment fails during build

**Solutions:**
1. Check build logs in Vercel
2. Verify all environment variables are set
3. Check for TypeScript errors: `pnpm run build`
4. Ensure database schema is correct

### Database Connection Issues

**Problem:** "DATABASE_URL environment variable is required"

**Solutions:**
1. Verify `DATABASE_URL` is set in Vercel
2. Check connection string format is correct
3. Ensure Neon database is active and running
4. Verify IP whitelist settings in Neon

### Authentication Issues

**Problem:** Can't log in to admin panel

**Solutions:**
1. Verify `AUTH_SECRET` is set in Vercel
2. Check that `users` table exists in database
3. Verify user account exists with correct email/password
4. Check session cookie settings

### Tree Number Conflicts

**Problem:** "Tree numbers already in use"

**Solutions:**
1. Check existing reservations for the same tree numbers
2. Verify `tree_numbers` field is not corrupted
3. Run database integrity check

## Rollback

If a deployment has issues:

1. Go to Vercel Dashboard
2. Find the previous working deployment
3. Click the three dots (⋯)
4. Select "Promote to Production"
5. The previous version will be restored

## Security Checklist

Before deploying to production:

- [ ] `AUTH_SECRET` is set to a strong random value
- [ ] `DATABASE_URL` uses a secure connection string (postgresql://)
- [ ] Database credentials are not in code
- [ ] CORS checks are enabled for production
- [ ] All environment variables are configured
- [ ] SSL/TLS is enabled for custom domains
- [ ] Database backups are configured in Neon
- [ ] Admin credentials are changed from defaults

## Backup & Recovery

### Database Backups

Neon provides automatic backups. To restore:

1. Log into Neon console
2. Go to your database
3. Click "Backups"
4. Select a backup point
5. Click "Restore"

### Code Backup

The entire codebase is backed up by:
1. GitHub repository (version control)
2. Vercel deployment history (up to 100 deployments)

## Performance Optimization

### Database Optimization

1. Add indexes to frequently queried columns:
   ```sql
   CREATE INDEX idx_reservations_date ON reservations(date);
   CREATE INDEX idx_reservations_status ON reservations(status);
   ```

2. Monitor slow queries in Neon

### Frontend Optimization

1. Next.js automatically optimizes:
   - Code splitting
   - Image optimization
   - Static generation where possible

2. Monitor Core Web Vitals in Vercel Analytics

## Support

For issues or questions:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Neon documentation: [neon.tech/docs](https://neon.tech/docs)
3. Review GitHub repository issues
4. Contact Vercel support if needed
