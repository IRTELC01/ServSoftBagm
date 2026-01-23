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
- Pasos previstos: configurar VERIFY_TOKEN y n�mero; verificar webhook (GET); habilitar env�o desde Cloud; actualizar CONTACT_WHATSAPP en client/src/config.js; probar con endpoint de prueba y flujos por palabras clave.
- Estado: pendiente SIM; backend listo y enlaces del frontend coordinados.

## Bitácora — WhatsApp Cloud
- Fecha/hora inicio: 2026-01-22 00:00 (UTC-5).
- Número SIM configurado: 3015045982 → en frontend `CONTACT_WHATSAPP=573015045982`.
- Preparación de entorno (sin secretos en repo):
  - docker-compose (servicio server): declara `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID` con valores placeholder. Los reales deben ir por variables de entorno o archivo `.env` no versionado.
  - Webhook verificación GET ya implementado en `/webhooks/whatsapp` y recepción POST con flujos por palabras clave.
- Pasos detallados para éxito:
  - En Meta for Developers: crear App tipo “Business”, habilitar WhatsApp, obtener `PHONE_NUMBER_ID` y `WHATSAPP_TOKEN` (Bearer).
  - Elegir `WHATSAPP_VERIFY_TOKEN` propio y colocarlo igual en Meta y en el backend.
  - Exponer backend local con `ngrok http 3001` y usar la URL pública/ngrok para registrar el webhook en Meta apuntando a `/webhooks/whatsapp`.
  - Verificar webhook: Meta envía GET con `hub.verify_token` y `hub.challenge`; responderá 200 con el challenge si coincide.
  - Pruebas de envío: usar `POST /webhooks/whatsapp/test?to=573015045982&key=<VERIFY_TOKEN>&text=Hola` para validar envío desde Cloud.
  - Pruebas de recepción: enviar WhatsApp al número activo y confirmar flujo de “menu”, “soporte”, “mantenimiento”, “desarrollo”, “recuperación”.
- Consideraciones de producción:
  - Mantener tokens fuera del repositorio; usar variables de entorno/secret manager.
  - Registrar dominio/URL definitiva y actualizar `FRONTEND_ORIGIN` y CORS.
  - Auditoría y logging de acceso maestro y webhook para diagnósticos.

## Guía práctica — obtener Phone Number ID y Token (Meta)
- URL principal: https://developers.facebook.com/
- Crear App:
  - “Create App” → tipo “Business”.
  - En el Dashboard de la App, agrega el producto “WhatsApp”.
- WhatsApp Manager:
  - Abrir WhatsApp Manager: https://business.facebook.com/wa/manage/phone-numbers
  - Allí verás tu “WhatsApp Business Account (WABA)” y “Phone numbers”. Selecciona tu número para ver “Phone Number ID”.
- Página de la App (WhatsApp en la App):
  - https://developers.facebook.com/apps/APP_ID/whatsapp-business/
  - Se muestran “WhatsApp Business Account ID” y “Phone number ID”.
- Token permanente:
  - Business Settings → System Users: https://business.facebook.com/settings/system-users/
  - Crear “System User”, asignar activos (tu WABA), generar token con permisos:
    - whatsapp_business_messaging
    - whatsapp_business_management
  - Guarda el token de forma segura (no en el repo).
- Webhook:
  - En tu App: Webhooks → WhatsApp → “Configure”.
  - Callback URL: `https://<TU_NGROK_PUBLIC>/webhooks/whatsapp`
  - Verify Token: usa el mismo valor que pones en `WHATSAPP_VERIFY_TOKEN`.
  - Suscribe el tema “messages”.
- Prueba de envío (PowerShell):
  - `Invoke-WebRequest -Method POST -Uri \"https://graph.facebook.com/v18.0/<PHONE_NUMBER_ID>/messages\" -Headers @{ Authorization = \"Bearer <WHATSAPP_TOKEN>\"; 'Content-Type' = 'application/json' } -Body '{\"messaging_product\":\"whatsapp\",\"to\":\"573015045982\",\"text\":{\"body\":\"Prueba ServSoftBagm\"}}'`
- Checklist de variables:
  - `WHATSAPP_PHONE_NUMBER_ID` = ID del número obtenido en WhatsApp Manager/App.
  - `WHATSAPP_TOKEN` = token Bearer con permisos de WhatsApp.
  - `WHATSAPP_VERIFY_TOKEN` = texto elegido por ti para verificación del webhook (coincide en Meta y backend).

## Bitácora — Preparación despliegue en Render (sin dominio)
- Fecha/hora: 2026-01-23 00:00 (UTC-5).
- Objetivo: dejar WhatsApp Cloud operativo y página accesible sin dominio, usando URLs de Render; permitir indexación básica y preparar futura migración a dominio propio.
- API (Web Service):
  - Root: `server` · Build: `npm install` · Start: `node index.js`
  - Variables recomendadas:
    - `JWT_SECRET`: valor fuerte único
    - `OPEN_ACCESS`: `false`
    - `FRONTEND_ORIGIN`: `https://servsoftbagm.onrender.com` (ajustar al generar la URL real del Static Site)
    - `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_VERIFY_TOKEN`
    - `DB_DRIVER`: `pg` si se usa Postgres gestionado (recomendado para persistencia); caso contrario SQLite (ojo: no persistente entre deploys en plan gratuito)
  - Webhook: `https://servsoftbagm-api.onrender.com/webhooks/whatsapp` (ajustar al URL real de la API)
- Frontend (Static Site):
  - Root: `client` · Build: `npm install && npm run build` · Publish: `dist`
  - Variables: `VITE_API_URL=https://servsoftbagm-api.onrender.com/api` · `VITE_OPEN_ACCESS=false`
  - SEO: actualizar `index.html` (canonical/og:url) y `public/sitemap.xml` a la URL del Static Site de Render.
- Indexación:
  - Mantener `robots.txt` con `Allow: /` y `Sitemap` apuntando a la URL de Render.
  - Más adelante, migrar canonical y sitemap al dominio propio y configurar redirecciones 301 si se usa un servicio intermedio.
- Validaciones:
  - Verificación de webhook desde Meta (GET con challenge).
  - Prueba de envío Cloud (POST Graph API) y recepción en bot (flujos por palabra clave).

## Referencias de c�digo
- [Landing.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/client/src/pages/Landing.jsx)
- [Service.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/client/src/pages/Service.jsx)
- [Dashboard.jsx](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/client/src/pages/Dashboard.jsx)
- [whatsapp.js](file:///c:/Users/Bernardo%20G%C3%B3mez/workspace/ServSoftBagm/ServSoftBagm/server/routes/whatsapp.js)

## Bitácora — seguridad y facturación
- Fecha/hora: 2026-01-21 19:57 (UTC-5).
- Commit realizado a main con cambios de WhatsApp, imágenes y fondo negro; push exitoso.
- Rama creada para trabajo seguro: feature/secure-billing-2fa-monetizacion.

## Plan minucioso — zona de facturación y acceso seguro
- Objetivo: acceso privado para administrador con 2FA obligatorio; base para monetización y uso multi-negocio; datos locales por defecto y opción futura de nube.
- Seguridad base:
  - Desactivar OPEN_ACCESS en despliegues; permitir sólo orígenes definidos vía FRONTEND_ORIGIN.
  - JWT_SECRET fuerte y rotado; evitar valores por defecto en producción.
  - Contraseña admin: exigir cambio tras primer inicio; evitar secretos triviales en compose.
  - Acceso maestro: MASTER_ENABLE=false por defecto; MASTER_PASSWORD fuerte; logging e IP/UA en auditoría; correo de alerta opcional.
- 2FA:
  - TOTP obligatorio si twofa_secret existe (cambio aplicado en auth/login).
  - Flujo Setup2FA para admin usando app autenticadora (Google Authenticator, Authy).
  - Alternativa OTP por teléfono con expiración 5 min y borrado tras uso.
  - Opción futura: OTP por correo vía SMTP.
- Control de acceso frontend:
  - Quitar auto-login global y proteger /dashboard con token (cambio aplicado).
  - Redirigir a /login o /login-phone si no hay sesión.
- Monetización y roles (siguiente iteración):
  - Añadir roles a users (admin, user_free, user_premium) y tabla subscriptions.
  - Gating en UI: funciones gratis (factura simple e impresión); premium (análisis, tablas avanzadas, exportaciones, multiusuario).
  - Endpoint de verificación de plan y estado de suscripción.
- Datos locales vs nube:
  - SQLite local por defecto; conmutación a PostgreSQL cuando se despliegue servidor.
  - Futura opción de respaldo a S3/Blob con retención configurable; no habilitado por ahora.
- LLM contable (futuro):
  - Servicio de asistencia para asientos, categorización, proyecciones; privacidad y seguridad de datos.
  - API wrapper con límites y auditoría; interfaz contextual en Dashboard.

## Próximos pasos ejecutables
- Endurecer auth: exigir token 2FA cuando exista secreto (aplicado).
- Eliminar auto-login en App.jsx y mantener RequireAuth (aplicado).
- Documentar variables críticas y valores recomendados para despliegue.
- Crear migración de roles y suscripciones; actualizar endpoints y UI.
- Añadir página de administración de seguridad: cambiar contraseña, activar/desactivar 2FA, ver auditoría de accesos.
