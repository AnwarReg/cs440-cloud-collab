import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/items - Retrieve all records from main `items` table
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve items from database',
      details: error.message,
    });
  }
});

// GET /api/items/vibes - Retrieve developer vibe logs with associated item information
router.get('/vibes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        v.id,
        v.coder_name,
        v.vibe_status,
        v.snack_fuel,
        v.hype_quote,
        v.item_id,
        v.logged_at,
        i.title AS item_title,
        i.category AS item_category,
        i.chaos_rating
      FROM developer_vibes v
      LEFT JOIN items i ON v.item_id = i.id
      ORDER BY v.logged_at DESC
    `);
    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching developer vibes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve developer vibes from database',
      details: error.message,
    });
  }
});

// POST /api/items - Insert record into `items` table and team member's `developer_vibes` table
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      chaos_rating,
      coder_name,
      vibe_status,
      snack_fuel,
      hype_quote,
    } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Field "title" is required and must be non-empty.',
      });
    }

    const itemTitle = title.trim();
    const itemDescription = description ? String(description).trim() : '';
    const itemCategory = category ? String(category).trim() : 'General';
    const itemChaos = chaos_rating ? String(chaos_rating).trim() : 'Mild 🌶️';

    // 1. Insert into main `items` table
    const [itemResult] = await pool.query(
      'INSERT INTO items (title, description, category, chaos_rating) VALUES (?, ?, ?, ?)',
      [itemTitle, itemDescription, itemCategory, itemChaos]
    );

    const insertedItemId = itemResult.insertId;

    // 2. Insert into team member's `developer_vibes` table
    const authorName = coder_name && String(coder_name).trim() ? String(coder_name).trim() : 'Joseph Sackitey';
    const vibeStatus = vibe_status && String(vibe_status).trim() ? String(vibe_status).trim() : '🚀 Hype Train';
    const snack = snack_fuel && String(snack_fuel).trim() ? String(snack_fuel).trim() : '☕ Coffee & Code';
    const quote = hype_quote && String(hype_quote).trim() ? String(hype_quote).trim() : `Shipped: ${itemTitle}`;

    const [vibeResult] = await pool.query(
      'INSERT INTO developer_vibes (coder_name, vibe_status, snack_fuel, hype_quote, item_id) VALUES (?, ?, ?, ?, ?)',
      [authorName, vibeStatus, snack, quote, insertedItemId]
    );

    const [insertedItems] = await pool.query('SELECT * FROM items WHERE id = ?', [insertedItemId]);
    const [insertedVibes] = await pool.query('SELECT * FROM developer_vibes WHERE id = ?', [vibeResult.insertId]);

    res.status(201).json({
      success: true,
      message: 'Item and Developer Vibe created successfully',
      data: {
        item: insertedItems[0],
        vibe: insertedVibes[0],
      },
    });
  } catch (error) {
    console.error('Error inserting item and vibe:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to insert data into database',
      details: error.message,
    });
  }
});

export default router;
