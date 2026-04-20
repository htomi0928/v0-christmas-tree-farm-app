# Contributing to Christmas Tree Farm App

Thank you for your interest in contributing! This document provides guidelines for development and contributions.

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm package manager
- PostgreSQL database (Neon)

### Local Setup

1. Clone the repository
```bash
git clone <repo-url>
cd v0-christmas-tree-farm-app
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
Create `.env.local` with required variables:
```env
AUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://...
```

4. Start development server
```bash
pnpm dev
```

## Code Standards

### Component Structure
- Split large components into smaller, reusable pieces
- Keep components in `/components` directory
- Use TypeScript for type safety
- Export types alongside components when applicable

### API Routes
- API routes should be in `/app/api` with clear file structure
- Use RESTful conventions (GET, POST, PATCH, DELETE)
- Validate all inputs on server side
- Return consistent JSON responses with `success` and `error` fields

### Styling
- Use TailwindCSS utility classes
- Follow the 3-5 color design system
- Use semantic design tokens (defined in `globals.css`)
- Never use hardcoded colors directly

### Database & Types
- Define types in `/lib/types.ts`
- Use parameterized SQL queries to prevent injection
- Add database utilities in `/lib/reservations.ts` or `/lib/expenses.ts`
- Keep SQL queries organized and documented

## Git Workflow

1. Create a feature branch from `main`
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit with clear messages
```bash
git commit -m "feat: add feature description"
```

3. Push to your branch
```bash
git push origin feature/your-feature-name
```

4. Open a Pull Request with a description of changes

## Testing & Validation

### Before committing:
1. Test locally with `pnpm dev`
2. Check for TypeScript errors
3. Verify forms work correctly
4. Test on mobile if UI changes
5. Run linter if configured

### Form Validation
- Always validate on both client and server
- Use Zod for schema validation
- Show user-friendly error messages
- Prevent invalid data submission

## Common Tasks

### Adding a New Feature
1. Define types in `/lib/types.ts`
2. Create API routes in `/app/api`
3. Build components in `/components`
4. Add validation (client + server)
5. Test thoroughly

### Database Changes
1. Create migration script in `/scripts`
2. Test the migration locally
3. Update types if schema changes
4. Document the changes

### Fixing Bugs
1. Write a clear commit message
2. Include the bug description in PR
3. Test the fix thoroughly
4. Check for similar issues elsewhere

## Code Review Checklist

- [ ] TypeScript types are correct
- [ ] No console errors in development
- [ ] Validation works (client + server)
- [ ] Mobile responsive (if UI changes)
- [ ] No fallback environment variables
- [ ] Proper error handling
- [ ] Tests pass (if applicable)
- [ ] Documentation updated

## Important Guidelines

### Security
- Never commit secrets or credentials
- Use environment variables for sensitive data
- Validate all user inputs
- Check authorization on protected routes
- Keep dependencies updated

### Performance
- Minimize re-renders using proper hooks
- Use Server Components where possible
- Optimize database queries
- Lazy load components when appropriate

### Accessibility
- Use semantic HTML elements
- Include proper ARIA labels
- Test with keyboard navigation
- Ensure sufficient color contrast

## Questions or Issues?

- Check existing documentation in `/docs`
- Review the main README for project overview
- Look at existing code patterns before implementing new features
