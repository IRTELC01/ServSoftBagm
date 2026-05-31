/**
 * Bank Transfer Configuration
 *
 * Configuración de cuenta para pagos por transferencia.
 * Esta información se muestra únicamente en el Panel Administrativo.
 *
 * Principios aplicados:
 * - Datos de configuración centralizados (no dispersos en componentes)
 * - Fácil de actualizar sin tocar UI
 * - Separación clara entre datos y presentación
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
  banco: 'Bancolombia',
  tipoCuenta: 'Ahorros',
  numeroCuenta: '[CUENTA-BANCARIA-REDACTADA]',
  titular: 'Bernardo Adolfo Gómez Montoya',
  cc: '[CEDULA-REDACTADA]',
  instrucciones: 'Realiza la transferencia y envía el comprobante por WhatsApp.',
};

/**
 * Ruta pública del código QR.
 * Archivo físico: client/public/assets/bank/QRBanco.jpeg
 */
export const BANK_QR_PATH = '/assets/bank/QRBanco.jpeg' as const;

/**
 * Texto formateado listo para mostrar en el Dashboard (para el <pre>).
 * Esto evita lógica de formateo en el componente de UI.
 */
export const BANK_TRANSFER_TEXT = `Banco: ${BANK_TRANSFER.banco}
Tipo de cuenta: ${BANK_TRANSFER.tipoCuenta}
Número de cuenta: ${BANK_TRANSFER.numeroCuenta}
Titular: ${BANK_TRANSFER.titular}
CC: ${BANK_TRANSFER.cc}

${BANK_TRANSFER.instrucciones || ''}`;
