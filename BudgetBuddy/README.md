# BudgetBuddy

App de controlo financeiro pessoal em **Next.js + Prisma + PostgreSQL**.

> Nota: este setup foi simplificado para **uso pessoal/local**.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Zod
- Vitest + Playwright
- ESLint + Prettier

## 1) Pré-requisitos
- Node.js 20+
- npm 10+
- Docker (recomendado para subir Postgres local)

## 2) Configurar variáveis de ambiente
Na pasta `BudgetBuddy/`:

```bash
cp .env.example .env
```

Depois, altera o `NEXTAUTH_SECRET` no ficheiro `.env`.

## 3) Subir PostgreSQL local
```bash
docker compose up -d
```

## 4) Instalar dependências
```bash
npm install
```

## 5) Migrar, popular e arrancar a app
```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Abre: http://localhost:3000

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run db:migrate`
- `npm run db:seed`

## Conta de seed
Após `npm run db:seed`:
- Email: `demo@budgetbuddy.dev`
- Password: `Password123!`

## Troubleshooting rápido (uso pessoal)
Se `npm install` falhar:
1. Confirma internet ativa.
2. Confirma registry npm:
   ```bash
   npm config get registry
   ```
   Deve ser: `https://registry.npmjs.org/`
3. Limpa proxy do npm (se não usas proxy):
   ```bash
   npm config delete proxy
   npm config delete https-proxy
   ```
4. Tenta novamente:
   ```bash
   npm install
   ```
