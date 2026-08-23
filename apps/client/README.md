# Cliente (React + Vite)

Frontend de ServSoftBagm construido con React 19, Vite 7 y Tailwind 4.

## Scripts

- `npm run dev`: arranca el servidor de desarrollo (puerto 5173 por defecto)
- `npm run build`: construye la aplicación para producción
- `npm run preview`: sirve la build localmente
- `npm run lint`: revisa el código con ESLint

## Configuración

- API: `VITE_API_URL` (por defecto `http://localhost:3004/api`)
- Acceso abierto opcional: `VITE_OPEN_ACCESS=true` (para desarrollo)
- WhatsApp: edita `src/config.js` y define `CONTACT_WHATSAPP`

## Guía completa

Consulta el README principal en el root del proyecto para detalle de backend, base de datos y orquestación.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
