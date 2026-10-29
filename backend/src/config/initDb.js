const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function initializeDatabase() {
  console.log('====================================================');
  console.log('  GenZ Fits (VÉLORA) - PostgreSQL DB Initializer    ');
  console.log('====================================================\n');

  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

  try {
    console.log('1. Testing PostgreSQL connection...');
    const client = await pool.connect();
    console.log('   ✓ Connected to PostgreSQL server.');

    console.log('\n2. Reading and executing schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('   ✓ Database schema created successfully (products table and indexes).');

    console.log('\n3. Reading and executing seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('   ✓ Sample products seeded successfully.');

    // Verify row count
    const countRes = await client.query('SELECT COUNT(*) AS total FROM products');
    console.log(`\n4. Verification: ${countRes.rows[0].total} products registered in the database.`);

    client.release();
    console.log('\n[SUCCESS] Database initialization completed successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n[ERROR] Database initialization failed:');
    console.error(`Reason: ${err.message}`);
    console.error('\nTroubleshooting tips:');
    console.error('1. Make sure your PostgreSQL server is running.');
    console.error('2. Ensure the database specified in .env (e.g., "ecommerce_db") exists.');
    console.error('   You can create it by running: createdb -U postgres ecommerce_db');
    console.error('3. Check user/password in backend/.env.');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
