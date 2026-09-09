-- Create document_text table
CREATE TABLE IF NOT EXISTS document_text (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FULLTEXT KEY ft_extracted_text (extracted_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
