# Bank Assets

Esta carpeta contiene los activos relacionados con pagos por transferencia bancaria.

## Estructura actual

- `QRBanco.jpeg` → Código QR oficial para que los clientes realicen transferencias.

## Cómo actualizar el QR

1. Obtén el nuevo código QR de tu banco.
2. Reemplaza el archivo `QRBanco.jpeg` manteniendo exactamente el mismo nombre.
3. No es necesario reiniciar el servidor (Vite recarga automáticamente los assets estáticos).

## Notas

- Esta información solo se muestra en el Panel Administrativo (Dashboard).
- No se expone en el sitio público ni en el Client Portal.
- Los datos de la cuenta (banco, número, titular, etc.) viven en código en:
  `client/src/config/bank.ts`

Mantener los datos de cuenta en código (en vez de archivos .txt) es más profesional, versionable y fácil de mantener.
