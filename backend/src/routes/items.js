import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/items - Retrieve all records from main `items` table (with extracted text if available)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.*,
        dt.extracted_text
      FROM items i
      LEFT JOIN document_text dt ON dt.item_id = i.id
      ORDER BY i.created_at DESC
    `);
    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    // Fallback if document_text table is not yet created
    try {
      const [rows] = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
      res.json({
        success: true,
        count: rows.length,
        data: rows,
      });
    } catch (fallbackError) {
      console.error('Error fetching items:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve items from database',
        details: error.message,
      });
    }
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
        i.chaos_rating,
        i.location
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

// GET /api/items/reviews - Retrieve code reviews with associated item information
router.get('/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.id,
        r.reviewer_name,
        r.review_status,
        r.feedback,
        r.item_id,
        r.reviewed_at,
        i.title AS item_title,
        i.category AS item_category,
        i.priority
      FROM damian_reviews r
      LEFT JOIN items i ON r.item_id = i.id
      ORDER BY r.reviewed_at DESC
    `);
    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve reviews from database',
      details: error.message,
    });
  }
});

// POST /api/items - Insert record into `items`, `document_text`, `developer_vibes`, and `damian_reviews`
router.post('/', async (req, res) => {
  const {
    title,
    description,
    category,
    location,
    extractedText,
    chaos_rating,
    priority,
    coder_name,
    vibe_status,
    snack_fuel,
    hype_quote,
    reviewer_name,
    review_status,
    feedback,
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
  const itemLocation = location ? String(location).trim() : 'Unknown';
  const itemChaos = chaos_rating ? String(chaos_rating).trim() : 'Mild 🌶️';
  const itemPriority = priority ? String(priority).trim() : 'Medium';
  const itemText = extractedText ? String(extractedText).trim() : '';

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert into main `items` table
    const [itemResult] = await connection.query(
      'INSERT INTO items (title, description, category, location, chaos_rating, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [itemTitle, itemDescription, itemCategory, itemLocation, itemChaos, itemPriority]
    );

    const insertedItemId = itemResult.insertId;

    // 2. Insert into `document_text` table if text provided
    if (itemText !== '') {
      await connection.query(
        'INSERT INTO document_text (item_id, extracted_text) VALUES (?, ?)',
        [insertedItemId, itemText]
      );
    }

    // 3. Insert into `developer_vibes` table
    const authorName = coder_name && String(coder_name).trim() ? String(coder_name).trim() : 'Joseph Sackitey';
    const vibeStatusVal = vibe_status && String(vibe_status).trim() ? String(vibe_status).trim() : '🚀 Hype Train';
    const snack = snack_fuel && String(snack_fuel).trim() ? String(snack_fuel).trim() : '☕ Coffee & Code';
    const quote = hype_quote && String(hype_quote).trim() ? String(hype_quote).trim() : `Shipped: ${itemTitle}`;

    const [vibeResult] = await connection.query(
      'INSERT INTO developer_vibes (coder_name, vibe_status, snack_fuel, hype_quote, item_id) VALUES (?, ?, ?, ?, ?)',
      [authorName, vibeStatusVal, snack, quote, insertedItemId]
    );

    // 4. Insert into `damian_reviews` table
    const reviewerVal = reviewer_name && String(reviewer_name).trim() ? String(reviewer_name).trim() : 'Damian';
    const statusVal = review_status && String(review_status).trim() ? String(review_status).trim() : 'Pending';
    const feedbackVal = feedback && String(feedback).trim() ? String(feedback).trim() : '';

    const [reviewResult] = await connection.query(
      'INSERT INTO damian_reviews (item_id, reviewer_name, review_status, feedback) VALUES (?, ?, ?, ?)',
      [insertedItemId, reviewerVal, statusVal, feedbackVal]
    );

    const [insertedItems] = await connection.query('SELECT * FROM items WHERE id = ?', [insertedItemId]);
    const [insertedVibes] = await connection.query('SELECT * FROM developer_vibes WHERE id = ?', [vibeResult.insertId]);
    const [insertedReviews] = await connection.query('SELECT * FROM damian_reviews WHERE id = ?', [reviewResult.insertId]);

    await connection.commit();

    const createdItem = insertedItems[0];
    const createdVibe = insertedVibes[0] || null;
    const createdReview = insertedReviews[0] || null;

    res.status(201).json({
      success: true,
      message: 'Item and related records created successfully',
      data: {
        ...createdItem,
        item: createdItem,
        vibe: createdVibe,
        review: createdReview,
        extractedText: itemText,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting item and associated data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to insert data into database',
      details: error.message,
    });
  } finally {
    connection.release();
  }
});

export default router;
