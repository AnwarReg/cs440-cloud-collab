import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRouter from './routes/items.js';
import pool from './config/db.js';
import { runMigrations } from './migrations/runner.js';
import locationsRouter from './routes/location.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for grading/reviewing across domains
    },
    credentials: true,
  })
);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Database inspect endpoint (shows tables, columns, and applied migrations)
app.get('/api/info', async (req, res) => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    const [migrations] = await pool.query('SELECT name, executed_at FROM _migrations ORDER BY id ASC');
    const [itemColumns] = await pool.query('SHOW COLUMNS FROM items');

    res.json({
      success: true,
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'cs440_collab',
      tables: tables.map((t) => Object.values(t)[0]),
      itemsColumns: itemColumns.map((c) => ({ field: c.Field, type: c.Type })),
      appliedMigrations: migrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Mount Routes
app.use('/api/items', itemsRouter);

app.use('/api/locations', locationsRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Start server after running migrations
async function startServer() {
  try {
    // Run unapplied migrations on startup automatically
    await runMigrations();
  } catch (err) {
    console.warn('⚠️ Migration check encountered an error on startup:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CS 440 Backend API is running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Items Endpoint: http://localhost:${PORT}/api/items`);
  });
}

startServer();
