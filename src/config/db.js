const { Pool } = require('pg');

const { DATABASE_URL, PGSSLMODE, PGSSLREJECTUNAUTHORIZED } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const resolveSslConfig = (url) => {
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get('sslmode') || PGSSLMODE;
    const rejectParam = parsed.searchParams.get('sslrejectunauthorized');
    const fallbackRejectParam =
      typeof PGSSLREJECTUNAUTHORIZED === 'string'
        ? PGSSLREJECTUNAUTHORIZED
        : null;
    const rejectUnauthorized =
      rejectParam === null
        ? fallbackRejectParam === null
          ? true
          : fallbackRejectParam.toLowerCase() !== 'false'
        : rejectParam.toLowerCase() !== 'false';
    if (!sslmode) return undefined;
    if (sslmode.toLowerCase() === 'disable') return undefined;
    if (sslmode.toLowerCase() === 'require') {
      return { rejectUnauthorized };
    }
    if (sslmode.toLowerCase() === 'verify-full') {
      return { rejectUnauthorized: true };
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: resolveSslConfig(DATABASE_URL),
});

const initDb = async () => {
  await pool.query('SELECT 1');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS identities (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id BIGSERIAL PRIMARY KEY,
      identity_id BIGINT NOT NULL REFERENCES identities(id) ON DELETE CASCADE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_otps (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_change_otps (
      id BIGSERIAL PRIMARY KEY,
      account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      new_email TEXT NOT NULL,
      otp_hash TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS email_otps_email_idx ON email_otps(email);
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS email_change_otps_account_idx
      ON email_change_otps(account_id);
  `);
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
