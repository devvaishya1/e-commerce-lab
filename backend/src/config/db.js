const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
  : {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'ecommerce_db',
      password: process.env.PGPASSWORD || 'postgres',
      port: parseInt(process.env.PGPORT, 10) || 5432,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 30000,
      max: 10
    };

const pool = new Pool(poolConfig);

let isDbConnected = false;
let lastDbError = null;

// Test connection on startup
async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS now, current_database() AS db');
    client.release();
    isDbConnected = true;
    lastDbError = null;
    console.log(`[Database] PostgreSQL connected successfully to database: "${res.rows[0].db}" at ${res.rows[0].now}`);
    return { connected: true, database: res.rows[0].db, timestamp: res.rows[0].now };
  } catch (err) {
    isDbConnected = false;
    lastDbError = err.message;
    console.warn(`[Database Warning] Unable to connect to PostgreSQL at ${poolConfig.host || 'remote'}:${poolConfig.port || 5432}`);
    console.warn(`[Database Details] ${err.message}`);
    console.info('[Database Help] Ensure PostgreSQL is running and credentials match .env. Run "npm run db:init" once PostgreSQL is available.');
    return { connected: false, error: err.message };
  }
}

// Wrapper for executing SQL queries
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Database Query] executed in ${duration}ms: ${text.slice(0, 80)}${text.length > 80 ? '...' : ''}`);
    }
    return res;
  } catch (err) {
    console.error(`[Database Query Error] ${err.message}`);
    throw err;
  }
}

module.exports = {
  pool,
  query,
  testConnection,
  getDbStatus: () => ({
    connected: isDbConnected,
    lastError: lastDbError,
    host: poolConfig.host || 'remote',
    database: poolConfig.database || 'configured'
  })
};
