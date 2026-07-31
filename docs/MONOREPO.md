# Monorepo — ServSoftBagm

**Estado:** vigente. Este documento consolida y reemplaza los documentos históricos de migración a monorepo (ver [Documentos históricos](#documentos-históricos) al final). Su contenido fue verificado contra el repositorio real el 2026-07-31.

---

## 1. Qué es el monorepo y por qué se migró

ServSoftBagm era originalmente dos carpetas sueltas en la raíz (`server/` + `client/`) con un `package.json` mínimo. Se migró a un **monorepo con npm Workspaces + Turborepo** para conseguir:

- Un solo comando (`npm run dev`) que levanta backend y frontend en paralelo.
- Separación clara de responsabilidades **a nivel de proyecto**: `apps/server` (backend) y `apps/client` (frontend) son paquetes npm independientes, cada uno con su propio `package.json`.
- Orquestación de tareas (`dev`, `build`, `lint`) centralizada y cacheada vía Turborepo.
- Una base preparada para agregar código compartido en `packages/` en el futuro (tipos, utilidades) — **esta carpeta todavía no existe en el repo**, es solo una posibilidad prevista por la estructura.

**Importante — lo que este monorepo NO es:** la separación en `apps/server` vs `apps/client` es organización de proyecto, no arquitectura interna del backend. `apps/server` sigue siendo un monolito Express organizado por capas técnicas (`routes/`, `services/`), donde los routers (ej. `apps/server/routes/leads.js`) mezclan HTTP + reglas de negocio + SQL crudo ("fat controllers"). No existen carpetas `domain/`, `application/` ni `infrastructure/`. La migración hacia Clean Architecture / Hexagonal dentro del backend es un objetivo futuro (Fase 3 del roadmap: extraer un `LeadService` + `LeadRepository` reales sacando el SQL de los routers), no el estado actual.

---

## 2. Estructura real del repositorio

Verificado con `ls` / `cat package.json` / `cat turbo.json` el 2026-07-31:

```
ServSoftBagm/
├── apps/
│   ├── client/                  # Frontend — @servsoftbagm/client (React 19 + Vite + Tailwind)
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── server/                  # Backend — @servsoftbagm/server (Node.js + Express 5)
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       ├── db.js / db-sqlite.js / db-pg.js
│       └── package.json
├── docs/                        # Documentación (este archivo, arquitectura, decisiones, historico/)
├── scripts/                     # Scripts operativos (PowerShell + Node)
├── .github/workflows/           # CI (ci.yml, security-audit.yml)
├── docker-compose.yml           # Solo levanta PostgreSQL (ver sección 6)
├── turbo.json                   # Configuración de tareas de Turborepo
└── package.json                 # Raíz: workspaces + scripts + devDependencies compartidas
```

`packages/` **no existe todavía** — está mencionado en varios documentos como posibilidad futura para código compartido, pero no se ha creado.

### package.json raíz (real)

```json
{
  "private": true,
  "packageManager": "npm@10.8.2",
  "workspaces": ["apps/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules",
    "dev:server": "turbo run dev --filter=@servsoftbagm/server",
    "dev:client": "turbo run dev --filter=@servsoftbagm/client"
  }
}
```

### turbo.json (real)

Tareas definidas: `build` (depende de builds upstream, cachea `dist/**` y `build/**`), `lint`, `dev` (sin caché, persistente), `clean` (sin caché), `typecheck`.

### apps/server/package.json (real)

- `dev`: `nodemon index.js`
- `start`: `node index.js`
- `lint`: **placeholder** (`echo "No linter configured for server yet"`) — el backend todavía no tiene linter real configurado, a pesar de que algún documento histórico afirmaba lo contrario.
- Runtime: Node >= 20. Dependencias clave: Express 5, better-sqlite3, pg, jsonwebtoken, speakeasy (2FA), bcryptjs.

### apps/client/package.json (real)

- `dev`: `vite`
- `build`: `vite build`
- `lint`: `eslint .`
- `preview`: `vite preview`
- Stack: React 19, react-router-dom 7, Tailwind CSS 4, Vite 7.

---

## 3. Cómo instalar

Desde la raíz del repo (usa npm Workspaces, no instales dependencias dentro de `apps/*` por separado):

```bash
npm install
```

---

## 4. Cómo correr en desarrollo

Desde la **raíz** del proyecto:

```bash
npm run dev            # Levanta backend y frontend en paralelo (Turborepo)
npm run dev:server     # Solo backend (nodemon)
npm run dev:client     # Solo frontend (Vite)
```

No corras `npm run dev` esperando que solo levante el frontend — con Turborepo, `dev` orquesta ambos workspaces salvo que uses los filtros `dev:server` / `dev:client`.

---

## 5. Build y lint

```bash
npm run build   # turbo run build — build de ambos apps (hoy, en la práctica, principalmente relevante para el cliente/Vite)
npm run lint     # turbo run lint — ejecuta eslint en el cliente; en el servidor es un placeholder sin reglas reales todavía
npm run clean    # turbo run clean && borra node_modules de la raíz
```

---

## 6. Base de datos

- El backend soporta **SQLite** (desarrollo local, `better-sqlite3`) y **PostgreSQL** (recomendado para trabajo tipo producción), seleccionado según variables de entorno (`DB_DRIVER`, `DATABASE_URL`).
- La inicialización de esquema y migraciones simples (`ALTER TABLE` idempotentes) ocurren automáticamente al arrancar el backend.
- `docker-compose.yml` en la raíz **solo levanta el contenedor de PostgreSQL** (`postgres:16`, puerto `5432`). El backend (Node/Express) y el frontend (Vite) corren nativos en la máquina, no dentro de contenedores por defecto:

```bash
docker compose up -d db     # Levanta solo Postgres
```

---

## 7. Scripts operativos (`scripts/`)

Scripts reales presentes en el repo (PowerShell, pensados para Windows):

- `dev-all.ps1` — arranque combinado local.
- `setup-local.ps1` — configuración inicial local.
- `install-node.ps1` — instalación de Node.
- `reset-admin.ps1` — reseteo de contraseña de administrador.
- `render-verify.ps1` — verificación relacionada con despliegue en Render.
- `test-login.ps1` — prueba de login.
- `smoke-test.js` — smoke test en Node.

---

## 8. Estado real de la arquitectura interna del backend

| Aspecto | Estado real (2026-07-31) |
|---|---|
| Separación `apps/client` vs `apps/server` | Hecha — dos paquetes npm independientes bajo Turborepo. |
| Carpeta `packages/` compartida | No existe. Solo mencionada como posibilidad futura. |
| Clean Architecture / Hexagonal en `apps/server` | No implementada. No hay `domain/`, `application/` ni `infrastructure/`. Los routers (ej. `routes/leads.js`) contienen SQL crudo y lógica de negocio mezclada con el manejo HTTP. |
| Separación parcial existente | `apps/server/services/analyticsService.js` y `apps/server/services/iaEngineService.js` no dependen de Express y solo usan el adaptador `db` — un patrón puntual aplicado a un módulo (telemetría), no una migración estructural del backend. |
| Linter en backend | Placeholder, sin reglas reales. |
| Linter en frontend | ESLint configurado y funcional (`npm run lint` dentro de `apps/client`). |
| Próximo paso real hacia Hexagonal | Fase 3 del roadmap: extraer `LeadService` + `LeadRepository` reales sacando el SQL de los routers. |

---

## Documentos históricos

Los siguientes documentos describieron el proceso de migración a monorepo en distintos momentos y quedaron redundantes entre sí una vez completada la migración. Se conservan como referencia histórica (no borrados) en `docs/historico/`, pero su contenido operativo vigente fue consolidado en este archivo:

- `docs/historico/MONOREPO_MIGRATION.md`
- `docs/historico/CLEANUP_MONOREPO_REFERENCES.md`
- `docs/historico/MONOREPO_CLEANUP_SUMMARY.md`
- `docs/historico/MONOREPO_FINAL_STATUS.md`
- `docs/historico/GUIA_DE_ESTUDIO_MONOREPO_Y_ARQUITECTURA.md`

Para instrucciones de desarrollo del día a día (más allá de la estructura del monorepo), ver también [`DEVELOPMENT.md`](../DEVELOPMENT.md) en la raíz del repo.
