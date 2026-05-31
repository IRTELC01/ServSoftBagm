const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public endpoint - anyone can submit a lead from the chatbot/landing
router.post('/', async (req, res) => {
  const { name, phone, address, service, requirement, equipment_description, images } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
  }

  try {
    // Generar ticket simple
    const ticketNumber = 'TKT-' + Date.now().toString().slice(-8);

    const info = await db.prepare(`
      INSERT INTO leads (ticket_number, name, phone, address, service, requirement, equipment_description, images, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Recibido')
    `).run(
      ticketNumber,
      name, 
      phone, 
      address || null, 
      service || null, 
      requirement || null,
      equipment_description || null,
      images ? JSON.stringify(images) : null
    );

    res.json({ 
      success: true, 
      id: info.lastInsertRowid,
      ticket_number: ticketNumber,
      message: 'Lead registrado correctamente' 
    });
  } catch (error) {
    console.error('Error saving lead (full):', error);
    // En desarrollo devolvemos el mensaje real para poder diagnosticar
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      error: 'Error al guardar el lead',
      details: isDev ? error.message : undefined 
    });
  }
});

// Protected - List all leads (for Dashboard)
router.get('/', requireAuth, async (req, res) => {
  try {
    const leads = await db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Error al obtener leads' });
  }
});

// Protected - Update lead status
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pendiente', 'Contactado', 'Agendado', 'Finalizado', 'Cancelado'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar lead' });
  }
});

// Public endpoint for Client Portal - verify with phone + ticket
// Genera OTP y lo envía por WhatsApp a través de Make.com (o lo muestra en consola mientras configuras)
router.post('/verify', async (req, res) => {
  const { phone, ticket_number } = req.body;

  if (!phone || !ticket_number) {
    return res.status(400).json({ error: 'Teléfono y número de ticket son requeridos' });
  }

  try {
    const lead = db.prepare(`
      SELECT * FROM leads 
      WHERE phone = ? AND ticket_number = ?
    `).get(phone, ticket_number);

    if (!lead) {
      return res.status(404).json({ error: 'No se encontró ningún servicio con esos datos' });
    }

    // Generar OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutos

    // Guardar el OTP en la tabla lead_otps
    db.prepare(`
      INSERT INTO lead_otps (lead_id, code, expires_at, used)
      VALUES (?, ?, ?, 0)
    `).run(lead.id, otp, expiresAt);

    // ============================================================
    // INTEGRACIÓN CON MAKE.COM (Gratis - Webhook)
    // ============================================================
    // 1. En Make.com crea un nuevo Scenario con trigger "Webhooks > Custom webhook".
    // 2. Copia la URL del webhook y pégala en tu .env como MAKE_LEAD_OTP_WEBHOOK_URL.
    // 3. En Make.com agrega un módulo de WhatsApp Cloud API para enviar el mensaje.
    //
    // Ejemplo de payload que recibe Make.com:
    // {
    //   "phone": "573001234567",
    //   "otp": "482917",
    //   "ticket": "TKT-17485932",
    //   "client_name": "Juan Pérez"
    // }

    const MAKE_WEBHOOK_URL = process.env.MAKE_LEAD_OTP_WEBHOOK_URL;

    if (MAKE_WEBHOOK_URL) {
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            otp: otp,
            ticket: ticket_number,
            client_name: lead.name,
            // Mensaje profesional listo para enviar por WhatsApp
            message: `Hola ${lead.name},\n\nHas solicitado consultar el estado de tu servicio en *ServSoftBagm*.\n\nTu código de verificación es:\n\n🔐 *${otp}*\n\n• Ticket: ${ticket_number}\n• Servicio: ${lead.service || 'No especificado'}\n• Este código expira en 10 minutos.\n\nIngresa este código en el Portal del Cliente para ver el estado de tu equipo, fotos del diagnóstico y documentos.\n\nSi no solicitaste este código, puedes ignorar este mensaje.`
          })
        });
        console.log(`[Make.com] Webhook enviado para OTP del lead ${lead.id}`);
      } catch (webhookError) {
        console.error('Error enviando webhook a Make.com:', webhookError);
      }
    } else {
      // Modo desarrollo: mostrar en consola
      console.log(`\n=== OTP PARA CLIENTE (MODO DESARROLLO) ===`);
      console.log(`Nombre: ${lead.name}`);
      console.log(`Teléfono: ${phone}`);
      console.log(`Ticket: ${ticket_number}`);
      console.log(`Código OTP: ${otp}`);
      console.log(`Expira en 10 minutos`);
      console.log(`(Configura MAKE_LEAD_OTP_WEBHOOK_URL en .env para enviar por WhatsApp vía Make.com)\n`);
    }

    // Mientras configuras Make.com, mostramos el código en consola (solo desarrollo)
    console.log(`\n=== OTP PARA CLIENTE ===`);
    console.log(`Nombre: ${lead.name}`);
    console.log(`Teléfono: ${phone}`);
    console.log(`Ticket: ${ticket_number}`);
    console.log(`Código OTP: ${otp}`);
    console.log(`Expira en 10 minutos`);
    console.log(`(Cuando conectes Make.com, este código se enviará automáticamente por WhatsApp)\n`);

    res.json({
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        service: lead.service,
        status: lead.status,
        images: lead.images ? JSON.parse(lead.images) : []
      },
      // En producción NO devolvemos el OTP en la respuesta JSON.
      // El cliente lo recibe exclusivamente por WhatsApp.
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
      message: clientMessage
    });

  } catch (error) {
    console.error('Error verifying lead:', error);
    res.status(500).json({ error: 'Error al verificar datos' });
  }
});

// Verificar OTP ingresado por el cliente (público)
router.post('/confirm-otp', async (req, res) => {
  const { phone, ticket_number, code } = req.body;

  if (!phone || !ticket_number || !code) {
    return res.status(400).json({ error: 'Faltan datos para verificar el código' });
  }

  try {
    const lead = db.prepare(`
      SELECT id FROM leads 
      WHERE phone = ? AND ticket_number = ?
    `).get(phone, ticket_number);

    if (!lead) {
      return res.status(404).json({ error: 'Datos no encontrados' });
    }

    // Buscar OTP válido y no usado
    const otpRecord = db.prepare(`
      SELECT * FROM lead_otps 
      WHERE lead_id = ? 
        AND code = ? 
        AND used = 0 
        AND expires_at > datetime('now')
    `).get(lead.id, code);

    if (!otpRecord) {
      return res.status(401).json({ error: 'Código inválido o expirado' });
    }

    // Marcar OTP como usado
    db.prepare('UPDATE lead_otps SET used = 1 WHERE id = ?').run(otpRecord.id);

    // Devolver datos del lead (sin información sensible)
    const fullLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(lead.id);

    res.json({
      success: true,
      lead: {
        ...fullLead,
        images: fullLead.images ? JSON.parse(fullLead.images) : []
      }
    });

  } catch (error) {
    console.error('Error confirmando OTP:', error);
    res.status(500).json({ error: 'Error al verificar el código' });
  }
});

// Protected - Update lead (incluyendo imágenes)
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status, images, equipment_description, client_notes } = req.body;

  try {
    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (images) {
      updates.push('images = ?');
      values.push(JSON.stringify(images));
    }
    if (equipment_description) {
      updates.push('equipment_description = ?');
      values.push(equipment_description);
    }
    if (client_notes) {
      updates.push('client_notes = ?');
      values.push(client_notes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    values.push(id);

    db.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar lead' });
  }
});

// ======================================================
// ADAPTADOR / CONTROLADOR LIMPIO (Clean Architecture)
// Solo orquesta. Toda la lógica de negocio vive en los servicios.
// ======================================================
const analyticsService = require('../services/analyticsService');
const iaEngineService = require('../services/iaEngineService');

// GET /api/leads/telemetry - Endpoint protegido para el Centro de Telemetría
router.get('/telemetry', requireAuth, async (req, res) => {
  try {
    const [sla, security, csat, dataScience] = await Promise.all([
      analyticsService.getSlaMetrics(),
      analyticsService.getSecurityStats(),
      analyticsService.getCsatScore(),
      analyticsService.getDataScienceReadiness()
    ]);

    res.json({
      success: true,
      generatedAt: new Date().toISOString(),
      sla,
      security,
      csat,
      dataScience
    });
  } catch (error) {
    console.error('[Telemetry] Error en capa de servicios:', error);
    res.status(500).json({ error: 'Error calculando métricas de telemetría' });
  }
});

// POST /api/leads/telemetry/ask - Asistente IA de Decisiones (puente al motor agnóstico)
router.post('/telemetry/ask', requireAuth, async (req, res) => {
  try {
    const { query } = req.body || {};
    if (!query || query.trim().length < 4) {
      return res.status(400).json({ error: 'La consulta debe tener al menos 4 caracteres' });
    }

    const [sla, security, csat, dataScience] = await Promise.all([
      analyticsService.getSlaMetrics(),
      analyticsService.getSecurityStats(),
      analyticsService.getCsatScore(),
      analyticsService.getDataScienceReadiness()
    ]);

    const insight = await iaEngineService.askDecisionAssistant(query, { sla, security, csat, dataScience });
    res.json(insight);
  } catch (error) {
    console.error('[IA Engine] Error procesando consulta:', error);
    res.status(500).json({ error: 'Error en el motor de asistencia de decisiones' });
  }
});

module.exports = router;