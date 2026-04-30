# SceneForge

SceneForge is a full-stack MVP for discovering local underground metal and rock events, bands, venues, posters, and scene activity.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MySQL with Prisma ORM
- Auth: JWT + bcrypt password hashing
- Uploads: Mock Cloudinary upload service (replaceable)
- API: REST

## Monorepo Structure

```txt
/sceneforge
  /client
  /server
  /shared
```

## Prerequisites

- Node.js 20+
- npm 10+
- MySQL 8+

## MySQL Setup

Run in your MySQL client:

```sql
CREATE DATABASE sceneforge;
```

## Environment Files

Copy examples and update values:

- `server/.env.example` -> `server/.env`
- `client/.env.example` -> `client/.env`

Example server values:

```env
DATABASE_URL="mysql://root:password@localhost:3306/sceneforge"
JWT_SECRET="dev-secret"
PORT=5000
```

## Install

```bash
npm install
```

## Required Commands

```bash
npm install
npm run dev
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

Run Prisma commands from the `server` folder, or use the root commands listed below.

## Prisma Commands

From repo root:

```bash
npx prisma migrate dev --name init --schema server/prisma/schema.prisma
npx prisma generate --schema server/prisma/schema.prisma
npx prisma db seed --schema server/prisma/schema.prisma
```

Or with workspace scripts:

```bash
npm run prisma:migrate
npm run prisma:generate
npm run seed
```

## Run Development

```bash
npm run dev
```

This starts:

- Client: http://localhost:5173
- Server: http://localhost:5000

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id`
- `GET /api/bands`
- `GET /api/bands/:id`
- `GET /api/venues`
- `GET /api/venues/:id`
- `GET /api/posters`
- `GET /api/dashboard/events` (auth + role)
- `GET /api/saved-events` (auth)

## Notes

- The client attempts backend calls first and falls back to demo data for MVP safety.
- Upload handling is wired through a mock uploader service and ready for Cloudinary integration later.
