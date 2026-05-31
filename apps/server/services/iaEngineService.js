/**
 * iaEngineService.js
 * ==============================================
 * CAPA DE DOMINIO / APLICACIÓN (Clean Architecture)
 * Motor del Asistente IA de Decisiones.
 * 
 * Totalmente agnóstico:
 * - No sabe de Express ni de HTTP.
 * - No conoce la UI.
 * - Encapsula toda la "inteligencia" (hoy reglas + heurísticas, mañana LLM real).
 * 
 * Cualquier cambio de proveedor de IA (OpenAI, Grok, Claude, modelo local vía n8n)
 * solo requiere modificar este archivo.
 * ==============================================
 */

async function askDecisionAssistant(userQuery, context) {
  const query = (userQuery || '').toLowerCase().trim();
  const { sla = {}, security = {}, csat = {}, dataScience = {} } = context || {};

  let respuesta = '';
  let nivelRiesgo = 'BAJO';
  let acciones = [];

  // Motor de reglas de negocio (determinístico y auditable)
  if (query.includes('priorit') || query.includes('urgente') || query.includes('atención')) {
    if (sla.estado === 'CRÍTICO') {
      respuesta = 'SLA en estado CRÍTICO. La tasa de resolución está por debajo del umbral seguro. Se recomienda activar protocolo de recuperación inmediata de leads agendados y pendientes.';
      nivelRiesgo = 'ALTO';
      acciones = ['Contactar hoy todos los leads en "Agendado"', 'Revisar causas de cancelación de las últimas 72h', 'Activar recordatorios automáticos vía WhatsApp'];
    } else if ((sla.leadsAgendados || 0) > 4) {
      respuesta = 'Volumen alto de leads agendados sin cierre. Riesgo de pérdida de momentum. Priorizar seguimiento en las próximas 6 horas.';
      nivelRiesgo = 'MEDIO';
      acciones = ['Llamar o escribir a leads agendados pendientes', 'Actualizar notas de cliente en el panel'];
    } else {
      respuesta = 'Flujo de leads estable. Mantener el ritmo actual de seguimiento y actualización de estados.';
    }
  } 
  else if (query.includes('csat') || query.includes('satisfacción') || query.includes('cliente')) {
    respuesta = `CSAT Predictivo actual: ${csat.score || 'N/D'}% (${csat.tendencia || 'N/D'}). ${csat.mensaje || ''}`;
    nivelRiesgo = (csat.score || 70) < 60 ? 'MEDIO' : 'BAJO';
  } 
  else if (query.includes('dato') || query.includes('ml') || query.includes('ciencia') || query.includes('modelo')) {
    if (dataScience.aptoParaModelos) {
      respuesta = 'El dataset actual cumple los requisitos mínimos de volumen y calidad para entrenar modelos de clasificación de leads o predicción de cancelación. Recomiendo activar pipeline con Make.com o n8n conectado a este endpoint.';
    } else {
      respuesta = dataScience.recomendacion || 'Se requiere más datos de calidad para activar analítica avanzada.';
    }
    nivelRiesgo = 'BAJO';
  } 
  else {
    // Respuesta general inteligente
    respuesta = `Resumen operativo: SLA ${sla.estado || 'N/D'} | CSAT ${csat.score || 'N/D'}% | Integridad ${security.integridadDatos || 'N/D'}%. ${sla.estado === 'SALUDABLE' ? 'Operación dentro de parámetros esperados.' : 'Se detectan oportunidades de mejora en el flujo de cierre.'}`;
  }

  return {
    query: userQuery,
    respuesta,
    nivelRiesgo,
    accionesSugeridas: acciones.length > 0 ? acciones : ['Mantener actualización diaria de estados de leads', 'Revisar métricas de telemetría cada 48h'],
    generadoPor: 'iaEngineService:v1-heuristico-2026',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  askDecisionAssistant
};
