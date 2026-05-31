/**
 * Dashboard Images - Organized Assets
 * 
 * All images used across different sections/states of the Dashboard.
 * Following Code Clean principles: centralized, typed, easy to maintain.
 * 
 * Source: Fabricated specifically for ServSoftBagm Dashboard UI states.
 */

import imgWeb1 from './imgWeb1.png';

// Section / State specific images
import imagen2 from './Imagen2.png';
import imagen3 from './Imagen3.png';
import imagen4 from './Imagen4.png';
import imagen5 from './Imagen5.png';
import imagen6 from './Imagen6.png';
import imagen7 from './Imagen7.png';
import imagen9 from './Imagen9.png';
import imagen10 from './Imagen10.png';
import imagen11 from './Imagen11.png';
import imagen12 from './Imagen12.png';
import imagen13 from './Imagen13.png';
import imagen14 from './Imagen14.png';
import imagen16 from './Imagen16.png';
import imagen17 from './Imagen17.png';
import imagen18 from './Imagen18.png';
import imagen19 from './Imagen19.png';

// Organized by Dashboard sections / states
export const dashboardImages = {
  // Main / Hero
  main: imgWeb1,

  // Facturación section
  facturacion: {
    primary: imagen2,
    secondary: imagen3,
    detail: imagen4,
  },

  // Contabilidad / Accounting
  contabilidad: {
    overview: imagen5,
    transactions: imagen6,
    reports: imagen7,
  },

  // Soporte / Support states
  soporte: {
    remote: imagen9,
    onsite: imagen10,
    success: imagen11,
  },

  // Mantenimiento
  mantenimiento: {
    preventive: imagen12,
    corrective: imagen13,
    equipment: imagen14,
  },

  // Recuperación de datos
  recuperacion: {
    process: imagen16,
    success: imagen17,
    diagnostics: imagen18,
  },

  // General / Other states
  general: {
    integration: imagen19,
    placeholder: imgWeb1,
  },

  // All raw images (for dynamic use if needed)
  all: {
    imgWeb1,
    imagen2,
    imagen3,
    imagen4,
    imagen5,
    imagen6,
    imagen7,
    imagen9,
    imagen10,
    imagen11,
    imagen12,
    imagen13,
    imagen14,
    imagen16,
    imagen17,
    imagen18,
    imagen19,
  }
};

export default dashboardImages;
