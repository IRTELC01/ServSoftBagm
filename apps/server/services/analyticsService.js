/**
 * analyticsService.js
 * ==============================================
 * CAPA DE DOMINIO / APLICACIÓN (Clean Architecture)
 * Módulo 100% agnóstico.
 * - No importa Express, no sabe de HTTP, no depende de res/req.
 * - Único responsable de calcular métricas de telemetría.
 * - Puede cambiar de fuente de datos (db-pg, db-sqlite, futuro data warehouse)
 *   sin tocar controladores ni frontend.
 * ==============================================
 */

const db = require('../db');

// Mapper interno - la única capa que toca la base de datos cruda
async function _getAllLeads() {
  try {
    const rows = await db.prepare(
      'SELECT * FROM leads ORDER BY created_at DESC'
    ).all();
    return rows || [];
  } catch (e) {
    console.error('[analyticsService] Error fetching leads:', e.message);
    return [];
  }
}

async function getSlaMetrics() {
  const leads = await _getAllLeads();
  const total = leads.length || 1;

  const finalizados = leads.filter(l => (l.status || '').toLowerCase() === 'finalizado').length;
  const agendados = leads.filter(l => (l.status || '').toLowerCase() === 'agendado').length;
  const cancelados = leads.filter(l => (l.status || '').toLowerCase() === 'cancelado').length;
  const pendientes = leads.filter(l => (l.status || '').toLowerCase() === 'pendiente').length;

  const tasaResolucion = Math.round((finalizados / total) * 100);
  const tasaCancelacion = Math.round((cancelados / total) * 100);

  let estado = 'SALUDABLE';
  if (tasaResolucion < 50 || tasaCancelacion > 25) estado = 'CRÍTICO';
  else if (tasaResolucion < 70) estado = 'EN RIESGO';

  return {
    tasaResolucion,
    leadsFinalizados: finalizados,
    leadsAgendados: agendados,
    leadsPendientes: pendientes,
    tasaCancelacion,
    totalLeads: leads.length,
    estado
  };
}

async function getSecurityStats() {
  const leads = await _getAllLeads();
  const total = leads.length || 1;

  const conEvidencia = leads.filter(l => {
    try {
      const imgs = l.images ? JSON.parse(l.images) : [];
      return Array.isArray(imgs) && imgs.length > 0;
    } catch { return false; }
  }).length;

  const conNotas = leads.filter(l => l.client_notes && l.client_notes.trim().length > 10).length;
  const conTelefonoValido = leads.filter(l => l.phone && l.phone.replace(/\D/g, '').length >= 10).length;

  const integridad = Math.round(((conEvidencia + conNotas + conTelefonoValido) / (total * 3)) * 100);

  return {
    totalLeads: leads.length,
    leadsConEvidencia: conEvidencia,
    leadsConNotasDetalladas: conNotas,
    integridadDatos: Math.min(integridad, 100),
    nivelSeguridad: integridad > 75 ? 'ALTA' : integridad > 50 ? 'MEDIA' : 'BAJA'
  };
}

async function getCsatScore() {
  const leads = await _getAllLeads();
  const total = leads.length || 1;

  const finalizados = leads.filter(l => (l.status || '').toLowerCase() === 'finalizado').length;
  const agendados = leads.filter(l => (l.status || '').toLowerCase() === 'agendado').length;

  // Heurística predictiva simple pero útil (reemplazable por modelo ML después)
  const base = Math.round((finalizados / total) * 85);
  const momentum = Math.min(Math.round((agendados / total) * 20), 15);
  const score = Math.max(45, Math.min(96, base + momentum));

  let tendencia = 'ESTABLE';
  if (score >= 80) tendencia = 'EXCELENTE';
  else if (score < 60) tendencia = 'REQUIERE ATENCIÓN';

  return {
    score: Math.round(score),
    tendencia,
    prediccionCierre30d: Math.round(finalizados + agendados * 0.65),
    mensaje: score >= 80 
      ? 'Alta probabilidad de retención y recompra' 
      : score >= 65 
        ? 'Operación funcional. Mejorar seguimiento post-agendado.' 
        : 'Riesgo de pérdida de clientes. Revisar proceso de cierre.'
  };
}

async function getDataScienceReadiness() {
  const leads = await _getAllLeads();
  const total = leads.length;

  if (total === 0) {
    return {
      registros: 0,
      completitud: 0,
      aptoParaModelos: false,
      recomendacion: 'Se necesitan al menos 25 leads con datos completos para activar analítica avanzada.'
    };
  }

  const conServicio = leads.filter(l => l.service && l.service.trim().length > 3).length;
  const conTicket = leads.filter(l => l.ticket_number && l.ticket_number.startsWith('TKT-')).length;
  const conFecha = leads.filter(l => l.created_at).length;

  const completitud = Math.round(((conServicio + conTicket + conFecha) / (total * 3)) * 100);

  return {
    registros: total,
    completitud: Math.min(completitud, 100),
    aptoParaModelos: total >= 25 && completitud >= 68,
    recomendacion: total < 25 
      ? 'Recolectar más leads para entrenar modelos predictivos.' 
      : completitud < 68 
        ? 'Mejorar calidad de captura de datos (servicio, ticket, fecha).' 
        : 'Dataset listo para integración con Make.com / n8n + modelos de clasificación.'
  };
}

module.exports = {
  getSlaMetrics,
  getSecurityStats,
  getCsatScore,
  getDataScienceReadiness
};
