# MASTERDOC — ServSoftBagm

## Bitácora del proyecto

- Fecha y hora: 2026-01-20 00:00 (UTC-5 aprox.)
- Estado actual: rebranding completo a ServSoftBagm; frontend con landing y dashboard ajustados; backend conmutando entre SQLite y PostgreSQL; Docker Compose operativo; integración básica de WhatsApp (bot y botón) funcionando.
- Cambios clave:
  - Actualización del README con banners responsivos, estructura, ERD, Docker y Postgres.
  - Configuración de contacto WhatsApp a `573127818103`; botón y panel de ayuda añadidos al final del Dashboard.
  - `docker-compose.yml` ajustado para usar `DEFAULT_ADMIN_PASSWORD=servsoft123`.
  - Esquema PostgreSQL validado y documentado (tablas: users, invoices, transactions, user_phones, user_otps).
  - Scripts PowerShell listos para arranque rápido local.
- Comandos utilizados y motivos:
  - Desarrollo local:
    - `cd server && npm run dev` — arranca backend Express.
    - `cd client && npm run dev` — arranca frontend Vite.
  - Configuración de entorno:
    - Definir `DB_DRIVER=pg` y `DATABASE_URL` — activar PostgreSQL.
    - `DEFAULT_ADMIN_PASSWORD=servsoft123` — establecer contraseña por defecto.
    - `RESET_ADMIN_PASSWORD_ON_START=true` — forzar reseteo de contraseña admin al iniciar.
  - Docker:
    - `docker compose up` — orquestar Postgres, backend y frontend localmente.
  - WhatsApp Cloud API:
    - Exponer `GET/POST /webhooks/whatsapp` mediante túnel (ngrok) para pruebas con Meta.
  - GitHub:
    - `git init && git add . && git commit -m "ServSoftBagm: primera versión"` — inicialización de repo.
    - `git branch -M main && git remote add origin https://github.com/IRTELC01/ServSoftBagm.git` — configurar rama principal y remoto.
    - `git push -u origin main` — primer push al repositorio.
    - En caso de remoto previo: `git remote set-url origin ...` — corregir URL de remoto.
- Próximos pasos sugeridos:
  - Añadir roles y usuarios adicionales; auditoría y registro de actividad.
  - Exportación de reportes CSV/PDF y plantillas avanzadas de factura.
  - Fortalecer chatbot con flujo conversacional y FAQ dinámicas; integrar base de conocimiento.
  - Seguridad: gestión de secretos, CORS de producción, TLS y dominio real.
  - Despliegue en servidor (Docker) y backups programados de la base de datos.
- Estado del proyecto:
  - Funcional para operación local con SQLite o PostgreSQL.
  - UI neon estable; landing con servicios de TI y casos de uso; dashboard con facturación y contabilidad básica.
  - Integración WhatsApp verificada en frontend; backend listo para Cloud API.

## Visión
ServSoftBagm es una app para ofrecer servicios de software e informática, con estética moderna futurista, que facilita:
- Difusión de servicios de TI (landing informativa).
- Operación del negocio (facturas locales y contabilidad básica).
- Acceso seguro del administrador con 2FA.

## Alcance de la primera etapa
- Backend local con Express + SQLite (Better‑SQLite3).
- Autenticación de administrador con 2FA TOTP.
- CRUD mínimo de facturas y registro contable simple.
- Frontend React (Vite) con Tailwind y UI futurista.
- Documentación y guías para GitHub.

## Plan de acción (Etapa 1)
1) Backend
- Estructura Express, CORS, rate limit.
- DB SQLite: tablas `users`, `invoices`, `transactions`.
- Rutas:
  - `POST /api/auth/register`
  - `POST /api/auth/setup-2fa` (QR TOTP)
  - `POST /api/auth/login` (JWT)
  - `POST /api/invoices` | `GET /api/invoices` | `GET /api/invoices/:id`
  - `POST /api/accounting/transactions` | `GET /api/accounting/summary`

2) Frontend
- Vite + React + Tailwind.
- Páginas: Landing, Registro, Setup 2FA, Login, Dashboard.
- Estado básico vía `localStorage` para el `token`.
- Formularios: factura y transacción.

3) Documentación
- README con pasos de ejecución.
- MASTERDOC con análisis y plan.

4) GitHub
- Instrucciones para `git init`, `remote add` y `push`.

## Probabilidad de éxito
Alta (80–90%) para operar localmente en Windows con Node y SQLite. Tecnología simple, sin dependencias externas complejas. Riesgos: manejo de datos sensibles en local, ausencia de respaldo, necesidad de buenas prácticas (backup DB, rotación de `JWT_SECRET`).

## Etapas futuras (sugeridas)
- Etapa 2: Portafolio de servicios, casos de uso y testimonios; reportes y exportación CSV.
- Etapa 3: Usuarios adicionales con roles; auditoría; impuestos y plantillas de factura.
- Etapa 4: Docker; despliegue en servidor; TLS y dominios.

## Decisiones clave
- SQLite para simplicidad y portabilidad.
- 2FA TOTP para seguridad sin servicios externos.
- UI Tailwind con toques neon/glow y tarjetas flotantes.

## Notas de seguridad
- Guardar la base de datos de forma segura y respaldarla.
- `.env` no debe versionarse con secretos.
- Limitar origen CORS al dominio real en producción.
