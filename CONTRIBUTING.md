# Teammate Contribution Guide: CS 440 Collaborative Development

This guide outlines the exact steps for each team member to complete their **Individual Feature Work** without merge conflicts or breaking existing code.

---

## 📋 Assignment Objectives for Each Team Member

Each team member must:
1. Create a feature branch locally.
2. **Create a migration** that creates **one new table** in MySQL.
3. **Create a migration** that adds **a new column to the main `items` table**.
4. Add input fields and a button on the React frontend.
5. Ensure clicking the button inserts data into **both**:
   - The main `items` table.
   - Your new custom table.
6. Test locally using Docker / npm.
7. Push the branch, open a Pull Request (PR), and participate in peer code review.

---

## 🛠️ Step-by-Step Instructions

### Step 1: Pull Latest Main & Create a Feature Branch

Always start from an up-to-date `main` branch:

```bash
git checkout main
git pull origin main
git checkout -b feature/<your-name>-custom-task
```
*(Example: `git checkout -b feature/alice-activity-logs`)*

---

### Step 2: Create Migration #1 (Create Your New Table)

In `backend/src/migrations/`, create a new SQL file with the next sequential number.

*Example filename:* `backend/src/migrations/002_create_user_logs_table.sql`

```sql
-- 002_create_user_logs_table.sql
CREATE TABLE IF NOT EXISTS user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    action_note TEXT,
    item_id INT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### Step 3: Create Migration #2 (Add Column to Main `items` Table)

Create another migration file adding your specific column to `items`.

*Example filename:* `backend/src/migrations/003_add_status_column_to_items.sql`

```sql
-- 003_add_status_column_to_items.sql
ALTER TABLE items ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
```

---

### Step 4: Update Backend Endpoints / Logic

1. Open `backend/src/routes/items.js` (or create a dedicated route file in `backend/src/routes/` and mount it in `server.js`).
2. Update the `POST` route or add your custom endpoint so that when data is submitted, it inserts into **both** `items` and your new table.

*Example addition in `backend/src/routes/items.js`:*
```javascript
// Inside POST /api/items or a custom endpoint:
const [itemResult] = await pool.query(
  'INSERT INTO items (title, description, category, status) VALUES (?, ?, ?, ?)',
  [itemTitle, itemDescription, itemCategory, status || 'Active']
);

// Insert into your new table:
await pool.query(
  'INSERT INTO user_logs (author_name, action_note, item_id) VALUES (?, ?, ?)',
  [authorName || 'Teammate', `Created item: ${itemTitle}`, itemResult.insertId]
);
```

---

### Step 5: Update Frontend React UI

1. Open `frontend/src/App.jsx`.
2. Add the state variables for your new input fields.
3. Add the input fields and buttons to the UI.
4. Pass the new values in your `fetch` `POST` request payload.

---

### Step 6: Test Locally

1. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```
2. Start the backend & frontend (or run `docker compose up --build`).
3. Open [http://localhost:5173](http://localhost:5173).
4. Fill out the form, click the submit button, and verify:
   - The new row appears in the live records table.
   - The **Schema Inspector** shows your new table and added columns!

---

### Step 7: Commit, Push, and Open a Pull Request

```bash
git add .
git commit -m "feat(collab): add user_logs table and status column migration"
git push origin feature/<your-name>-custom-task
```

1. Go to the GitHub repository.
2. Click **Compare & pull request**.
3. Fill out the PR description summarizing:
   - Which new table was created.
   - Which column was added to `items`.
   - What UI inputs/actions were added.
4. Request a review from at least one teammate.

---

### Step 8: Reviewing & Merging PRs

- **Reviewer**: Check that migrations are sequentially numbered, that no sensitive files (`.env`) are committed, and that code runs cleanly.
- Approve the PR.
- Merge into `main` using **Squash and merge** or **Merge pull request**.
- The deployed version on Railway / Vercel will automatically re-deploy and apply new migrations!
