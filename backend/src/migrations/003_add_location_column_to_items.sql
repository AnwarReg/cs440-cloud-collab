-- Add location column to items table
ALTER TABLE items ADD COLUMN location VARCHAR(100) DEFAULT 'Unknown';
