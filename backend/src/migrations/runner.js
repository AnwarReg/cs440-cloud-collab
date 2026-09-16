import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { testConnection } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('🔄 Checking database migrations...');
  await testConnection();

  const connection = await pool.getConnection();

  try {
    // 1. Ensure migrations tracking table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Fetch already executed migrations
    const [rows] = await connection.query('SELECT name FROM _migrations');
    const executedMigrations = new Set(rows.map((r) => r.name));

    // 3. Read migration files in alphabetical order
    const files = await fs.readdir(__dirname);
    const sqlFiles = files
      .filter((file) => file.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    if (sqlFiles.length === 0) {
      console.log('ℹ️ No migration SQL files found.');
      return;
    }

    let appliedCount = 0;

    for (const file of sqlFiles) {
      if (executedMigrations.has(file)) {
        continue;
      }

      console.log(`➡️ Running migration: ${file}...`);
      const filePath = path.join(__dirname, file);
      const sqlContent = await fs.readFile(filePath, 'utf-8');

      // Split multiple SQL statements by semicolon (ignoring comments/empty lines)
      const statements = sqlContent
        .split(/;\s*$/m)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await connection.beginTransaction();
      try {
        for (const statement of statements) {
          try {
            await connection.query(statement);
          } catch (stmtErr) {
            // Idempotency: handle duplicate column, table, or key gracefully if already created
            if (
              stmtErr.code === 'ER_DUP_FIELDNAME' ||
              stmtErr.errno === 1060 ||
              stmtErr.code === 'ER_TABLE_EXISTS_ERROR' ||
              stmtErr.errno === 1050 ||
              stmtErr.code === 'ER_DUP_KEYNAME' ||
              stmtErr.errno === 1061
            ) {
              console.warn(
                `ℹ️ Schema already satisfies statement in ${file} (${stmtErr.message}). Continuing.`
              );
            } else {
              throw stmtErr;
            }
          }
        }
        await connection.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
        await connection.commit();
        console.log(`✅ Applied migration: ${file}`);
        appliedCount++;
      } catch (err) {
        await connection.rollback();
        console.error(`❌ Migration failed in ${file}:`, err.message);
        throw err;
      }
    }

    if (appliedCount === 0) {
      console.log('✨ Database is already up to date. No new migrations.');
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} new migration(s).`);
    }
  } finally {
    connection.release();
  }
}

// Allow standalone execution (e.g. `npm run migrate`)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log('🚀 Migration script completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Migration runner error:', err);
      process.exit(1);
    });
}
