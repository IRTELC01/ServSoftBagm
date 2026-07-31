# Bank Assets

Esta carpeta contiene los activos relacionados con pagos por transferencia bancaria.

**El contenido real de esta carpeta (`QRBanco.jpeg`) NUNCA se commitea.** El QR
codifica la cuenta bancaria real, así que está ignorado en `.gitignore`
(`apps/client/public/assets/bank/*`) igual que cualquier otro secreto. Solo
`README.md` y `.gitkeep` están versionados.

## Estructura actual

- `QRBanco.jpeg` → Código QR oficial para que los clientes realicen transferencias (local/deploy únicamente, no en git).

## Cómo actualizar el QR

1. Obtén el nuevo código QR de tu banco.
2. Coloca el archivo como `apps/client/public/assets/bank/QRBanco.jpeg` (local o directamente en el servidor de despliegue).
3. No es necesario reiniciar el servidor (Vite recarga automáticamente los assets estáticos).
4. `git status` no debe mostrar este archivo como cambio — si lo hace, revisa que `.gitignore` siga cubriendo esta ruta.

## Notas

- Esta información solo se muestra en el Panel Administrativo (Dashboard).
- No se expone en el sitio público ni en el Client Portal.
- Los datos de la cuenta (banco, número, titular, cédula, etc.) NO viven en código: se leen de variables
  de entorno `VITE_BANK_*` en `apps/client/.env` (ver `apps/client/.env.example`), consumidas por
  `apps/client/src/config/bank.ts`.
