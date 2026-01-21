const { Pool } = require('pg');

const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_SSL,
  DB_SSL_REJECT_UNAUTHORIZED,
  DB_POOL_MAX,
  DB_POOL_IDLE_MS,
  DB_POOL_CONN_TIMEOUT_MS,
} = process.env;

const parseOptionalInt = (value) => {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildPoolConfig = () => {
  if (DATABASE_URL) {
    return {
      connectionString: DATABASE_URL,
    };
  }

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('DATABASE_URL or DB_HOST/DB_USER/DB_NAME must be set');
  }

  return {
    host: DB_HOST,
    port: parseOptionalInt(DB_PORT),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  };
};

const sslEnabled = DB_SSL === 'true';
const sslConfig = sslEnabled
  ? { rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
  : undefined;

const pool = new Pool({
  ...buildPoolConfig(),
  ssl: sslConfig,
  max: parseOptionalInt(DB_POOL_MAX),
  idleTimeoutMillis: parseOptionalInt(DB_POOL_IDLE_MS),
  connectionTimeoutMillis: parseOptionalInt(DB_POOL_CONN_TIMEOUT_MS),
});

const initDb = async () => {
  await pool.query('SELECT 1');
  console.log('Postgres connected');
};

const closeDb = async () => {
  await pool.end();
};

module.exports = {
  pool,
  initDb,
  closeDb,
};
