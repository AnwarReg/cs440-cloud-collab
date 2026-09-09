-- 002_new_table.sql
-- Creates a new table

CREATE TABLE IF NOT EXISTS new_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id)
);