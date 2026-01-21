const { Pool } = require('pg');

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const resolveSslFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get('sslmode');
    return sslmode && sslmode.toLowerCase() === 'require';
  } catch (error) {
    return false;
  }
};

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: resolveSslFromUrl(DATABASE_URL) || undefined,
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
