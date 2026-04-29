# SceneForge

SceneForge is a full-stack web MVP for discovering local underground metal and rock shows, bands, venues, and scene activity.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MySQL + Prisma ORM
- Auth: JWT (bcrypt password hashing)
- API style: REST
- Uploads: Cloudinary-ready structure with mock upload flow

## Monorepo Structure

```text
/sceneforge
  /client
  /server
  /shared
```

## Core Entities

- User
- Band
- Venue
- Event
- Poster
- Setlist
- SavedEvent

## User Roles

- fan
- band_admin
- venue_admin
- admin

## Features Included (MVP)

- Landing, Events, Event Details, Bands, Band Profile, Venues, Venue Profile, Poster Wall pages
- Role-aware dashboard pages (overview, events, profile management, poster upload placeholder)
- Login/Register UI flow
- Reusable UI components and clean modular frontend folders
- REST API routes for auth, discovery, dashboard event management, posters, and saved events
- Prisma schema and seed data for demo users, bands, venues, events, posters, setlists, and saved events

## Backend Architecture

Server code follows a 3-layer architecture:

- Controller layer: handles HTTP requests/responses and calls logic functions
- Logic layer: handles validation, business rules, permissions, and transformations
- Dao layer: handles all Prisma/MySQL queries

Folder layout:

- server/src/controllers
- server/src/logic
- server/src/dao
- server/src/routes
- server/src/middleware
- server/src/prisma
- server/src/types
- server/src/utils

Flow:

Request -> Route -> Controller -> Logic -> Dao -> Prisma/MySQL -> Dao -> Logic -> Controller -> Response

This keeps routes thin, avoids Prisma usage in controllers, and centralizes business rules in logic.

## Prerequisites

- Node.js 18+
- MySQL running locally

## MySQL Setup

1. Make sure MySQL is running.
2. Open MySQL Workbench or MySQL terminal.
3. Run:

```sql
CREATE DATABASE IF NOT EXISTS sceneforge
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

4. Update /server/.env:

```env
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/sceneforge"
JWT_SECRET="dev-secret-change-me"
PORT=5000
```

5. Run Prisma commands from the /server folder:

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

6. Confirm the database was created and tables exist.

## Environment Setup

1. Copy env examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Example server env values:

```env
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/sceneforge"
JWT_SECRET="dev-secret-change-me"
PORT=5000
```

## Install and Run

From monorepo root:

```bash
npm install
npm run dev
```

This starts:

- client on Vite default port (5173)
- server on port 5000

## Prisma Commands

Run these from the monorepo root:

```bash
npx prisma migrate dev --name init --schema server/prisma/schema.prisma
npx prisma generate --schema server/prisma/schema.prisma
npx prisma db seed --schema server/prisma/schema.prisma
```

Or use workspace scripts:

```bash
npm run prisma:migrate --workspace server
npm run prisma:generate --workspace server
npm run prisma:seed --workspace server
```

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/events
- GET /api/events/:id
- GET /api/bands
- GET /api/bands/:id
- GET /api/venues
- GET /api/venues/:id
- GET /api/posters
- POST /api/posters (mock upload)
- GET /api/dashboard/events
- POST /api/dashboard/events
- PUT /api/dashboard/events/:id
- GET /api/saved-events
- POST /api/saved-events
- DELETE /api/saved-events/:eventId

## Frontend Folder Layout

- client/src/components
- client/src/pages
- client/src/layouts
- client/src/services
- client/src/types
- client/src/hooks
- client/src/utils

## Notes

- Frontend services fall back to demo data if backend is unavailable, so the UI works immediately.
- Cloudinary is intentionally mocked in this version via server utility and poster route.
- Prisma datasource is configured for MySQL only.
- After changing client/.env values (for example VITE_API_URL), restart the Vite dev server so the new env values are applied.
- Global parallax background image path is client/public/site-background.png (served at /site-background.png).
