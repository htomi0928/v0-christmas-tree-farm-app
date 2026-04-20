# Development Guide

This guide covers local development setup, common workflows, and debugging tips.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager (or npm/yarn)
- PostgreSQL locally OR Neon database access
- Code editor (VS Code recommended)

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/htomi0928/v0-christmas-tree-farm-app.git
cd v0-christmas-tree-farm-app

# Install dependencies
pnpm install

# Create .env.local with database connection
echo 'DATABASE_URL=postgresql://...' > .env.local
echo 'AUTH_SECRET=dev-secret-key-not-for-production' >> .env.local
```

### 2. Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
v0-christmas-tree-farm-app/
├── app/
│   ├── (auth)/
│   │   └── admin-login/          # Login page
│   ├── admin/
│   │   ├── reservations/         # Reservation management
│   │   ├── expenses/             # Expense tracking
│   │   ├── settings/             # Settings page
│   │   └── layout.tsx            # Admin layout wrapper
│   ├── booking/                  # Public booking page
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/           # Login endpoint
│   │   │   └── reservations/    # Reservation CRUD
│   │   └── reservations/        # Public reservation API
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                       # Shadcn/UI components
│   ├── admin-header.tsx          # Admin header
│   ├── navigation.tsx            # Navigation component
│   ├── reservation-detail-client.tsx
│   ├── reservation-filters.tsx
│   ├── reservation-table.tsx
│   └── ...                       # Other components
├── lib/
│   ├── auth.ts                   # Auth utilities
│   ├── db.ts                     # Database connection
│   ├── reservations.ts           # Reservation logic
│   ├── expenses.ts               # Expense logic
│   ├── types.ts                  # TypeScript types
│   ├── api.ts                    # API helpers
│   └── site.ts                   # Site configuration
├── styles/
│   └── globals.css               # Tailwind config & design tokens
└── docs/                         # Documentation
```

## Database Setup

### Using Neon (Cloud)

Recommended for development:

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set in `.env.local`:
   ```env
   DATABASE_URL=postgresql://user:pass@...
   ```

### Using Local PostgreSQL

Alternatively, use a local database:

```bash
# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb christmas_tree_farm

# Get connection string
# postgresql://localhost/christmas_tree_farm
```

### Initialize Database

1. Create tables by running SQL scripts:
   ```bash
   # Tables should be created via Neon console or psql
   ```

2. Seed with test data (optional):
   ```sql
   INSERT INTO users (email, password_hash) VALUES 
   ('admin@example.com', '$2b$10$...');
   ```

## Development Workflows

### Adding a New Page

1. Create file in appropriate directory:
   ```
   app/admin/new-feature/page.tsx
   ```

2. Add to navigation in `components/navigation.tsx`

3. Test in development server

### Adding API Endpoint

1. Create route file:
   ```
   app/api/admin/new-endpoint/route.ts
   ```

2. Implement handler:
   ```typescript
   import { jsonError, jsonResponse } from "@/lib/api"
   
   export async function POST(request: Request) {
     // Validate request
     // Execute logic
     // Return response
     return jsonResponse({ success: true, data: {...} })
   }
   ```

3. Test with curl or API client

### Adding Database Query

1. Create helper function in appropriate lib file:
   ```typescript
   // lib/reservations.ts
   export async function getReservationById(id: number) {
     const result = await sql.query(
       'SELECT * FROM reservations WHERE id = $1',
       [id]
     )
     return result[0]
   }
   ```

2. Use in components or API routes

### Adding Component

1. Create in `/components`:
   ```typescript
   export function MyComponent({ prop }: MyComponentProps) {
     return <div>...</div>
   }
   
   interface MyComponentProps {
     prop: string
   }
   ```

2. Import and use in pages/components

3. Test locally

## Testing

### Manual Testing Checklist

Before committing code:

- [ ] No TypeScript errors: `pnpm run build`
- [ ] App renders without errors
- [ ] Forms validate correctly
- [ ] API endpoints return correct data
- [ ] Database queries work
- [ ] Mobile responsive (use DevTools)
- [ ] No console errors or warnings

### Testing Authentication

```bash
# Start dev server
pnpm dev

# Visit http://localhost:3000/admin-login
# Try invalid credentials - should show error
# Try valid credentials - should login
# Check that session cookie is set
```

### Testing Validation

Form validation happens on two levels:

1. **Client-side**: Real-time feedback with error messages
2. **Server-side**: Ensures data integrity

Test both:
```bash
# Try submitting form with invalid data in DevTools
# (Network tab should show 400 error from server)
```

### Testing Database

```typescript
// In your API route or helper
console.log("[v0] Query result:", result)

// Then check dev server console for output
```

## Debugging

### Enable Debug Logging

The app includes debug logs prefixed with `[v0]`:

```typescript
console.log("[v0] Current state:", formData)
```

View in:
- Terminal where `pnpm dev` is running
- Browser DevTools Console (for client-side logs)

### Common Issues

#### App won't start
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Try again
pnpm dev
```

#### Database connection fails
```bash
# Check connection string
echo $DATABASE_URL

# Verify database is running
psql -c "SELECT 1"

# Check .env.local is loaded
# Restart dev server
```

#### Build errors
```bash
# Check TypeScript
pnpm run build

# Fix errors shown in output
# Common issues:
# - Missing type definitions
# - Import path errors
# - Unused variables
```

#### Styles not working
- Check TailwindCSS is imported in `app/layout.tsx`
- Verify class names are correct
- Check `globals.css` has proper config
- Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)

## Code Quality

### TypeScript
- All files should have proper types
- Use `interface` for component props
- Avoid `any` type
- Use strict mode

### Naming Conventions
- Components: PascalCase (`MyComponent.tsx`)
- Functions: camelCase (`myFunction()`)
- Constants: UPPER_SNAKE_CASE (`MAX_USERS`)
- Files: kebab-case for files (`my-component.tsx`)

### Comments
- Write comments for complex logic
- Use `// TODO:` for planned work
- Use `// FIXME:` for known issues

## Performance Tips

### Image Optimization
- Use Next.js `Image` component
- Specify width/height
- Consider lazy loading

### Database
- Use indexes on frequently queried columns
- Avoid N+1 queries
- Cache when appropriate

### Bundling
- Code splitting happens automatically
- Monitor bundle size with `next/bundle-analyzer`

## Git Workflow

### Before Pushing

```bash
# Check for errors
pnpm run build

# Ensure tests pass
pnpm test  # if configured

# Review changes
git diff

# Commit with clear message
git commit -m "feat: describe your changes"
```

### Commit Messages

Follow conventional commits:
```
feat:   New feature
fix:    Bug fix
docs:   Documentation
style:  Formatting
refactor: Code restructuring
test:   Tests
chore:  Build, dependencies
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Neon Documentation](https://neon.tech/docs)

## Getting Help

1. Check existing issues on GitHub
2. Review code comments
3. Look at similar implementations
4. Read documentation
5. Ask in team discussions
