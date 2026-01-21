# ServSoftBagm — Software, soporte e informática

Aplicación web full‑stack para ofrecer servicios de desarrollo de software, soporte técnico, mantenimiento de equipos y recuperación de información. Conserva el estilo futurista con neon y tarjetas flotantes, e integra:

- Landing informativa con servicios de TI y casos de uso.
- Acceso de administrador con registro y 2FA (TOTP).
- Gestión de facturas y contabilidad básica (ingresos, gastos, activos y pasivos).
- Backend Express + SQLite local.
- Frontend React + Vite + Tailwind.
- Integración inicial de WhatsApp: botón flotante y webhook básico de chatbot.

## Requisitos

- Node.js 20.19.0 (o 22.12+). Vite requiere 20.19+ y el backend usa Better‑SQLite3 (incompatible con Node 24).

## Puesta en marcha (local)

1. Backend:
   - `cd server`
   - Copia `.env.example` a `.env` y ajusta `JWT_SECRET`.
   - `npm run dev`
   - API en `http://localhost:3001/`.
   - Webhook de WhatsApp: `GET/POST http://localhost:3001/webhooks/whatsapp` (requiere exposición pública para Meta).
   - Autenticación por teléfono (OTP):
     - `POST /api/auth/register-phone` (username, password, phone)
     - `POST /api/auth/request-otp` (phone)
     - `POST /api/auth/login-phone` (phone, code)

2. Frontend:
   - `cd client`
   - `npm run dev`
   - Abre `http://localhost:5173/`.
   - Botón flotante de WhatsApp en la UI. Ajusta el número en `client/src/config.js` (CONTACT_WHATSAPP).

## Flujo de autenticación 2FA

1. Registra el usuario en `/register`.
2. Configura 2FA en `/setup-2fa` y escanea el QR con Google Authenticator/Authy.
3. Inicia sesión en `/login` con usuario, contraseña y código 2FA.

## Facturación y contabilidad

- En el dashboard:
  - Crear facturas con ítems, método de pago y notas.
  - Ver listado de facturas y totales.
  - Añadir transacciones manuales (income/expense/asset/liability).
  - Ver resumen: ingresos, gastos, activos, pasivos y utilidad.

## Estructura

- `server/` Express + SQLite (Better‑SQLite3). Rutas: `auth`, `invoices`, `accounting`.
- `server/routes/whatsapp.js` Webhook de WhatsApp (verificación y respuesta básica).
- `client/` React + Tailwind. Páginas: Landing, Register, Setup2FA, Login, Dashboard.
  - `LoginPhone.jsx`: Acceso por teléfono (OTP) y solicitud de código.

## Despliegue y GitHub

- Inicializa git en el root:
  - `git init`
  - `git add .`
- `git commit -m "ServSoftBagm: primera versión"`
  - `git branch -M main`
- `git remote add origin https://github.com/<tu_usuario>/ServSoftBagm.git`
  - `git push -u origin main`

Si necesitas pipeline de despliegue o empaquetado, se recomienda Dockerizar en una siguiente etapa.

## Integración WhatsApp (Chatbot básico)

- Requisitos en `server/.env` (ver ejemplo en `.env.example`):
  - `WHATSAPP_TOKEN`: token de acceso de Meta (WhatsApp Cloud API).
  - `WHATSAPP_PHONE_NUMBER_ID`: ID del número de WhatsApp Business.
  - `WHATSAPP_VERIFY_TOKEN`: cadena propia para verificar el webhook.

- Pasos:
  1. Crear App en Facebook Developers y habilitar WhatsApp Cloud.
  2. Obtener `WHATSAPP_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID`.
  3. Configurar `WHATSAPP_VERIFY_TOKEN` tanto en `.env` como en el panel de Meta.
  4. Exponer públicamente `GET/POST /webhooks/whatsapp` (ngrok o similar) y registrar el endpoint en Meta.
5. Probar enviando mensajes al número: el bot contesta a “hola”, “soporte”, “mantenimiento”, “desarrollo”.

- Botón de WhatsApp en el frontend:
  - Edita `client/src/config.js` y define `CONTACT_WHATSAPP` con tu número en formato internacional (ej. 57XXXXXXXXXX).
  - Puedes prellenar mensajes: `https://wa.me/57NUMERO?text=Hola%20quiero%20cotizar`.
## Arranque rápido (automatizado)

- Local en un solo comando:
  - Primero asegúrate de tener Node 20.19.0: `powershell -ExecutionPolicy Bypass -File .\scripts\install-node.ps1`
  - `powershell -ExecutionPolicy Bypass -File .\scripts\dev-all.ps1 -Disable2FA`
  - Hace todo: prepara `server/.env` y datos, arranca backend, verifica salud, resetea admin, arranca frontend y abre `/login`.
  - Credenciales: `admin / runaway123`.

- Verificar y estabilizar Render:
- `powershell -ExecutionPolicy Bypass -File .\scripts\render-verify.ps1 -BackendUrl 'https://<TU-BACKEND>.onrender.com' -FrontendUrl 'https://<TU-FRONTEND>.onrender.com'`
  - Comprueba `/api/auth/health` del backend y resetea el admin con 2FA desactivado.
  - Abre `https://<TU-FRONTEND>.onrender.com/login` para probar.
## Instalación local de datos

- Soporte de `DATA_DIR` en backend para ubicar la base de datos y archivos en directorio local preferido.
- En Windows, se sugiere: `C:\Users\TU_USUARIO\Documents\ServSoftBagm`.
- Configura `DATA_DIR` en `server/.env` (copiar desde `.env.example`).
- Opcional: usaremos un script PowerShell `scripts/setup-local.ps1` para crear carpetas y configurar `.env` automáticamente.
