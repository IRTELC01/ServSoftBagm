# CLAUDE.md — Contexto del proyecto ServSoftBagm

Este archivo da continuidad entre sesiones de Claude Code. Léelo antes de trabajar
en este repo.

## Qué es

ServSoftBagm (antes "RunaWay") es una app que ofrece servicios de software/TI y
maneja **dinero real** (pagos por transferencia bancaria) y **datos personales
de clientes**. Por eso la seguridad tiene prioridad sobre la velocidad de
desarrollo. El repo es **público** en GitHub (`IRTELC01/ServSoftBagm`).

Monorepo Turborepo con dos apps:
- `apps/server` — Express + SQLite/PostgreSQL (driver configurable vía `DB_DRIVER`/`DATABASE_URL`).
- `apps/client` — React 19 + Vite + Tailwind.

Scripts raíz relevantes: `npm run dev` / `dev:server` / `dev:client` / `build` / `lint` (via Turborepo).

## Arquitectura REAL (no la que dicen algunos docs viejos)

El backend es un **monolito Express organizado por capas técnicas**
(`apps/server/routes/`, `apps/server/services/`), **NO hexagonal ni Clean
Architecture todavía**. Los routers (ej. `apps/server/routes/leads.js`) son
"fat controllers": mezclan HTTP + reglas de negocio + SQL crudo en el mismo
archivo. No existen carpetas `domain/`, `application/`, `infrastructure/`.

Hay una intención documentada de migrar hacia una arquitectura hexagonal/por
capas de dominio, pero es un objetivo de fases futuras (ver Fase 3 abajo), no
el estado actual. Si un documento afirma lo contrario, el documento está
desactualizado — confía en el código, no en el doc.

## Reglas de trabajo en este repo

- Nunca commitear a `main` directamente: trabajar en ramas (`chore/...`, `fix/...`, etc.).
- Nunca `git push`, `push --force`, ni reescritura de historial (`filter-repo`,
  `rebase -i`, BFG) sin pedir confirmación explícita y explicar el riesgo primero.
- Commits pequeños y atómicos, mensajes convencionales (`fix:`, `chore:`, `docs:`, `refactor:`).
- Nunca hardcodear datos bancarios, cédulas, contraseñas o secretos en código
  versionado. Todo secreto real vive en `.env` (ignorado) — ver `.env.example` de
  cada app como plantilla.
- Carpeta `_local/` (raíz, ignorada por git) para archivos de trabajo que nunca
  deben ir al repo: `_local/seguimiento/`, `_local/backups-db/`,
  `_local/evidencias/`, `_local/secretos/`.
- Identidad git unificada vía `.mailmap` (ver ese archivo) — el historial tiene
  5 variantes de autor de la misma persona (typo `iretlec01` incluido), no se
  reescribió el historial, solo se consolidó la vista con mailmap.

## Estado de la auditoría de seguridad (2026-07-31)

### Fase 0 — Seguridad (COMPLETADA en `chore/auditoria-2026`)
1. ✅ `apps/client/src/config/bank.ts` ya no tiene datos bancarios/cédula
   hardcodeados: lee `VITE_BANK_*` desde `apps/client/.env` (real, ignorado) /
   `apps/client/.env.example` (placeholders).
2. ✅ `.gitignore` corregido: la sección de datos bancarios apuntaba a
   `apps/client/public/Ayudas/` (carpeta que nunca existió) en vez de la ruta
   real `apps/client/public/assets/bank/`. Se corrigió y se destrackeó
   `QRBanco.jpeg` (`git rm --cached`, el archivo sigue en disco). Rutas de
   SQLite ya apuntaban correctamente a `apps/server/`.
3. ✅ Se quitó el `console.log` en `apps/server/index.js` que imprimía la
   contraseña admin por defecto (`DEFAULT_ADMIN_PASSWORD` / `servsoft123`) en
   texto plano al iniciar el servidor.
4. ⚠️ **Pendiente de decisión del usuario**: los datos bancarios reales ya
   están públicos en GitHub desde el commit `89be154` (migración a monorepo),
   que SÍ está pusheado a `origin/main`. Limpiar el HISTORIAL (no solo el
   working tree) requiere decidir entre: reescribir historia
   (`git filter-repo` + force-push, con los riesgos que eso implica para
   colaboradores/forks), hacer el repo privado, o asumir la exposición y
   simplemente invalidar/cambiar los datos reales (cambiar cuenta bancaria o
   usar un contrato de excepción, etc.). **No se ejecutó ninguna opción — se
   preparó un informe y quedó a decisión del usuario.**

### Hallazgos relacionados (detectados pero fuera del scope explícito de Fase 0, sin tocar)
- Credenciales `admin`/`servsoft123` hardcodeadas también en:
  `apps/client/src/App.jsx` (auto-login de desarrollo), `apps/client/src/pages/Login.jsx`
  y `Register.jsx` (valor por defecto del campo password), y como fallback
  literal en `apps/server/routes/auth.js` y `apps/server/index.js`
  (`process.env.DEFAULT_ADMIN_PASSWORD || 'servsoft123'`). El
  `DEFAULT_ADMIN_PASSWORD=servsoft123` en `apps/server/.env.example` es solo
  placeholder de ejemplo, pero el fallback en código sigue siendo una
  contraseña por defecto predecible si nadie configura la env var.

### Fase 1 — Higiene y verdad documental (EN CURSO en `chore/auditoria-2026`)
1. ✅ Este archivo (`CLAUDE.md`).
2. ✅ Identidad git unificada: `user.name`/`user.email` ya estaban correctos
   (`Bernardo Adolfo Gómez Montoya <badolfogm@gmail.com>`, local y global). Se
   creó `.mailmap` consolidando las 5 identidades históricas.
3. ✅ Carpeta `_local/` creada (ignorada) con subcarpetas `seguimiento/`,
   `backups-db/`, `evidencias/`, `secretos/`.
4. 🔄 Alineación de documentación: corregir afirmaciones de que el backend
   "es" hexagonal/Clean Architecture (debe decir "en transición hacia") y
   consolidar ~8 documentos redundantes de monorepo
   (`MONOREPO_MIGRATION`, `CLEANUP_MONOREPO_REFERENCES`,
   `MONOREPO_CLEANUP_SUMMARY`, `MONOREPO_FINAL_STATUS`,
   `GUIA_DE_ESTUDIO_MONOREPO_Y_ARQUITECTURA`, etc.) en un solo doc
   (`docs/MONOREPO.md`), moviendo los originales a `docs/historico/` en vez de
   borrarlos.

### Fase 2 — NO ejecutar aún (pendiente de OK del usuario)
Partir `apps/client/src/pages/Dashboard.jsx` (~1.121 líneas, God Component) en
componentes: `InvoicesPanel`, `TelemetryCenter`, `IAAssistant`, `BankTransferCard`.

### Fase 3 — NO ejecutar aún
Extraer `LeadService` + `LeadRepository` reales sacando el SQL crudo de
`apps/server/routes/leads.js` (y routers similares como `accounting.js`,
`invoices.js`). Primer paso real hacia separar dominio de infraestructura.

### Fase 4 — NO ejecutar aún
Recorrer `docs/PRODUCTION_CHECKLIST.md` de cara a producción.

## Cómo continuar

Trabajo actual vive en la rama `chore/auditoria-2026` (creada a partir de
`main`, que coincidía con `origin/main` al momento de iniciar). Nada se ha
pusheado. Antes de avanzar a Fase 2, se debe pedir OK explícito al usuario.
