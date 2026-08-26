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
- Backend (ahora en `apps/server/`) con Express + PostgreSQL/SQLite.
- Autenticación de administrador con 2FA TOTP.
- CRUD mínimo de facturas y registro contable simple.
- Frontend React (Vite) con Tailwind y UI futurista.
- Documentación y guías para GitHub.

## Plan de acción (Etapa 1)
1) Backend
- Estructura Express, CORS, rate limit.
- DB: PostgreSQL (principal) / SQLite (desarrollo local). Tablas principales: `users`, `invoices`, `transactions`, `leads`.
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
## Actualizaciones recientes (enero 2026)
- Landing: h�roe con t�tulo centrado sobre imagen full-width y tarjeta unificada de Contacto + Ubicaci�n al final con mapa visible (iframe).
- Servicios: textos descriptivos, secciones �lo que incluye� y galer�as con im�genes locales fijas (Imagen2.png, Imagen3.png, etc.) evitando mezclas.
- WhatsApp: enlaces estandarizados con palabras clave por servicio; chatbot ampliado con flujo �recuperaci�n�; endpoint de prueba y sesiones con expiraci�n.
- Dashboard: fondo negro para mayor contraste con tarjetas neon y responsividad preservada.
- Visibilidad: reconstrucci�n del cliente para evitar cach� del preview al usar contenedores.

## Comandos ejecutados y prop�sito
- Desarrollo: cd client && npm run dev | cd server && npm run dev
- Build/preview: cd client && npm run build | cd client && npm run preview
- Lint: cd client && npm run lint
- Docker (refrescar cambios del frontend): docker compose restart client | docker compose up -d --force-recreate client
- Puertos (Vite): cambio autom�tico a 5174 cuando 5173 est� ocupado.
- Git (remoto existente): git remote set-url origin https://github.com/IRTELC01/ServSoftBagm.git
- T�nel para webhooks: 
grok http 3000 (o el puerto real del backend) para probar WhatsApp Cloud.

## T�cnicas de diagn�stico y correcci�n
- Ubicaci�n correcta de componentes seg�n referencia visual (Landing vs Dashboard).
- Estandarizar palabras clave en mensajes prellenados de WhatsApp para disparar flujos del bot.
- Asignar im�genes locales a cada servicio para eliminar mezclas en galer�as.
- Logging del bot y endpoint de prueba para validar recepci�n y respuestas.
- Reinicio/forzado de recreaci�n del contenedor para invalidar cach� de build/preview.
- Verificar puertos ocupados y aceptar el fallback autom�tico de Vite.

## WhatsApp Cloud (pendiente)
- Requisitos: adquisici�n de SIM y activaci�n del n�mero en Meta.
- Pasos previstos: configurar VERIFY_TOKEN y n�mero; verificar webhook (GET); habilitar env�o desde Cloud; actualizar CONTACT_WHATSAPP en apps/client/src/config.js; probar con endpoint de prueba y flujos por palabras clave.
- Estado: pendiente SIM; backend listo y enlaces del frontend coordinados.

## Referencias de c�digo
- [Landing.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/apps/client/src/pages/Landing.jsx)
- [Service.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/apps/client/src/pages/Service.jsx)

### [2026-05] Módulo de Telemetría con separación inspirada en Clean Architecture (en transición, no Clean Architecture completa)
- **Objetivo**: Introducir Centro de Telemetría Operacional, Data Analytics y Asistente IA Predictivo separando el cálculo de métricas del transporte HTTP, como primer paso en transición hacia Clean Architecture / Hexagonal (ver Fase 3 del roadmap). Esto es un patrón puntual aplicado a este módulo, no una migración estructural del backend: no existen carpetas `domain/`, `application/` ni `infrastructure/`, y la mayoría de los demás routers (ej. `apps/server/routes/leads.js` en sus endpoints CRUD) siguen mezclando HTTP + reglas de negocio + SQL crudo ("fat controllers").
- **Módulo de cálculo (agnóstico de HTTP, aún dependiente de la capa `db`)**:
  - `apps/server/services/analyticsService.js` — Data Mapper puro. Calcula SLA, Seguridad/Integridad, CSAT Predictivo y Data Science Readiness. Solo depende del adaptador `db`.
  - `apps/server/services/iaEngineService.js` — Motor de decisiones encapsulado. Hoy usa reglas de negocio determinísticas. Mañana se puede reemplazar por cualquier LLM sin tocar el resto del sistema.
- **Endpoints delgados**:
  - `apps/server/routes/leads.js` expone `GET /api/leads/telemetry` y `POST /api/leads/telemetry/ask` como puentes delgados (solo orquestan y aplican requireAuth) — a diferencia de los endpoints CRUD del mismo archivo, que sí contienen SQL crudo directamente.
- **Frontend (Dashboard.jsx)**:
  - Sección de Facturas reemplazada por tabla cyberpunk ultra-compacta + `.slice(0, 5)` + filtro local instantáneo por Ticket/Cliente (100% client-side, cero impacto en BD).
  - Nuevo "Centro de Telemetría Operacional & Data Analytics" con 4 micro-tarjetas consumiendo el endpoint agnóstico.
  - Nuevo "Asistente IA de Decisiones" conectado directamente al servicio `iaEngineService`.
- **Blindaje**:
  - Todo el trabajo se realizó primero en rama `feat/telemetry-clean-architecture` después del checkpoint de seguridad.
  - .gitignore endurecido previamente para proteger datos bancarios, .env y backups personales.
- **Resultado**: El sistema sigue 100% funcional localmente. La nueva funcionalidad es completamente swappable (DB o motor de IA) sin romper el negocio.
- **Próximo**: Cuando se desee, integrar Make.com/n8n para orquestar acciones automáticas basadas en las métricas de telemetría.
- [Dashboard.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/apps/client/src/pages/Dashboard.jsx)
- [whatsapp.js](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/apps/server/routes/whatsapp.js)

## Actualización 2026-08-25 — PRODUCCIÓN LIVE + estado OTP/Meta

> **Fuente única y vigente:** `C:\Users\BagmDev\DevIRTELC01\Documentacion\ESTADO_SERVSOFTBAGM_2026_08_25.md`.
> Este anexo corrige cualquier afirmación anterior de este documento.

- **Demo desplegada:** frontend https://servsoftbagm-web.onrender.com ·
  backend https://servsoftbagm-api.onrender.com · Neon conectada
  (`DB_DRIVER=pg`). Login admin, Portal Cliente y flujo OTP servidor OK.
- **OTP:** `/api/leads/verify` genera/persiste/valida el código; envío a Make
  vía webhook `otp-servsoftbagm-v2` verificado con webhook.site (payload:
  phone, otp, ticket, client_name, message). Pendiente solo el salto final:
  módulo WhatsApp Business Cloud autenticado en Make + desbloquear el número
  en Meta (Coexistence/migración — ver dossier del bloqueo).
- **Meta:** Portfolio "Servsoftbagm"; WABA `898040542954309`; Phone Number ID
  `1231921603341123`; perfil completo; Business Verification INICIADA (RUT
  cargado). Bloqueo: "número ya registrado" sin SMS ni fase de verificación.
- **Correcciones post-deploy ya aplicadas:** CORS, booleanos pg, awaits del
  adaptador pg, trust proxy, blueprint static sin `plan`, rebranding RunaWay.
- **Pendientes P1–P5:** QR bancario visible · OTP→WhatsApp real · auth módulo
  WhatsApp Cloud en Make · coexistence del número · Business Verification.
