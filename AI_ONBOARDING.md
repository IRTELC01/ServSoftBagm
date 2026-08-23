# ServSoftBagm — Documento maestro de arranque para cualquier IA

**Instrucciones para la IA que lea esto:** Este documento es autosuficiente.
No asumas que tienes memoria de conversaciones previas con este usuario ni con
otra IA. Lee esto completo antes de proponer nada. El usuario (bagm2007 /
badolgm, Bernardo Adolfo Gómez Montoya) trabaja contigo desde una terminal de
agente de código (ej. Claude Code) con acceso real al filesystem del repo —
usa esas herramientas para verificar el estado real (`git status`,
`git log`, leer archivos) antes de asumir que algo de este documento sigue
siendo cierto. Este documento se actualiza, pero puede quedar desactualizado
entre sesiones — **verifica siempre contra la realidad del repo antes de
actuar**.

---

## 1. Qué es ServSoftBagm

App de servicios de software/TI (antes llamada "RunaWay") que maneja
**dinero real** (pagos por transferencia bancaria) y **datos personales de
clientes**. Por eso la seguridad tiene prioridad sobre la velocidad de
desarrollo.

Monorepo Turborepo con dos apps:
- `apps/server` — Express + SQLite/PostgreSQL (driver configurable vía
  `DB_DRIVER`/`DATABASE_URL`; producción usa Postgres/Neon con `DB_DRIVER=pg`).
- `apps/client` — React 19 + Vite + Tailwind.

**Repo:** `github.com/IRTELC01/ServSoftBagm` (**público**, no privado — eso
condiciona cualquier decisión sobre qué puede tocar el historial de git).
**Rama principal:** `main`.

Scripts raíz relevantes (vía Turborepo): `npm run dev` / `dev:server` /
`dev:client` / `build` / `lint`.

---

## 2. Estado REAL de la plataforma — léelo con honestidad, no con optimismo

El backend es un **monolito Express organizado por capas técnicas**
(`apps/server/routes/`, `apps/server/services/`), **NO hexagonal ni Clean
Architecture todavía**. Los routers (ej. `apps/server/routes/leads.js`) son
"fat controllers": mezclan HTTP + reglas de negocio + SQL crudo en el mismo
archivo. No existen carpetas `domain/`, `application/`, `infrastructure/`.
Hay una intención documentada de migrar a hexagonal (Fase 3, más abajo), pero
es un objetivo futuro, no el estado actual. `apps/server/routes/security/`
existe como carpeta pero está **vacía** — scaffolding sin usar, no una
feature real.

El frontend tiene un God Component real: `apps/client/src/pages/Dashboard.jsx`
(~1.121 líneas) sin partir todavía en subcomponentes (Fase 2, pendiente de
OK del usuario).

No hay CI/CD automatizado más allá de lo que ofrezca el propio host de
despliegue. La rama de trabajo actual (`chore/pre-deploy-hardening`) tiene
**16 commits locales sin pushear** — ver sección 3 para el porqué.

---

## 3. Historia condensada — qué se ha cerrado

Trabajo organizado en fases dentro de una auditoría de seguridad iniciada
2026-07-31.

- **Fase 0 (Seguridad, en `chore/auditoria-2026`)** — **completa**: se quitó
  el hardcodeo de datos bancarios/cédula de `apps/client/src/config/bank.ts`
  (ahora lee `VITE_BANK_*` desde `.env`, verificado — el archivo actual no
  tiene datos reales, solo placeholders en `.env.example`); se corrigió
  `.gitignore` (apuntaba a una carpeta que nunca existió,
  `apps/client/public/Ayudas/`, en vez de la ruta real
  `apps/client/public/assets/bank/`) y se destrackeó `QRBanco.jpeg`
  (sigue en disco, ya no en git — verificado con `git ls-files`, solo
  `README.md` y `.gitkeep` quedan trackeados en esa carpeta); se quitó el
  `console.log` que imprimía la contraseña admin por defecto en texto plano
  al iniciar el servidor.
- **Fase 1 (Higiene y verdad documental, en `chore/auditoria-2026`)** —
  **completa**: identidad git unificada vía `.mailmap` (consolida 5
  variantes históricas del mismo autor, incluido el typo `iretlec01`, sin
  reescribir historial); carpeta `_local/` (gitignored) creada con
  subcarpetas `seguimiento/`, `backups-db/`, `evidencias/`, `secretos/`;
  documentación alineada para dejar de afirmar que el backend "es"
  hexagonal cuando no lo es; 5 documentos redundantes de la migración a
  monorepo consolidados en `docs/MONOREPO.md` y movidos (no borrados) a
  `docs/historico/`.
- **Purga de historial (bloqueante, ya resuelta)** — los datos bancarios
  reales quedaron expuestos en `origin/main` desde el commit de migración a
  monorepo (hash antiguo `89be154`, ya no existe en ningún branch). Se
  decidió reescribir el historial: backup mirror completo
  (`../ServSoftBagm-backup-pre-filter-repo`), `git filter-repo` sobre las 4
  ramas para purgar número de cuenta, cédula y `QRBanco.jpeg` (el nombre del
  titular se dejó intacto a propósito), verificado con búsquedas `-S` /
  `--objects` en cero resultados, y force-push de `main`,
  `chore/auditoria-2026` y `chore/pre-deploy-hardening` a `origin`
  (`feature/secure-billing-2fa-monetizacion` no necesitó push porque nunca
  tuvo el contenido filtrado). **Verificado de nuevo en esta sesión**:
  `git log --all -S"QRBanco"` y `--name-only --diff-filter=A` en todo el
  historial no devuelven el archivo, solo 2 commits de documentación que
  mencionan la palabra en texto. Nota permanente: los datos ya estuvieron
  públicos antes del force-push — si alguien clonó el repo antes de eso,
  todavía los tiene; eso no se puede revertir.
- **Fase pre-deploy — endurecimiento (en curso en `chore/pre-deploy-hardening`,
  partió de `chore/auditoria-2026`)** — trabajo ya hecho:
  `render.yaml` corregido a rutas monorepo reales (`rootDir: apps/server` /
  `apps/client`) + Postgres/Neon (`DB_DRIVER=pg`, `DATABASE_URL` con
  `sync: false`, obligatorio configurar a mano) + acceso cerrado por
  defecto (`OPEN_ACCESS`/`VITE_OPEN_ACCESS: "false"`, `MASTER_ENABLE:
  "false"`, `DEFAULT_ADMIN_PASSWORD` sin valor por defecto); auto-login
  inseguro (`admin`/`servsoft123`) eliminado de `apps/client/src/App.jsx`,
  y los valores por defecto de usuario/contraseña quitados de `Login.jsx`
  y `Register.jsx` (el flujo manual de `/login` sigue intacto); SSL
  habilitado en el pool de Postgres (`db-pg.js`) para Neon (condicionado a
  host no-localhost, para no romper Postgres local vía docker-compose);
  varios bugs de QA manual corregidos (`<option>` invisibles en tema
  oscuro, enlaces externos de relleno quitados de tarjetas de servicio,
  Telemetría/Asistente IA etiquetados Beta/demo, `POST /api/leads/verify`
  que siempre daba 500 por una variable no definida, y un handler
  `PATCH /:id` de leads duplicado e inalcanzable que impedía guardar
  imágenes); subida de fotos de evidencia construida de punta a punta
  (admin sube, cliente ve tras OTP) — `photoStorage.js` ya expone una
  única función `savePhoto()` pensada para que migrar de disco local a un
  proveedor persistente (ej. Cloudinary) sea solo reescribir ese archivo.

**Estado real de las 4 ramas (verificado esta sesión, `git fetch origin` +
comparación de hashes):**

| Rama | Commits vs `main` | Sync con `origin` |
|---|---|---|
| `main` | — | en sync |
| `chore/auditoria-2026` | 0 adelante / 5 detrás | en sync |
| `chore/pre-deploy-hardening` (actual) | **16 adelante** / 0 detrás | **diverge** — `origin` sigue en el commit de SSL de Postgres (mismo hash que `main` actual), todo el trabajo de endurecimiento de esta sesión y las anteriores está **solo local, sin pushear** |
| `feature/secure-billing-2fa-monetizacion` | 1 adelante / 17 detrás | en sync |

Esto es intencional, no un descuido: la regla vigente es no pushear
`chore/pre-deploy-hardening` hasta resolver el bloqueo de WhatsApp OTP (ver
sección 7).

Para el detalle línea por línea, ver el propio `git log` y `CLAUDE.md` (que
también lleva bitácora de esta auditoría, más detallada que este documento).

---

## 4. Reglas de gobernanza — NO son opcionales

1. **Nunca commitear a `main` directamente** — trabajar en ramas
   (`chore/...`, `fix/...`, `feature/...`).
2. **Nunca hacer `git push`, `push --force`, ni reescritura de historial**
   (`filter-repo`, `rebase -i`, BFG) **sin pedir confirmación explícita y
   explicar el riesgo primero.** Esto ya pasó una vez (la purga de
   historial, sección 3) — fue deliberado, documentado y con backup mirror
   antes de tocar nada; ese es el estándar a repetir, no el force-push en
   sí como práctica casual.
3. **Commits pequeños y atómicos**, mensajes convencionales (`fix:`,
   `chore:`, `docs:`, `refactor:`, `feat:`).
4. **Nunca hardcodear datos bancarios, cédulas, contraseñas o secretos en
   código versionado.** Todo secreto real vive en `.env` (ignorado) — ver
   `.env.example` de cada app como plantilla. Este proyecto ya pagó el
   costo real de romper esta regla una vez (datos bancarios públicos en
   GitHub, purga de historial completa para arreglarlo) — no se repite.
5. **Carpeta `_local/` (raíz, ignorada por git)** para archivos de trabajo
   que nunca deben ir al repo: `_local/seguimiento/`, `_local/backups-db/`,
   `_local/evidencias/`, `_local/secretos/`. Ahí viven hoy la
   `DATABASE_URL` de Neon y la URL del webhook de Make — verificar que
   sigan ignorados (`git check-ignore -v`) antes de asumir que están a
   salvo, no solo confiar en que "siempre estuvo así".
6. **Identidad git unificada vía `.mailmap`** — el historial tiene 5
   variantes de autor de la misma persona (typo `iretlec01` incluido); no
   se reescribió el historial por eso, solo se consolidó la vista con
   mailmap. No confundir esto con la purga de datos bancarios (sección 3),
   que sí reescribió historial, por una razón distinta y mucho más seria.
7. **No hacer push ni deploy de `chore/pre-deploy-hardening` hasta resolver
   el bloqueo de WhatsApp OTP** (sección 7) — es la regla activa ahora
   mismo, ver esa sección antes de proponer saltarla.

---

## 5. Gotchas técnicos del entorno — para no perder tiempo redescubriéndolos

- Entorno de trabajo: **Windows**, shell primario **PowerShell**, con Bash
  (Git Bash / MINGW-style) también disponible para scripts POSIX — cada uno
  tiene su propia sintaxis, no mezclar `$VAR` de bash con `$env:VAR` de
  PowerShell dentro del mismo comando.
- El driver de base de datos es configurable por env var: `DB_DRIVER=pg`
  (Postgres, usado en producción vía Neon) vs SQLite local (`db-sqlite.js`
  / `db.js`). **Nunca usar SQLite en Render** — el disco es efímero, los
  datos se perderían en cada redeploy. `render.yaml` ya está forzado a
  `DB_DRIVER=pg` para el servicio de backend.
- SSL en el pool de Postgres (`apps/server/db-pg.js`) está condicionado a
  que el host **no sea** `localhost` — así no rompe Postgres local vía
  `docker-compose.yml` (servicio `db`, volumen `servsoftbagm_pgdata`) pero
  sí se activa automáticamente contra Neon.
- **El disco de Render es efímero.** `apps/server/services/photoStorage.js`
  guarda fotos de leads en disco local hoy — antes de desplegar en
  producción real hay que migrarlo a un proveedor persistente (ej.
  Cloudinary free tier). El módulo ya expone una única función
  `savePhoto()` como interfaz, así que el cambio debería ser solo
  reescribir ese archivo, sin tocar rutas ni frontend.
- `apps/server/routes/security/` es una **carpeta vacía** — no asumas que
  hay lógica de seguridad ahí solo porque el nombre existe.
- Credenciales `admin`/`servsoft123` **hardcodeadas siguen presentes**
  (detectadas, fuera de scope explícito, no tocadas todavía) en:
  `apps/client/src/pages/Login.jsx` y `Register.jsx` (ya no como valor por
  defecto del campo, pero revisar antes de asumir que desapareció del
  todo), y como fallback literal en `apps/server/routes/auth.js` /
  `apps/server/index.js`
  (`process.env.DEFAULT_ADMIN_PASSWORD || 'servsoft123'`). El
  `render.yaml` ya obliga a configurar `DEFAULT_ADMIN_PASSWORD` a mano
  (`sync: false`, sin default), pero el fallback en código sigue siendo una
  contraseña predecible si alguien corre el server sin esa env var
  configurada — verificar antes de dar por cerrado este hallazgo.
- Scripts de utilidad en `scripts/`: `dev-all.ps1`, `install-node.ps1`,
  `render-verify.ps1`, `reset-admin.ps1`, `setup-local.ps1`,
  `smoke-test.js`, `test-login.ps1` — revisar ahí antes de escribir un
  script nuevo para algo que probablemente ya existe.

---

## 6. Dónde vive cada cosa (mapa rápido del repo)

```
apps/
  server/
    index.js              — entrypoint Express, monta todos los routers
    db.js / db-sqlite.js / db-pg.js — driver configurable (DB_DRIVER)
    routes/
      auth.js
      invoices.js
      accounting.js
      leads.js             — el router más grande, "fat controller"
      whatsapp.js           — webhook de la integración WhatsApp (157 líneas)
      security/              — carpeta vacía, scaffolding sin usar
    services/
      analyticsService.js
      calendarService.js
      iaEngineService.js
      photoStorage.js        — savePhoto(), interfaz lista para migrar a Cloudinary
    middleware/
      auth.js
    uploads/                — fotos de leads, almacenamiento local (efímero en Render)
  client/
    src/
      App.jsx                — ya sin auto-login inseguro
      api.js
      config/
        bank.ts               — lee VITE_BANK_* desde env, sin datos hardcodeados
      pages/
        Dashboard.jsx          — God Component (~1.121 líneas), Fase 2 pendiente
        Login.jsx / Register.jsx
      components/
    public/assets/bank/
      QRBanco.jpeg            — en disco, NO trackeado en git
      README.md / .gitkeep    — sí trackeados (excepción explícita en .gitignore)
_local/                    — gitignored, nunca va al repo
  secretos/
    neon-servsoftbagm.txt    — DATABASE_URL de Neon
    make-otp-webhook.txt      — URL del webhook de Make.com
  seguimiento/ backups-db/ evidencias/
docs/
  MONOREPO.md               — verificado contra el repo real, reemplaza a los 5 docs viejos
  PLAN_DE_ACCION_2026.md
  PRODUCTION_CHECKLIST.md    — Fase 4, no ejecutar aún
  CLIENT_JOURNEY_AND_LEADS_FLOW.md
  architecture/               — ARCHITECTURE_OVERVIEW, ARCHITECTURE_PRINCIPLES,
                                 CLASS_DIAGRAM, PATTERNS_AND_ARCHITECTURE
  decisions/                  — 0001-github-account-separation,
                                 0002-bank-data-professional-structure
  historico/                  — docs viejos de la migración a monorepo, no borrados
  security/ database/ deployment/ guides/
scripts/                    — dev-all.ps1, render-verify.ps1, reset-admin.ps1, etc.
CLAUDE.md                   — bitácora de auditoría más detallada que este documento
render.yaml                 — rootDir apps/server + apps/client, Postgres/Neon, acceso cerrado
DEPLOY_RENDER.md
docker-compose.yml          — servicio "db" (Postgres local), volumen servsoftbagm_pgdata
.mailmap                    — consolida 5 variantes de autor en una sola identidad
```

---

## 7. Próxima acción inmediata — desbloquear WhatsApp OTP

El despliegue (Render + Neon) está **completamente listo técnicamente** pero
**bloqueado** por la integración de WhatsApp OTP — no se hace push ni deploy
hasta resolver esto (regla 7 de la sección 4).

**Ya hecho:**
- Escenario en Make.com creado ("Integration Webhooks",
  `us2.make.com/2670443/scenarios/5900302`), módulo Webhooks guardado (URL
  en `_local/secretos/make-otp-webhook.txt`), módulo WhatsApp Business
  Cloud agregado pero sin conexión guardada.
- En Meta: Portfolio "Servsoftbagm" creado, número real 3015045982 (Tigo)
  con WhatsApp Business instalado y perfil básico completo desde
  **2026-08-09**. El usuario necesita seguir usando ese número desde el
  celular además de la API, por eso el modo correcto es **Coexistence**, no
  Regular.

**Bloqueado, con causa raíz identificada:** tanto Coexistence como Regular
fallan con *"Este número ya está registrado con una cuenta de WhatsApp"* al
conectar desde Make/navegador. Meta impone un **período de espera de 7 días**
desde que un número se instala en WhatsApp Business antes de habilitar
Coexistence — el número se instaló el 2026-08-09, así que el bloqueo se
levanta naturalmente **a partir del 2026-08-16**. La plantilla de mensaje de
autenticación (categoría "Authentication" en Meta WhatsApp Manager) tiene la
misma dependencia: no se puede crear/aprobar hasta que la cuenta esté
correctamente conectada.

**Próximo paso a probar (cuando se cumpla el plazo):** iniciar el flujo de
Coexistence **desde la app del celular** (WhatsApp Business → Ajustes →
Cuenta → "Plataforma empresarial"/"Business Platform"), no solo desde la
ventana web de Meta — eso no se había probado todavía la última vez que se
intentó.

**Después de resolver eso, en orden:**
1. Crear la plantilla de mensaje de autenticación en Meta WhatsApp Manager.
2. Cablear `MAKE_LEAD_OTP_WEBHOOK_URL` en `.env.example` y `render.yaml`
   (verificado esta sesión: **todavía no existe en ningún lado del repo**,
   ni servidor ni cliente ni `render.yaml` — es trabajo pendiente real, no
   solo documentado como pendiente).
3. Probar el envío real de OTP de punta a punta.
4. Solo entonces: push de `chore/pre-deploy-hardening` a GitHub (los 16
   commits locales pendientes, ver sección 3) + deploy en Render, usando la
   `DATABASE_URL` de Neon ya guardada en `_local/secretos/`.

**No se pierde nada mientras se espera:** Neon, el escenario de Make, el
Portfolio de Meta y el número con WhatsApp Business instalado quedan
intactos — no hay que repetir nada de lo ya hecho, solo esperar el plazo y
retomar el flujo de Coexistence desde el celular.

**No escribas ni pushees nada de despliegue sin confirmar primero que el
bloqueo de Meta ya se resolvió realmente** (no solo que "ya pasaron 7
días") — probar la conexión real antes de asumir que se puede avanzar.

---

## 8. Filosofía de calidad — seguridad y funcionalidad completa antes de mostrarle nada a un cliente real

ServSoftBagm maneja dinero real y datos personales reales de clientes desde
el primer día que alguien lo use en serio. Esto no es un proyecto de
práctica donde un atajo temporal es aceptable "por ahora" — ya se pagó el
costo de un atajo real (datos bancarios hardcodeados que terminaron
públicos en GitHub) con una purga de historial completa, no con un parche
cosmético.

Regla de trabajo, ya demostrada en la práctica: cuando aparece un problema
de seguridad o de dato sensible, se **resuelve del todo**, aunque cueste más
trabajo y más tiempo que dejarlo "resuelto a medias". Ejemplo real ya
aplicado: cuando se descubrió que los datos bancarios estaban expuestos en
el historial de git, la opción más rápida habría sido simplemente
invalidar/cambiar la cuenta bancaria real y seguir. Se eligió en cambio
hacer un backup mirror completo y correr `git filter-repo` sobre las 4
ramas para purgar el historial de verdad, verificar con búsquedas exhaustivas
que no quedó rastro, y solo entonces hacer el force-push — más trabajo,
pero sin nada "resuelto a medias" en la base de git.

Lo mismo aplica al despliegue: aunque todo el trabajo técnico de Render +
Neon está listo desde hace tiempo, el deploy sigue **deliberadamente
pospuesto** porque el flujo de OTP por WhatsApp (verificación real de
identidad de clientes) todavía no funciona de punta a punta. No se lanza
con OTP roto, así como no se lanzó (ni se lanzará) con datos sensibles
expuestos en el historial — aunque eso signifique posponer semanas el
`git push` de `chore/pre-deploy-hardening`.

**Pero ojo con el límite correcto de esto — es importante no confundirlo:**
esto no es licencia para sobre-construir features que nadie pidió. Las
Fases 2 (partir `Dashboard.jsx`) y 3 (extraer `LeadService`/`LeadRepository`
reales) están identificadas, documentadas, y **deliberadamente no
ejecutadas** hasta tener el OK explícito del usuario — no porque no
importen, sino porque no son bloqueantes de seguridad ni de funcionalidad
real hoy. La regla es: lo que compromete seguridad o datos reales de
clientes se resuelve completo y ahora; lo que es mejora de arquitectura o
legibilidad sin urgencia real espera a que el usuario decida el momento.

Cuando tengas dudas sobre si algo es un bloqueante real (seguridad, dinero,
datos personales) o una mejora que puede esperar, pregunta al usuario
explicando el trade-off — no asumas ninguno de los dos extremos por tu
cuenta.

---

## 9. Cómo continuar trabajo dividido entre sesiones o modelos distintos

El usuario puede alternar entre distintas IAs o simplemente cortar sesión sin
aviso (límites de cuota, cierres). Ninguna IA nueva tiene memoria de lo que
hizo la anterior — **la única fuente de continuidad es lo que quede escrito
en el repo**: código commiteado + `CLAUDE.md` (bitácora detallada de la
auditoría en curso) + este documento.

Este proyecto ya tiene un patrón de trabajo por fases explícitas y
documentadas (Fase 0 → Fase 1 → purga de historial → pre-deploy hardening →
bloqueo de WhatsApp OTP → Fase 2 → Fase 3 → Fase 4), cada una marcada como
completa/en curso/pendiente en `CLAUDE.md`. Si retomas trabajo a mitad de
una fase, lee primero qué ítems de esa fase ya están marcados ✅ y cuáles
⚠️/pendientes, en vez de asumir que hay que rehacer todo desde el principio.

Antes de arrancar una tarea grande (una fase nueva, una feature grande),
confirma con el usuario el alcance y el orden de pasos, y déjalo por
escrito en `CLAUDE.md` conforme avances — igual que se hizo con cada fase
de esta auditoría — para que la siguiente sesión (sea cual sea la IA) pueda
retomar exactamente donde quedó sin adivinar ni repetir trabajo.

---

## 10. Cómo verificar el estado real antes de hacer nada

```bash
git status && git log --oneline -5
git branch -vv && git fetch origin --quiet && git log main..chore/pre-deploy-hardening --oneline | wc -l
cat CLAUDE.md | head -100
git check-ignore -v _local/secretos/*
```

Si algo en este documento no coincide con lo que ves ahí, **confía en el
repo real, no en este documento** — y avisa al usuario de la discrepancia
para que decida cómo proceder, en vez de asumir cuál versión es correcta.
