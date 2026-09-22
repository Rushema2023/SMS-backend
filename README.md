# Stock Management System — Backend

Multi-organization stock management API. Organizations, Users, and Items only —
every User and Item belongs to exactly one Organization, and all data is scoped
so one organization can never see another's records.

## Stack
- Node.js + Express + TypeScript
- Postgres via Prisma ORM
- JWT authentication
- Swagger (OpenAPI) docs
- Docker for containerization

## Project structure
```
src/
  controllers/   # parse request, call service, shape response
  services/      # actual business logic + Prisma queries
  routes/        # Express routers + @openapi doc comments
  middleware/    # requireAuth, requireRole, validate
  utils/         # prisma client, jwt helpers, zod schemas, swagger config
prisma/
  schema.prisma  # database models: Organization, User, Item
```

## Local setup (without Docker)

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in a real `JWT_SECRET`.
   Make sure Postgres is running locally and `DATABASE_URL` points to it.
3. Run the first migration (creates the tables from schema.prisma):
   ```
   npm run prisma:migrate
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Visit `http://localhost:4000/docs` for interactive Swagger API docs.

## Running with Docker

```
docker compose up --build
```
This starts Postgres and the API together. The API runs a `prisma migrate`
manually the first time — connect via DBeaver to `localhost:5432`
(user/password: `postgres`/`postgres`, db: `stock_management`) to inspect data.

## Trying the API (Postman)

1. `POST /api/auth/register` with `organizationName`, `name`, `email`, `password`
   → creates an Organization + its first ADMIN user, returns a JWT.
2. Copy the `token` from the response. In Postman, set header
   `Authorization: Bearer <token>` on subsequent requests.
3. `POST /api/items` to create an item, `GET /api/items` to list your org's items.
4. As an ADMIN, `POST /api/users` to add teammates (STAFF or ADMIN) to your org.

## Key design decisions
- **Multi-tenancy by filtering, not separate databases**: every query in the
  service layer is scoped by `organizationId`, taken from the JWT — never
  trusted from the request body.
- **Register creates an Organization + its first User atomically**: there's
  no "create organization" endpoint on its own; it happens as part of sign-up.
- **Role-based access**: `ADMIN` can manage users; `STAFF` can only manage items.
