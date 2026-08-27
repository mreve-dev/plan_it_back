# Plan'it — Backend API

*[Lire en français](../README.md)*

REST API for **Plan'it**, a volunteer management application for a badminton club. It allows administrators to create events and missions with time slots, and lets volunteers sign up for the slots that interest them.

## 🧱 Tech Stack

- **[NestJS](https://nestjs.com/)** — Node.js framework, structured in modules/controllers/services
- **[Prisma ORM](https://www.prisma.io/)** + **MySQL** — data access and migrations
- **JWT** (access + refresh token) — authentication via `@nestjs/jwt`
- **[Argon2](https://github.com/ranisalt/node-argon2)** — password hashing
- **[class-validator](https://github.com/typestack/class-validator)** — DTO validation
- **[Resend](https://resend.com/)** — transactional emails (welcome, password reset)
- **Docker / docker-compose** — containerized development environment (API + MySQL + phpMyAdmin)
- **Jest** — unit testing

## ✨ Key Features

- **Authentication**: signup, login, logout, token refresh, forgot / reset password, change password
- **User management**: profiles, roles (admin / volunteer), skills, onboarding
- **Event management**: create, update, delete, associated documents
- **Mission management**: missions linked to an event, associated with required skills
- **Mission slot management**: time slots per mission with a maximum number of volunteers, manual or automatic creation (generating several slots at once)
- **Slot registrations**: a volunteer can register/unregister for a slot, with checks on available spots and duplicate registrations
- **Statistics**: upcoming missions/events, fill rate, alerts on under-filled missions

## 🔐 Security

- Passwords hashed with **Argon2**, never stored or returned in plain text
- **Dual JWT token system**: short-lived `accessToken` (15 min by default) signed with a dedicated secret, long-lived `refreshToken` (7 days by default) signed with a **different secret**, stored client-side in an **`httpOnly` + `secure` + `sameSite: strict` cookie**
- **Guards** (`AuthGuard`, `RolesGuard`) on sensitive routes, with role checks (`@Roles('admin')`)
- Every Prisma relation exposing user data uses an explicit `select` (field whitelist), never a raw `include: { user: true }`, to avoid ever leaking hashed passwords or emails
- The `role` field is explicitly stripped from the data sent to the profile update route (`PATCH /user`), preventing privilege escalation — role changes only go through a dedicated, admin-only route
- Systematic permission checks (resource owner or admin) before deletion/unregistration

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- npm

### Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd <folder-name>

# 2. Install dependencies
npm install

# 3. Create the .env file (see the Environment Variables section below)

# 4. Start the services (API + MySQL + phpMyAdmin) with Docker
docker compose up --build

# 5. Apply Prisma migrations (if not already done automatically on container startup)
npx prisma migrate deploy

# 6. Generate the Prisma client
npx prisma generate
```

The API will then be available at `http://localhost:3000`, and phpMyAdmin at `http://localhost:8081`.

## ⚙️ Environment Variables

Create a `.env` file at the project root with the following variables:

```env
# Database
DATABASE_URL="mysql://root:root@localhost:3308/testdb"

# JWT
ACCESSSECRET=a_long_random_unique_secret
REFRESHSECRET=another_random_secret_different_from_the_first
ACCESSEXPIRE=15m
REFRESHEXPIRE=7d
JWTALGORITHM=HS512

# CORS — origins allowed to call the API (comma-separated)
CORS_ORIGINS_URL=http://localhost:5173

# Server
PORT=3000

# Emails (Resend)
RESEND_API_KEY=your_resend_api_key

# Frontend URL, used in emailed links (e.g. password reset)
FRONTEND_URL=http://localhost:5173
```

⚠️ This file should **never** be committed — it is listed in `.gitignore`. Keep a backup copy outside the Git repository.

## 🗄️ Database

The schema is managed with Prisma (`prisma/schema.prisma`). Main models: `User`, `Evnt` (event), `Mission`, `MissionSlot`, `User_Has_Mission`, `Skill`, `User_has_Skill`, `Mission_Has_Skill`, `Category`, `Document`, `Event_Has_Document`.

Key relationships:
- One event (`Evnt`) has many missions (`Mission`) — 1-N relationship
- One mission has many slots (`MissionSlot`) — 1-N relationship
- A volunteer can register for many slots, and a slot can have many volunteers — N-N relationship via the `User_Has_Mission` join table

### Useful Commands

```bash
# Create a new migration after a schema change
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (GUI to browse the database)
npx prisma studio
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# Test coverage
npm run test:cov
```

Unit tests mock `PrismaService` (via `jest.fn()`) to test service logic in isolation, without relying on a real database.

## 📁 Project Structure

```
src/
├── auth/              # Authentication (login, signup, refresh, guards)
├── user/              # User management
├── evnt/               # Event management
├── mission/            # Mission management
├── mission-slot/       # Slot management
├── user-has-mission/   # Slot registrations
├── mail/                # Email sending (Resend)
prisma/
├── schema.prisma        # Database schema
├── migrations/           # Migration history
utils/
├── interface/            # Shared interfaces (e.g. standardized response format)
```

## 📦 API Response Format

Some routes (notably authentication) return a response wrapped in a standardized structure:

```typescript
interface IResponse<T> {
    data: T
    timeStamp: Date
    url: string
}
```

Other routes return the resource directly, without a wrapper. Refer to the relevant controller for the exact format of each route.

## 🌐 Deployment

The project is designed to be deployed via Docker. The production `Dockerfile` should use a compiled build (`npm run build` + `npm run start:prod`) rather than development mode (`start:dev`). Remember to adjust environment variables accordingly for the target environment (`secure: true` for cookies only over HTTPS, `CORS_ORIGINS_URL` with the real frontend domain, etc.).