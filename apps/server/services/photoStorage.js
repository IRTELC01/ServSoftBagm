/**
 * photoStorage.js
 * ==============================================
 * Interfaz de almacenamiento de fotos de leads (evidencia de diagnóstico/
 * reparación). Expone una única función, savePhoto(), para que las rutas
 * nunca toquen el sistema de archivos directamente.
 *
 * Implementación actual: disco local (apps/server/uploads/), servido como
 * estático en /uploads.
 *
 * ⚠️ Disco local no es apto para producción en Render (efímero, se pierde
 * en cada redeploy). Para migrar a un proveedor persistente (ej. Cloudinary
 * free tier) solo hace falta reescribir savePhoto() en este archivo — las
 * rutas y el frontend no cambian, siguen recibiendo { filename, url }.
 * ==============================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// file: { buffer, mimetype } (forma que entrega multer con memoryStorage)
async function savePhoto(file, { leadId } = {}) {
  const ext = EXT_BY_MIME[file.mimetype];
  if (!ext) {
    const err = new Error('Tipo de archivo no permitido. Usa JPG, PNG, WEBP o GIF.');
    err.status = 400;
    throw err;
  }

  const filename = `lead${leadId || 'x'}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.promises.writeFile(filePath, file.buffer);

  return { filename, url: `/uploads/${filename}` };
}

module.exports = { savePhoto, UPLOADS_DIR };
