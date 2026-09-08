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

// POST /api/items - Insert a new record into `items` and, when text is
// provided, a matching row into `document_text`
router.post('/', async (req, res) => {
  const { title, description, category, location, extractedText } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Field "title" is required and must be non-empty.',
    });
  }

  const itemTitle = title.trim();
  const itemDescription = description ? String(description).trim() : '';
  const itemCategory = category ? String(category).trim() : 'General';
  const itemLocation = location ? String(location).trim() : 'Unknown';
  const itemText = extractedText ? String(extractedText).trim() : '';

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      'INSERT INTO items (title, description, category, location) VALUES (?, ?, ?, ?)',
      [itemTitle, itemDescription, itemCategory, itemLocation]
    );

    if (itemText !== '') {
      await connection.query(
        'INSERT INTO document_text (item_id, extracted_text) VALUES (?, ?)',
        [result.insertId, itemText]
      );
    }

    const [insertedRows] = await connection.query('SELECT * FROM items WHERE id = ?', [
      result.insertId,
    ]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: insertedRows[0],
      extractedText: itemText,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to insert item into database',
      details: error.message,
    });
  } finally {
    connection.release();
  }
});

export default router;
