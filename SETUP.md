# TourCraft Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase or local)

## Quick Start

1. **Install dependencies** (already done)
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local .env
   # Edit DATABASE_URL to point to your PostgreSQL instance
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed database with demo data**
   ```bash
   npm run db:seed
   ```
   Default admin: `admin@tourcraft.app` / `admin123`

5. **Start development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXT_PUBLIC_APP_URL` | Public app URL |

## Key Routes

| Route | Description |
|-------|-------------|
| `/login` | Admin login |
| `/admin/dashboard` | Dashboard |
| `/admin/tours` | Tour programs list |
| `/admin/tours/new` | Create new tour (7-step wizard) |
| `/admin/library/visit-points` | Library management |
| `/admin/settings/general` | Company settings |
| `/tour/[slug]` | Public tour page |
