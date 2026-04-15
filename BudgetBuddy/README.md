# BudgetBuddy

BudgetBuddy is a Next.js (App Router) + TypeScript budgeting app scaffold with Prisma/PostgreSQL, NextAuth, Zod validation, Vitest, Playwright, ESLint, and Prettier.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Zod
- Vitest + Playwright
- ESLint + Prettier

## Environment variables
Create `.env` in `BudgetBuddy/` with:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/budgetbuddy"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Local setup

```bash
cd BudgetBuddy
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000.

## Available scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run db:migrate`
- `npm run db:seed`

## Seed account
After seeding:
- Email: `demo@budgetbuddy.dev`
- Password: `Password123!`
