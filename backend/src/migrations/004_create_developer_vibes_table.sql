-- 004_create_developer_vibes_table.sql
-- CS 440 Migration: Create developer_vibes table for team hype, vibes, and snack fuel tracking

CREATE TABLE IF NOT EXISTS developer_vibes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coder_name VARCHAR(100) NOT NULL,
    vibe_status VARCHAR(50) DEFAULT '🚀 Hype Train',
    snack_fuel VARCHAR(150) DEFAULT '☕ Coffee',
    hype_quote TEXT,
    item_id INT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
