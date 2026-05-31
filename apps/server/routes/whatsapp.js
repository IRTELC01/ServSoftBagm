const express = require('express');
const router = express.Router();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const sessions = new Map();
async function sendText(to, body) {
  if (!PHONE_NUMBER_ID || !WHATSAPP_TOKEN) return;
  await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      text: { body },
    }),
  });
}

// Verificación del webhook (Meta)
router.get('/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Recepción de mensajes y respuesta básica tipo bot
router.post('/webhooks/whatsapp', async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (messages && messages[0]) {
      const msg = messages[0];
      const from = msg.from; // número del cliente (incluye prefijo país)
      const textRaw = (msg.text?.body || '').trim();
      const text = textRaw.toLowerCase();
      try { console.log('[WhatsApp] msg from', from, 'text:', textRaw); } catch {}
      const now = Date.now();
      const s = sessions.get(from);
      if (s && now - s.ts > 1000 * 60 * 15) sessions.delete(from);
      if (text === 'cancelar') {
        sessions.delete(from);
        await sendText(from, 'Conversación cancelada. Escribe "menu" para ver opciones.');
        return res.sendStatus(200);
      }
      if (!s) {
        if (text.includes('1') || text.includes('soporte')) {
          sessions.set(from, { flow: 'soporte', stage: 'equipo', ts: now, data: {} });
          await sendText(from, 'Soporte técnico. ¿Qué equipo o sistema está afectado?');
        } else if (text.includes('2') || text.includes('mantenimiento')) {
          sessions.set(from, { flow: 'mantenimiento', stage: 'equipo', ts: now, data: {} });
          await sendText(from, 'Mantenimiento. ¿Qué equipo requiere atención (PC, impresora, móvil)?');
        } else if (text.includes('3') || text.includes('desarrollo')) {
          sessions.set(from, { flow: 'desarrollo', stage: 'proceso', ts: now, data: {} });
          await sendText(from, 'Desarrollo. ¿Qué proceso deseas automatizar o mejorar?');
        } else if (text.includes('recuperacion') || text.includes('recuperación') || text.includes('datos')) {
          sessions.set(from, { flow: 'recuperacion', stage: 'medio', ts: now, data: {} });
          await sendText(from, 'Recuperación de datos. ¿En qué medio ocurrió (disco, memoria, SD)?');
        } else if (text === 'menu' || text === 'hola' || text === 'buenas') {
          await sendText(from, 'ServSoftBagm. Elige:\n1) Soporte técnico\n2) Mantenimiento de equipos\n3) Desarrollo a medida\nEscribe el número o nombre del servicio.');
        } else {
          await sendText(from, 'Hola, somos ServSoftBagm. Escribe "menu" para ver opciones o 1) Soporte, 2) Mantenimiento, 3) Desarrollo.');
        }
      } else {
        s.ts = now;
        if (s.flow === 'desarrollo') {
          if (s.stage === 'proceso') {
            s.data.proceso = textRaw;
            s.stage = 'entorno';
            await sendText(from, 'Describe tu entorno actual (ERP/CRM, sistemas, integraciones).');
          } else if (s.stage === 'entorno') {
            s.data.entorno = textRaw;
            s.stage = 'alcance';
            await sendText(from, 'Indica el alcance funcional principal (módulos, reportes, usuarios).');
          } else if (s.stage === 'alcance') {
            s.data.alcance = textRaw;
            s.stage = 'contacto';
            await sendText(from, 'Comparte un contacto preferido (WhatsApp/Email).');
          } else if (s.stage === 'contacto') {
            s.data.contacto = textRaw;
            const sum = `Resumen:\nProceso: ${s.data.proceso}\nEntorno: ${s.data.entorno}\nAlcance: ${s.data.alcance}\nContacto: ${s.data.contacto}\nGracias. Un experto te escribirá pronto. Escribe "menu" para otras opciones.`;
            await sendText(from, sum);
            sessions.delete(from);
          }
        } else if (s.flow === 'soporte' || s.flow === 'mantenimiento') {
          if (s.stage === 'equipo') {
            s.data.equipo = textRaw;
            s.stage = 'ubicacion';
            await sendText(from, '¿En qué ciudad/barrio te encuentras?');
          } else if (s.stage === 'ubicacion') {
            s.data.ubicacion = textRaw;
            s.stage = 'descripcion';
            await sendText(from, 'Describe el problema o síntomas principales.');
          } else if (s.stage === 'descripcion') {
            s.data.descripcion = textRaw;
            s.stage = 'preferencia';
            await sendText(from, '¿Prefieres atención remota o presencial?');
          } else if (s.stage === 'preferencia') {
            s.data.preferencia = textRaw;
            const sum = `Resumen:\nEquipo: ${s.data.equipo}\nUbicación: ${s.data.ubicacion}\nDescripción: ${s.data.descripcion}\nPreferencia: ${s.data.preferencia}\nGracias. Te contactaremos en breve. Escribe "menu" para otras opciones.`;
            await sendText(from, sum);
            sessions.delete(from);
          }
        } else if (s.flow === 'recuperacion') {
          if (s.stage === 'medio') {
            s.data.medio = textRaw;
            s.stage = 'evento';
            await sendText(from, '¿Qué ocurrió? (borrado, formateo, fallo, golpe, agua)');
          } else if (s.stage === 'evento') {
            s.data.evento = textRaw;
            s.stage = 'importancia';
            await sendText(from, '¿Qué tan críticos son los datos y qué tipo son?');
          } else if (s.stage === 'importancia') {
            s.data.importancia = textRaw;
            s.stage = 'contacto';
            await sendText(from, 'Comparte un contacto preferido (WhatsApp/Email).');
          } else if (s.stage === 'contacto') {
            s.data.contacto = textRaw;
            const sum = `Resumen:\nMedio: ${s.data.medio}\nEvento: ${s.data.evento}\nDatos: ${s.data.importancia}\nContacto: ${s.data.contacto}\nGracias. Te contactaremos en breve. Escribe "menu" para otras opciones.`;
            await sendText(from, sum);
            sessions.delete(from);
          }
        }
      }
    }
  } catch (err) {
    try {
      console.error('Error en webhook de WhatsApp:', err);
    } catch {}
  }
  return res.sendStatus(200);
});

// Endpoint de prueba: enviar mensaje de verificación (requiere key=WHATSAPP_VERIFY_TOKEN)
router.post('/webhooks/whatsapp/test', async (req, res) => {
  try {
    const { to, text, key } = req.query;
    if (!key || key !== VERIFY_TOKEN) return res.status(403).json({ error: 'No autorizado' });
    if (!to) return res.status(400).json({ error: 'Falta "to"' });
    await sendText(String(to), String(text || 'Test ServSoftBagm: envío OK'));
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Fallo envío de prueba' });
  }
});

module.exports = router;
