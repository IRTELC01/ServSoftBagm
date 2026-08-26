/**
 * Bank Transfer Configuration
 *
 * Configuración de cuenta para pagos por transferencia.
 * Esta información se muestra en el Panel Administrativo y el Portal del Cliente.
 *
 * Los valores reales viven en variables de entorno (VITE_BANK_*), nunca en
 * este archivo, para que no queden datos personales/bancarios en el repo.
 * Configúralas en apps/client/.env (ver apps/client/.env.example).
 *
 * El QR oficial (QRBreB_ServSoftBagm.jpeg) está en public/assets/
 * (NO en bank/) para que se commitee y llegue al build de Render.
 */

export interface BankTransferDetails {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  cc: string;
  instrucciones?: string;
}

export const BANK_TRANSFER: BankTransferDetails = {
  banco: import.meta.env.VITE_BANK_NAME || '',
  tipoCuenta: import.meta.env.VITE_BANK_ACCOUNT_TYPE || '',
  numeroCuenta: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '',
  titular: import.meta.env.VITE_BANK_HOLDER_NAME || '',
  cc: import.meta.env.VITE_BANK_HOLDER_ID || '',
  instrucciones: import.meta.env.VITE_BANK_INSTRUCTIONS || 'Realiza la transferencia y envía el comprobante por WhatsApp.',
};

/**
 * Ruta del código QR oficial BreB.
 *
 * Ubicación: apps/client/public/assets/QRBreB_ServSoftBagm.jpeg
 * (fuera del directorio bank/ para evitar gitignore; se commitea y llega a Render).
 *
 * Override: VITE_BANK_QR_URL permite apuntar a una URL externa si se desea.
 */
export const BANK_QR_PATH =
  import.meta.env.VITE_BANK_QR_URL || '/assets/QRBreB_ServSoftBagm.jpeg';

/**
 * Texto formateado listo para mostrar en el Dashboard y Portal del Cliente.
 */
export const BANK_TRANSFER_TEXT = `Banco: ${BANK_TRANSFER.banco}
Tipo de cuenta: ${BANK_TRANSFER.tipoCuenta}
Número de cuenta: ${BANK_TRANSFER.numeroCuenta}
Titular: ${BANK_TRANSFER.titular}
CC: ${BANK_TRANSFER.cc}

${BANK_TRANSFER.instrucciones || ''}`;
