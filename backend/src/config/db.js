import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

function getDbConfig() {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

  if (dbUrl) {
    return {
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    };
  }

  return {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'password',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'cs440_collab',
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  };
}

const config = getDbConfig();
const pool = config.uri ? mysql.createPool(config.uri) : mysql.createPool(config);

export async function testConnection(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Connected to MySQL database successfully.');
      connection.release();
      return true;
    } catch (err) {
      console.warn(`⚠️ MySQL connection attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        console.error('❌ Could not connect to MySQL after maximum retries.');
        throw err;
      }
    }
  }
}

export default pool;
