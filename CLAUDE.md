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

## ⚠️ Despliegue — orden obligatorio

> **El despliegue SIEMPRE sale de una rama de fixes, NUNCA directamente de
> decisiones sin verificar.** Ver estado real de `main` abajo.

Orden pendiente:
1. **[EN CURSO]** Endurecer para producción en `chore/pre-deploy-hardening`
   (partió de `chore/auditoria-2026`): `render.yaml` corregido a rutas
   monorepo + Postgres/Neon + acceso cerrado por defecto, auto-login
   inseguro eliminado del cliente, variables de deploy documentadas
   (`.env.example`, `DEPLOY_RENDER.md`).
2. **[COMPLETADO]** Resolver `main`: se hizo backup mirror completo
   (`../ServSoftBagm-backup-pre-filter-repo`), se corrió `git filter-repo`
   sobre las 4 ramas (purga de número de cuenta, cédula y `QRBanco.jpeg` del
   historial completo — el nombre del titular se dejó intacto a propósito,
   ver detalle en el historial de esta conversación), verificado con
   búsquedas `-S`/`--objects` en cero resultados, y se hizo force-push de
   `main`, `chore/auditoria-2026` y `chore/pre-deploy-hardening` a
   `origin`. `feature/secure-billing-2fa-monetizacion` no necesitó push
   (nunca tuvo el contenido filtrado). **Nota:** los datos ya estuvieron
   públicos antes del force-push — si alguien clonó el repo antes de eso,
   todavía los tiene.
3. **[BLOQUEADO]** Desplegar (Render + Neon) — bloqueado por la integración
   WhatsApp OTP, ver sección de abajo.

> ⚠️ **Antes de ir a producción en Render:** migrar el almacenamiento de
> fotos de leads (`apps/server/services/photoStorage.js`) de disco local a
> un proveedor persistente (ej. Cloudinary free tier) — el disco de Render
> es efímero y las fotos subidas se perderían en cada redeploy. El módulo
> ya está detrás de una interfaz (`savePhoto()`) pensada para que este
> cambio sea solo reescribir ese archivo, sin tocar rutas ni frontend.

## ⚠️ Integración WhatsApp OTP — en curso

> Bloqueante para el paso 3 de "Despliegue — orden obligatorio" (desplegar en
> Render + Neon). No hacer push ni deploy hasta resolver esto.

**Hecho:**
- Escenario en Make.com creado: "Integration Webhooks"
  (`us2.make.com/2670443/scenarios/5900302`), módulo Webhooks guardado con la
  URL en `_local/secretos/make-otp-webhook.txt`, módulo WhatsApp Business
  Cloud ("Send a Message") agregado pero sin conexión guardada aún.
- En Meta: Portfolio "Servsoftbagm" creado. Número real 3015045982 (Tigo) con
  la app WhatsApp Business instalada y perfil básico completo. El usuario
  necesita seguir usando este número normal desde el celular además de la
  API — por eso el modo correcto es **Coexistence**, no Regular.

**Bloqueado:** tanto en modo Regular como Coexistence, Meta devuelve *"Este
número ya está registrado con una cuenta de WhatsApp"* al conectar desde
Make/navegador.

**Próximo paso a probar:** iniciar el flujo de Coexistence DESDE la app del
celular (WhatsApp Business → Ajustes → Cuenta → buscar "Plataforma
empresarial"/"Business Platform"), no solo desde la ventana web de Meta.

**Después de resolver eso, en orden:**
1. Crear la plantilla de mensaje categoría "Authentication" en Meta WhatsApp
   Manager para el texto del OTP (necesaria porque el negocio inicia la
   conversación, el cliente no escribe primero).
2. Cablear `MAKE_LEAD_OTP_WEBHOOK_URL` en `.env.example` y `render.yaml`.
3. Probar el envío real de OTP de punta a punta.
4. Solo entonces: push de `chore/pre-deploy-hardening` a GitHub + deploy en
   Render, usando la `DATABASE_URL` de Neon ya guardada en
   `_local/secretos/neon-servsoftbagm.txt`.

**No perdido:** Neon, el escenario de Make, el Portfolio de Meta y el número
con WhatsApp Business instalado quedan intactos — no hay que repetir nada de
lo ya hecho.

### Fase pre-deploy — endurecimiento (EN CURSO en `chore/pre-deploy-hardening`)
1. ✅ `render.yaml`: `rootDir` corregido a `apps/server` / `apps/client`;
   backend movido a Postgres/Neon (`DB_DRIVER=pg`, `DATABASE_URL` con
   `sync: false`); `OPEN_ACCESS`/`VITE_OPEN_ACCESS` a `"false"`;
   `DEFAULT_ADMIN_PASSWORD` sin valor por defecto (`sync: false`,
   obligatorio manual); `MASTER_ENABLE="false"` explícito.
2. ✅ Eliminado el auto-login inseguro (`admin`/`servsoft123`) de
   `apps/client/src/App.jsx`; quitados los valores por defecto de
   usuario/contraseña en `Login.jsx` y `Register.jsx`. El flujo manual de
   `/login` sigue intacto.
3. ✅ Documentación de variables de deploy actualizada en
   `apps/server/.env.example`, `apps/client/.env.production.example` y
   `DEPLOY_RENDER.md` (ya no recomienda `OPEN_ACCESS=true` ni credenciales
   por defecto como flujo normal).
4. ✅ SSL habilitado en el pool de Postgres (`db-pg.js`) para conectar con
   Neon (condicionado a que el host no sea localhost, para no romper
   Postgres local vía docker-compose).
5. ✅ Bugs de QA manual encontrados y corregidos: `<option>` invisibles en
   selects del tema oscuro; enlaces externos de relleno quitados de las
   tarjetas de servicio (`Service.jsx`); Telemetría y Asistente IA
   etiquetados como Beta/demo; `POST /api/leads/verify` estaba roto (500
   siempre, variable `clientMessage` no definida) y el `PATCH /:id` de
   leads tenía un handler duplicado inalcanzable que impedía guardar
   imágenes — ambos corregidos en `routes/leads.js`. Subida de fotos de
   evidencia construida de punta a punta (admin sube, cliente ve tras OTP)
   — ver advertencia de storage arriba.

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
