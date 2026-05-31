const jwt = require('jsonwebtoken');
const db = require('../db');

function requireAuth(req, res, next) {
  // Modo de acceso libre temporal: si OPEN_ACCESS=true, omitir verificación
  const OPEN_ACCESS = String(process.env.OPEN_ACCESS || 'false') === 'true';
  if (OPEN_ACCESS) {
    try {
      const admin = db.prepare('SELECT id, username, role FROM users WHERE username = ?').get('admin');
      req.user = admin || { id: 0, username: 'guest', role: 'guest' };
    } catch {
      req.user = { id: 0, username: 'guest', role: 'guest' };
    }
    return next();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, role }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Role-based middleware
function requireRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role || 'guest';
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
  };
}

module.exports = { requireAuth, requireRole };