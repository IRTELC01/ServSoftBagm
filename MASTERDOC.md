# MASTERDOC ‚Äî ServSoftBagm

## Bit√°cora del proyecto

- Fecha y hora: 2026-01-20 00:00 (UTC-5 aprox.)
- Estado actual: rebranding completo a ServSoftBagm; frontend con landing y dashboard ajustados; backend conmutando entre SQLite y PostgreSQL; Docker Compose operativo; integraci√≥n b√°sica de WhatsApp (bot y bot√≥n) funcionando.
- Cambios clave:
  - Actualizaci√≥n del README con banners responsivos, estructura, ERD, Docker y Postgres.
  - Configuraci√≥n de contacto WhatsApp a `573127818103`; bot√≥n y panel de ayuda a√±adidos al final del Dashboard.
  - `docker-compose.yml` ajustado para usar `DEFAULT_ADMIN_PASSWORD=servsoft123`.
  - Esquema PostgreSQL validado y documentado (tablas: users, invoices, transactions, user_phones, user_otps).
  - Scripts PowerShell listos para arranque r√°pido local.
- Comandos utilizados y motivos:
  - Desarrollo local:
    - `cd server && npm run dev` ‚Äî arranca backend Express.
    - `cd client && npm run dev` ‚Äî arranca frontend Vite.
  - Configuraci√≥n de entorno:
    - Definir `DB_DRIVER=pg` y `DATABASE_URL` ‚Äî activar PostgreSQL.
    - `DEFAULT_ADMIN_PASSWORD=servsoft123` ‚Äî establecer contrase√±a por defecto.
    - `RESET_ADMIN_PASSWORD_ON_START=true` ‚Äî forzar reseteo de contrase√±a admin al iniciar.
  - Docker:
    - `docker compose up` ‚Äî orquestar Postgres, backend y frontend localmente.
  - WhatsApp Cloud API:
    - Exponer `GET/POST /webhooks/whatsapp` mediante t√∫nel (ngrok) para pruebas con Meta.
  - GitHub:
    - `git init && git add . && git commit -m "ServSoftBagm: primera versi√≥n"` ‚Äî inicializaci√≥n de repo.
    - `git branch -M main && git remote add origin https://github.com/IRTELC01/ServSoftBagm.git` ‚Äî configurar rama principal y remoto.
    - `git push -u origin main` ‚Äî primer push al repositorio.
    - En caso de remoto previo: `git remote set-url origin ...` ‚Äî corregir URL de remoto.
- Pr√≥ximos pasos sugeridos:
  - A√±adir roles y usuarios adicionales; auditor√≠a y registro de actividad.
  - Exportaci√≥n de reportes CSV/PDF y plantillas avanzadas de factura.
  - Fortalecer chatbot con flujo conversacional y FAQ din√°micas; integrar base de conocimiento.
  - Seguridad: gesti√≥n de secretos, CORS de producci√≥n, TLS y dominio real.
  - Despliegue en servidor (Docker) y backups programados de la base de datos.
- Estado del proyecto:
  - Funcional para operaci√≥n local con SQLite o PostgreSQL.
  - UI neon estable; landing con servicios de TI y casos de uso; dashboard con facturaci√≥n y contabilidad b√°sica.
  - Integraci√≥n WhatsApp verificada en frontend; backend listo para Cloud API.

## Visi√≥n
ServSoftBagm es una app para ofrecer servicios de software e inform√°tica, con est√©tica moderna futurista, que facilita:
- Difusi√≥n de servicios de TI (landing informativa).
- Operaci√≥n del negocio (facturas locales y contabilidad b√°sica).
- Acceso seguro del administrador con 2FA.

## Alcance de la primera etapa
- Backend local con Express + SQLite (Better‚ÄëSQLite3).
- Autenticaci√≥n de administrador con 2FA TOTP.
- CRUD m√≠nimo de facturas y registro contable simple.
- Frontend React (Vite) con Tailwind y UI futurista.
- Documentaci√≥n y gu√≠as para GitHub.

## Plan de acci√≥n (Etapa 1)
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
- P√°ginas: Landing, Registro, Setup 2FA, Login, Dashboard.
- Estado b√°sico v√≠a `localStorage` para el `token`.
- Formularios: factura y transacci√≥n.

3) Documentaci√≥n
- README con pasos de ejecuci√≥n.
- MASTERDOC con an√°lisis y plan.

4) GitHub
- Instrucciones para `git init`, `remote add` y `push`.

## Probabilidad de √©xito
Alta (80‚Äì90%) para operar localmente en Windows con Node y SQLite. Tecnolog√≠a simple, sin dependencias externas complejas. Riesgos: manejo de datos sensibles en local, ausencia de respaldo, necesidad de buenas pr√°cticas (backup DB, rotaci√≥n de `JWT_SECRET`).

## Etapas futuras (sugeridas)
- Etapa 2: Portafolio de servicios, casos de uso y testimonios; reportes y exportaci√≥n CSV.
- Etapa 3: Usuarios adicionales con roles; auditor√≠a; impuestos y plantillas de factura.
- Etapa 4: Docker; despliegue en servidor; TLS y dominios.

## Decisiones clave
- SQLite para simplicidad y portabilidad.
- 2FA TOTP para seguridad sin servicios externos.
- UI Tailwind con toques neon/glow y tarjetas flotantes.

## Notas de seguridad
- Guardar la base de datos de forma segura y respaldarla.
- `.env` no debe versionarse con secretos.
- Limitar origen CORS al dominio real en producci√≥n.
## Actualizaciones recientes (enero 2026)
- Landing: hÈroe con tÌtulo centrado sobre imagen full-width y tarjeta unificada de Contacto + UbicaciÛn al final con mapa visible (iframe).
- Servicios: textos descriptivos, secciones ìlo que incluyeî y galerÌas con im·genes locales fijas (Imagen2.png, Imagen3.png, etc.) evitando mezclas.
- WhatsApp: enlaces estandarizados con palabras clave por servicio; chatbot ampliado con flujo ìrecuperaciÛnî; endpoint de prueba y sesiones con expiraciÛn.
- Dashboard: fondo negro para mayor contraste con tarjetas neon y responsividad preservada.
- Visibilidad: reconstrucciÛn del cliente para evitar cachÈ del preview al usar contenedores.

## Comandos ejecutados y propÛsito
- Desarrollo: cd client && npm run dev | cd server && npm run dev
- Build/preview: cd client && npm run build | cd client && npm run preview
- Lint: cd client && npm run lint
- Docker (refrescar cambios del frontend): docker compose restart client | docker compose up -d --force-recreate client
- Puertos (Vite): cambio autom·tico a 5174 cuando 5173 est· ocupado.
- Git (remoto existente): git remote set-url origin https://github.com/IRTELC01/ServSoftBagm.git
- T˙nel para webhooks: 
grok http 3000 (o el puerto real del backend) para probar WhatsApp Cloud.

## TÈcnicas de diagnÛstico y correcciÛn
- UbicaciÛn correcta de componentes seg˙n referencia visual (Landing vs Dashboard).
- Estandarizar palabras clave en mensajes prellenados de WhatsApp para disparar flujos del bot.
- Asignar im·genes locales a cada servicio para eliminar mezclas en galerÌas.
- Logging del bot y endpoint de prueba para validar recepciÛn y respuestas.
- Reinicio/forzado de recreaciÛn del contenedor para invalidar cachÈ de build/preview.
- Verificar puertos ocupados y aceptar el fallback autom·tico de Vite.

## WhatsApp Cloud (pendiente)
- Requisitos: adquisiciÛn de SIM y activaciÛn del n˙mero en Meta.
- Pasos previstos: configurar VERIFY_TOKEN y n˙mero; verificar webhook (GET); habilitar envÌo desde Cloud; actualizar CONTACT_WHATSAPP en client/src/config.js; probar con endpoint de prueba y flujos por palabras clave.
- Estado: pendiente SIM; backend listo y enlaces del frontend coordinados.

## Referencias de cÛdigo
- [Landing.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/client/src/pages/Landing.jsx)
- [Service.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/client/src/pages/Service.jsx)
- [Dashboard.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/client/src/pages/Dashboard.jsx)
- [whatsapp.js](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/server/routes/whatsapp.js)
