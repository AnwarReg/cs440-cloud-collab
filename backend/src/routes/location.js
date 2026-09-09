import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { location, locationDescription } = req.body;

    if (!location || typeof location !== 'string' || location.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Location is required.',
      });
    }

    const cleanLocation = location.trim();
    const cleanDescription = locationDescription
      ? String(locationDescription).trim()
      : '';

    // Insert into the main items table
    const [itemResult] = await pool.query(
      `INSERT INTO items (title, description, category, location)
       VALUES (?, ?, ?, ?)`,
      [
        cleanLocation,
        cleanDescription,
        'Location',
        cleanLocation
      ]
    );

    const itemId = itemResult.insertId;

    // Insert into the new locations table
    await pool.query(
      `INSERT INTO locations
       (item_id, location, location_description)
       VALUES (?, ?, ?)`,
      [
        itemId,
        cleanLocation,
        cleanDescription
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Location saved successfully',
      data: {
        itemId,
        location: cleanLocation,
        locationDescription: cleanDescription
      }
    });

  } catch (error) {
    console.error('Error inserting location:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to save location',
      details: error.message,
    });
  }
});

export default router;