# ServSoftBagm - Development Guide (Monorepo)

This project has been refactored into a professional **Turborepo monorepo**.

## New Structure

```
ServSoftBagm/
├── apps/
│   ├── apps/server/          # Backend (Node + Express)
│   └── apps/client/          # Frontend (React + Vite)
├── packages/            # (Future) Shared code
├── turbo.json
└── package.json         # Root with workspaces + turbo scripts
```

## Running the Project

From the **root** of the project:

```bash
npm run dev
```

This will start both `server` and `client` in parallel using Turborepo.

Other useful commands:

```bash
npm run dev:server     # Only backend
npm run dev:client     # Only frontend
npm run build          # Build everything
npm run lint
```

## Why This Structure?

This is the professional setup you asked for (Nivel 3):
- Clear separation of concerns (Clean Architecture at project level)
- Independent apps that can be built/deployed separately
- Shared tooling and pipelines via Turborepo
- Excellent developer experience from one place (the root)

## Database

- The project supports both **PostgreSQL** (recommended for production-like work) and **SQLite**.
- Schema initialization and migrations happen automatically when the backend starts (`apps/server/db-pg.js` → `initSchema()`).
- If you see errors like "column X does not exist", it usually means your local database was created with an older schema. Restarting the backend should run the necessary `ALTER TABLE` statements.

## Docker

Currently, Docker is mainly used for PostgreSQL (via `docker-compose.yml`).

The Node.js backend and Vite frontend run **natively** on your machine (not inside containers by default).

If you want a fully containerized experience in the future, let me know and we can evolve the Docker setup.

## Important Notes

- Never run `npm run dev` from the root expecting only the frontend — it will do nothing useful unless you use the scripts we configured.
- The project is deliberately split into `apps/server/` and `apps/client/` for architectural clarity. This is a feature, not a bug.
- When you make changes to the backend schema (`db-pg.js`), always restart the backend process so migrations run.

## Need Help?

If you want any of the following improvements, just say the word:

- Better one-command experience (with port killing, etc.)
- Full Docker Compose for the entire stack (backend + frontend + DB)
- Proper migration system (instead of auto `ALTER` on start)
- Monorepo with npm workspaces or Turborepo
- Better error messages and DX overall

We are moving toward a professional, clean, maintainable architecture. The current folder separation is part of that goal.
