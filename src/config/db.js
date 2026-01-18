const { Pool } = require('pg');

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
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
