const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');
const accountingRoutes = require('./routes/accounting');
const whatsappWebhook = require('./routes/whatsapp');
const db = require('./db');
const bcrypt = require('bcryptjs');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;
const OPEN_ACCESS = String(process.env.OPEN_ACCESS || 'false') === 'true';

// Permitir frontend en la nube y desarrollo local (5173/5174)
// Soporta múltiples orígenes vía FRONTEND_ORIGIN separados por comas.
const envOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...envOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // En modo OPEN_ACCESS permitir cualquier origen (trial / demostración)
    if (OPEN_ACCESS) return callback(null, true);
    // Permitir peticiones internas (sin origin) y orígenes declarados
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: Origin no permitido'));
  },
  credentials: true,
}));
// Preflight explícito para asegurar respuesta de CORS en Render
// Nota: evitar '*' porque path-to-regexp en algunas versiones lo rechaza.
// Usamos un RegExp que matchea cualquier ruta para OPTIONS.
app.options(/.*/, cors({
  origin: (origin, callback) => {
    if (OPEN_ACCESS) return callback(null, true);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: Origin no permitido'));
  },
  credentials: true,
}));
// Fallback: incluir encabezados CORS y responder OPTIONS si alguna capa interfiere
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = OPEN_ACCESS || !origin || allowedOrigins.includes(origin);
  if (allowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
// Aplicar limitador solo a rutas de API para no afectar health checks
app.use('/api', limiter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', app: 'ServSoftBagm API' });
});

// Fotos de evidencia subidas por el admin (disco local, ver services/photoStorage.js
// para el aviso de migración pendiente antes de producción en Render)
app.use('/uploads', express.static(process.env.UPLOADS_DIR || path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/leads', require('./routes/leads'));
// Webhook de WhatsApp (ruta pública)
app.use('/', whatsappWebhook);

// Asegurar usuario admin con contraseña por defecto (para desarrollo local)
(async () => {
  try {
    const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'servsoft123';
    if (db.ready && typeof db.ready.then === 'function') await db.ready;

    const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');

    if (!admin) {
      const hash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
      db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hash, 'superadmin');
      console.log('\n✅ Usuario admin creado correctamente. La contraseña es la definida en DEFAULT_ADMIN_PASSWORD (.env).\n');
    } else {
      // Actualizar rol si no lo tiene (compatible con SQLite y PostgreSQL)
      db.prepare(`UPDATE users SET role = ? WHERE username = ? AND (role IS NULL OR role = '')`).run('superadmin', 'admin');
      console.log('Usuario admin existente.');
    }
  } catch (e) {
    console.warn('No se pudo garantizar usuario admin por defecto:', e?.message || e);
  }
})();

app.listen(PORT, () => {
  const dbType = (String(process.env.DB_DRIVER || '').toLowerCase() === 'pg') || !!process.env.DATABASE_URL 
    ? 'PostgreSQL' 
    : 'SQLite';
  
  console.log(`\nServSoftBagm API escuchando en http://localhost:${PORT}`);
  console.log(`Base de datos activa: ${dbType}\n`);
});
