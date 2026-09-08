-- 003_add_chaos_rating_to_items.sql
-- CS 440 Migration: Add chaos_rating column to main items table

ALTER TABLE items ADD COLUMN chaos_rating VARCHAR(50) DEFAULT 'Mild 🌶️';
