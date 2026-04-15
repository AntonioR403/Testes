# BudgetBuddy

App de controlo financeiro pessoal em **Next.js + Prisma + PostgreSQL**.

Este projeto agora suporta **2 modos de backend**:
1. **Backend Next.js (atual no repositório)**
2. **Backend ASP.NET API (modo recomendado para ti)**

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Credentials)
- Zod
- Vitest + Playwright
- ESLint + Prettier

## Pré-requisitos
- Node.js 20+
- npm 10+
- Docker (recomendado para subir Postgres local)

## Configurar variáveis de ambiente
Na pasta `BudgetBuddy/`:

```bash
cp .env.example .env
```

Depois, altera o `NEXTAUTH_SECRET` no ficheiro `.env`.

## Subir PostgreSQL local
```bash
docker compose up -d
```

---

## Modo 1 — Backend Next.js (default)
Mantém no `.env`:

```env
NEXT_PUBLIC_USE_DOTNET_BACKEND="false"
```

E arranca:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Abre: http://localhost:3000

---

## Modo 2 — Backend ASP.NET API (segunda maneira)
Se vais usar backend em C#, configura no `.env`:

```env
NEXT_PUBLIC_USE_DOTNET_BACKEND="true"
ASPNET_API_BASE_URL="http://localhost:5099/api"
```

Neste modo, o frontend chama `/api-proxy/*` no Next.js e o proxy encaminha para o teu ASP.NET API.

### Endpoints esperados no backend C#
- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET/POST /api/categories`
- `PATCH/DELETE /api/categories/{id}`
- `GET/POST /api/transactions`
- `PATCH/DELETE /api/transactions/{id}`
- `GET/POST /api/budgets`
- `PATCH/DELETE /api/budgets/{id}`
- `GET /api/dashboard?month=...`

> Dica: mantém os mesmos formatos JSON do frontend atual (`{ data: ... }` e `{ error: ... }`).

---

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

## Conta de seed (modo Next.js backend)
Após `npm run db:seed`:
- Email: `demo@budgetbuddy.dev`
- Password: `Password123!`

## Troubleshooting rápido
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
