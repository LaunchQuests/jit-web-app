# jit-web-app
jit-followup-portal/
├─ app/
│  ├─ admin/
│  │  ├─ page.tsx
│  │  └─ showrooms/
│  │     └─ [id]/
│  │        └─ page.tsx
│  ├─ api/
│  │  └─ export/
│  │     └─ [id]/
│  │        └─ route.ts
│  ├─ follow-ups/
│  │  └─ page.tsx
│  ├─ login/
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ filter-bar.tsx
│  ├─ follow-up-form.tsx
│  ├─ follow-up-table.tsx
│  ├─ login-form.tsx
│  ├─ logout-button.tsx
│  ├─ showroom-form.tsx
│  ├─ showroom-shell.tsx
│  ├─ theme-toggle.tsx
│  └─ ui.tsx
├─ lib/
│  ├─ auth.ts
│  ├─ export.ts
│  ├─ prisma.ts
│  ├─ queries.ts
│  ├─ server-actions.ts
│  ├─ utils.ts
│  └─ validations.ts
├─ prisma/
│  └─ schema.prisma
├─ .env.example
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.ts
└─ tsconfig.json


# Just-In-Time Follow-Up Portal

A touch-first showroom follow-up CRM built for multi-store retail teams in India.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT auth
- bcrypt password hashing
- XLSX export

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```

## Deployment

### Amazon Lightsail (Ubuntu)

1. Create a Linux/Ubuntu Lightsail instance and open ports 80, 443, and 22.
2. Install Node.js 20+, Nginx, and PM2 on the server.
3. Clone the repository into `/var/www/jit-web-app` and install dependencies with `npm ci`.
4. Create a `.env` file with:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `SUPER_ADMIN_USERNAME`
   - `SUPER_ADMIN_PASSWORD`
5. Run Prisma migrations and seed the super admin:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```
6. Build and start the app:
   ```bash
   npm run build
   pm2 start npm --name jit-web-app -- start
   pm2 save
   ```
7. Configure Nginx as a reverse proxy to `http://127.0.0.1:3000` and enable HTTPS with Let’s Encrypt.

### Notes

- The login flow now uses a CSRF token and failed-login rate limiting.
- Theme preference is stored in a cookie so it survives refreshes and visits.