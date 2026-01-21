const express = require('express');
const router = express.Router();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

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
      const text = (msg.text?.body || '').toLowerCase();

      let reply = 'Hola, somos ServSoftBagm. ¿Qué servicio necesitas?\n1) Soporte\n2) Mantenimiento\n3) Desarrollo';
      if (text.includes('1') || text.includes('soporte')) reply = 'Cuéntanos tu incidencia y el equipo afectado. Podemos asistir remoto o presencial.';
      else if (text.includes('2') || text.includes('mantenimiento')) reply = 'Indica tipo de equipo (PC, impresora, móvil) y síntomas.';
      else if (text.includes('3') || text.includes('desarrollo')) reply = 'Describe el proceso a automatizar y el entorno actual.';

      if (PHONE_NUMBER_ID && WHATSAPP_TOKEN) {
        await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: from,
            text: { body: reply },
          }),
        });
      } else {
        console.warn('WhatsApp env vars faltantes: WHATSAPP_TOKEN y/o WHATSAPP_PHONE_NUMBER_ID');
      }
    }
  } catch (err) {
    console.error('Error en webhook de WhatsApp:', err);
  }
  return res.sendStatus(200);
});

module.exports = router;
