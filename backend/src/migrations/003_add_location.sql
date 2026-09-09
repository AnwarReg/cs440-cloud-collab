-- 003_add_member_data_to_items.sql
-- Add a column for this team member's data

ALTER TABLE items
ADD COLUMN location VARCHAR(255);