# 🎄 Christmas Tree Farm App

A full-stack web application for managing Christmas tree farm operations, including customer reservations, tree inventory, expenses tracking, and admin authentication.

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hollositamas-projects/v0-christmas-tree-farm-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/uLhcWiTTbMh)

## Overview

A comprehensive management system for Christmas tree farm operations. The app features:

- **Public Booking**: Customers can reserve trees for specific dates
- **Admin Dashboard**: Secure admin interface for managing reservations, expenses, and settings
- **Reservation Management**: Track reservation status from tagged → cut → picked up
- **Tree Inventory**: Manage tree numbers and prevent double-booking
- **Expense Tracking**: Record and categorize farm expenses
- **Data Persistence**: All data stored securely in Neon PostgreSQL

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API Routes, Server Components
- **Database**: Neon PostgreSQL with SQL client
- **Authentication**: Custom password-based admin authentication
- **UI Components**: Radix UI + shadcn/ui patterns
- **Forms**: React Hook Form + Zod validation
- **Utilities**: Date-fns, Recharts, Framer Motion

## Features

### Public Booking Page
- Browse available dates
- Reserve trees with customer details
- Real-time availability tracking
- Mobile-responsive design

### Admin Dashboard
- Secure login with session management
- View all reservations with filtering and sorting
- Edit reservation details with validation
- Track payment status and pick-up information
- Manage expenses
- View system statistics

### Validation & Security
- Form input validation (client + server)
- Tree number uniqueness checking across reservations
- Secure authentication with session tokens
- CORS protection (enabled in production)
- Environment variable management

## Project Structure

```
├── app/
│   ├── (auth)/          # Login page
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   └── booking/         # Public booking page
├── components/          # Reusable React components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   ├── reservations.ts  # Reservation logic
│   ├── expenses.ts      # Expense logic
│   ├── types.ts         # TypeScript types
│   └── api.ts           # API helpers
├── docs/                # Documentation
└── scripts/             # Database scripts (if any)
```

## Environment Variables

Required environment variables (set in Vercel):

```env
AUTH_SECRET              # Secret key for session signing
DATABASE_URL            # Neon PostgreSQL connection string
RESEND_API_KEY          # API key from Resend
RESERVATION_NOTIFY_TO   # Comma-separated internal recipients
RESERVATION_EMAIL_FROM  # Verified sender, e.g. Foglalás <noreply@yourdomain.tld>
```

## Development

### Install dependencies
```bash
pnpm install
```

### Run development server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for production
```bash
pnpm build
pnpm start
```

## Deployment

Your project is live at:

**[https://vercel.com/hollositamas-projects/v0-christmas-tree-farm-app](https://vercel.com/hollositamas-projects/v0-christmas-tree-farm-app)**

### How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Database

The app uses Neon PostgreSQL for data persistence. Key tables include:

- `users` - Admin user accounts with hashed passwords
- `reservations` - Customer reservations with status tracking
- `expenses` - Farm expenses with categorization

## API Routes

### Admin Routes
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/reservations` - List all reservations
- `GET /api/admin/reservations/[id]` - Get specific reservation
- `PATCH /api/admin/reservations/[id]` - Update reservation with validation
- `DELETE /api/admin/reservations/[id]` - Delete reservation

### Public Routes
- `GET /api/reservations` - Get available dates and reservation counts
- `POST /api/reservations` - Create new reservation

## Security Notes

- Admin passwords are hashed with bcrypt
- Sessions are managed with HTTP-only cookies
- Origin checks prevent CSRF attacks in production
- All inputs are validated on client and server
- Database queries use parameterized statements
