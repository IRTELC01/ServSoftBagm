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
4. ✅ Alineación de documentación: corregidas las afirmaciones de que el
   backend "es" hexagonal/Clean Architecture (ahora dicen "en transición
   hacia", con nota de estado real y referencia a Fase 3) en
   `DEVELOPMENT.md`, `MASTERDOC.md`, `docs/architecture/ARCHITECTURE_PRINCIPLES.md`
   y `docs/decisions/0001-github-account-separation.md`. Los 5 documentos
   redundantes de monorepo (`MONOREPO_MIGRATION`, `CLEANUP_MONOREPO_REFERENCES`,
   `MONOREPO_CLEANUP_SUMMARY`, `MONOREPO_FINAL_STATUS`,
   `GUIA_DE_ESTUDIO_MONOREPO_Y_ARQUITECTURA`) se consolidaron en
   `docs/MONOREPO.md` (verificado contra el repo real) y se movieron a
   `docs/historico/` sin borrarlos.

**Fase 1 completa.** Pendiente: OK explícito del usuario antes de iniciar Fase 2.

## ✅ Despliegue — ESTADO REAL (2026-08-25)

> **La demo ya está desplegada y funcionando en producción.** Fuente única y
> completa: `C:\Users\BagmDev\DevIRTELC01\Documentacion\ESTADO_SERVSOFTBAGM_2026_08_25.md`
> (fuera del repo, workspace-level). Resumen:

1. **[COMPLETADO]** Endurecimiento en `chore/pre-deploy-hardening` (rama de
   trabajo actual; push y deploy autorizados por el propietario para la demo).
2. **[COMPLETADO]** Purga de historial bancario (`git filter-repo` + force-push,
   backup mirror previo en `../ServSoftBagm-backup-pre-filter-repo`).
3. **[COMPLETADO]** Desplegado en Render + Neon:
   - Frontend: https://servsoftbagm-web.onrender.com (static site, gratis)
   - Backend: https://servsoftbagm-api.onrender.com (web service free, spin-down 15 min)
   - Neon conectada como Postgres (`DB_DRIVER=pg`), esquema auto-migrado por
     `initSchema()` al arranque.
   - Login admin funciona · Portal Cliente funciona · OTP se genera y valida OK.
   - Fixes post-deploy aplicados y commiteados: CORS (normalización de
     orígenes + `FRONTEND_ORIGIN`/`VITE_API_URL` fijados en `render.yaml`),
     booleanos/fecha compatibles con Postgres en `lead_otps`, `await` faltantes
     en el adaptador pg (flujo leads/OTP), `trust proxy` para express-rate-limit.
   - Blueprint validado (el static site NO lleva campo `plan`).

> ⚠️ **Fotos de leads siguen en disco efímero** (`photoStorage.js`) — se
> pierden en cada redeploy. Migrar a Cloudinary antes de clientes reales
> (solo hay que reescribir ese archivo; interfaz `savePhoto()` ya existe).
>
> ⚠️ **QR bancario en producción (P1 — fix aplicado, falta deploy):** `bank.ts`
> ahora lee `VITE_BANK_QR_URL` (env var) con fallback a
> `/assets/bank/QRBanco.jpeg` (local). En Render, `QRBanco.jpeg` está
> gitignoreado y no existe en el build →404. Fix: propietario sube QR a
> servicio externo (imgur, CDN) y configura `VITE_BANK_QR_URL` en Render
> dashboard. Raíz documentada: `Documentacion/P1_2_QR_ROOT_CAUSE.md`.

## ⚠️ Integración WhatsApp OTP — servidor LISTO, Meta BLOQUEADA (2026-08-26, cierre de hito)

> El flujo OTP funciona de punta a punta EXCEPTO el último salto: enviar el
> código por WhatsApp real. Fotografía completa del hito:
> `C:\Users\BagmDev\DevIRTELC01\Documentacion\HITO_SERVSOFTBAGM_2026_08_26.md`.
> Dossier detallado del bloqueo Meta:
> `C:\Users\BagmDev\DevIRTELC01\Documentacion\META_COEXISTENCE_BLOQUEO_3015045982.md`.

**Funcionando (verificado con webhook.site y Make):**
- `/api/leads/verify` genera OTP, lo persiste en `lead_otps` y lo envía vía
  webhook a Make (`MAKE_LEAD_OTP_WEBHOOK_URL`). Payload validado:
  `{phone, otp, ticket, client_name, message}`.
- Escenario Make "Integration Webhooks", webhook **otp-servsoftbagm-v2**
  operativo (el anterior fue eliminado por inactividad — no reutilizar URLs viejas).
- Portal Cliente muestra "WhatsApp enviado" y valida el OTP correctamente.

**Bloqueado en Meta (único bloqueo restante del OTP real):**
- Portfolio "Servsoftbgm". WABA `1211100693873790` vacía (residuo); WABA
  `898040542954309` contiene el número `+57 3015045982`, Phone Number ID
  `1231921603341123`. Perfil completo (nombre/correo/dirección/categoría/web Render).
- Business Verification INICIADA (RUT cargado), solicitud pendiente.
- Conectar el número falla siempre con *"Este número de teléfono ya está
  registrado con una cuenta de WhatsApp"*; Meta NO envía SMS ni llega a la
  fase de verificación del número. Causa: Coexistence/migración del
  número existente. NO insistir con registros repetidos (límite 10/72h, error 133016).

**Pendientes abiertos (orden P1–P4):**
- **P1:** QR bancario visible en producción — fix aplicado (`VITE_BANK_QR_URL` env var en `bank.ts`). Raíz documentada: `P1_2_QR_ROOT_CAUSE.md`. Falta: propietario sube QR a servicio externo + configura env var en Render.
- **P2:** Completar módulo WhatsApp Business Cloud en Make (token System User, auth completa).
- **P3:** Business Verification Meta (seguimiento del RUT).
- **P4:** Resolver coexistence del `3015045982` (app celular → Plataforma empresas → QR/código).
- **Cadena:** P4 → P2 → Prueba OTP WhatsApp real.

### Fase pre-deploy — endurecimiento (COMPLETADA y DESPLEGADA)
1. ✅ `render.yaml`: `rootDir` corregido a `apps/server` / `apps/client`;
   backend movido a Postgres/Neon (`DB_DRIVER=pg`); `OPEN_ACCESS`/
   `VITE_OPEN_ACCESS="false"`; `DEFAULT_ADMIN_PASSWORD` manual;
   `MASTER_ENABLE="false"` explícito; static site SIN campo `plan`
   (Render 2026 lo rechaza); URLs de producción fijadas.
2. ✅ Auto-login inseguro eliminado del cliente (App.jsx, Login.jsx, Register.jsx).
3. ✅ Variables de deploy documentadas (`.env.example`, DEPLOY_RENDER.md).
4. ✅ SSL Postgres condicionado a host no-localhost (Neon OK, compose local OK).
5. ✅ Bugs de QA corregidos (selects oscuros, enlaces relleno, Beta/demo,
   verify 500, PATCH duplicado) + fotos de evidencia punta a punta.
6. ✅ Rebranding interno RunaWay→ServSoftBagm (30 rastros → 2 históricos,
   commit `3396153`; ver `Documentacion/RUNAWAY_CLEANUP_REPORT.md` fuera del repo).
7. ✅ Fixes producción: trust proxy rate-limit (`d30a730`), CORS + URLs
   (`59c6cfa`), booleanos pg (`58692d9`), awaits adaptador pg (`7247986`).

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

Rama de trabajo y deploy: `chore/pre-deploy-hardening`. La demo está LIVE;
los cambios nuevos siguen entrando por esta rama con push autorizado por el
propietario. Fotografía definitiva del hito (2026-08-26):
`C:\Users\BagmDev\DevIRTELC01\Documentacion\HITO_SERVSOFTBAGM_2026_08_26.md`.
Fuente única del estado completo (Render/Neon/OTP/Make/Meta):
`C:\Users\BagmDev\DevIRTELC01\Documentacion\ESTADO_SERVSOFTBAGM_2026_08_25.md`.
Fases 2/3/4 siguen pendientes de OK explícito del usuario.
