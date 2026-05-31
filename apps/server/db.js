const usePg = (String(process.env.DB_DRIVER || '').toLowerCase() === 'pg') || !!process.env.DATABASE_URL;
module.exports = usePg ? require('./db-pg') : require('./db-sqlite');
