# CS 440: Collaborative Development and Cloud Deployment
**Gettysburg College • Advanced Systems Design • Fall 2026**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](frontend/)
[![Node/Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](backend/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208.0-4479A1?logo=mysql&logoColor=white)](backend/src/migrations/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](docker-compose.yml)

---

## 🎯 Overview

This repository contains the initial full-stack implementation for the **CS 440 Collaborative Development and Cloud Deployment** assignment.

The goal of this assignment is to gain practical experience with collaborative full-stack development, database schema migrations, and cloud deployment:
1. **Frontend**: React (Vite) single-page application with form inputs and real-time database record views.
2. **Backend**: Express REST API with connection pooling and health checks.
3. **Database**: MySQL 8.0 with automated incremental SQL migrations (`backend/src/migrations/`).
4. **Containerization**: Docker & Docker Compose for isolated and reproducible local development.
5. **Cloud Deployment**: Deployed on Railway (Backend + MySQL) and Vercel/Netlify (Frontend).

---

## 🏗️ Architecture & Project Structure

```
cs440-cloud-collab/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MySQL connection pool (supports DATABASE_URL & Railway vars)
│   │   ├── migrations/
│   │   │   ├── runner.js             # Automated SQL migration runner
│   │   │   └── 001_initial_schema.sql# Main `items` table schema
│   │   ├── routes/
│   │   │   └── items.js              # GET & POST endpoints for items
│   │   └── server.js                 # Express server & health checks
│   ├── .env.example                  # Backend environment template
│   ├── Dockerfile                    # Backend container definition
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                   # React UI (Form, Records Table, Schema Inspector)
│   │   ├── App.css                   # Custom styles & design system
│   │   ├── index.css                 # Global CSS variables & reset
│   │   └── main.jsx                  # React DOM mount point
│   ├── index.html                    # HTML entry point with Google Fonts
│   ├── vite.config.js                # Vite build & proxy config
│   ├── vercel.json                   # Vercel deployment rewrite rules
│   ├── netlify.toml                  # Netlify deployment rewrite rules
│   ├── Dockerfile                    # Frontend container definition
│   └── package.json
├── docker-compose.yml                # Full-stack local orchestration
├── .env.example                      # Root environment reference
├── README.md                         # Project documentation
└── CONTRIBUTING.md                   # Teammate feature development & PR guide
```

---

## 🚀 Quickstart: Local Development

### Option A: Using Docker Compose (Recommended)

Docker Compose starts MySQL, Backend, and Frontend containers simultaneously with a single command:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-org-or-user>/cs440-cloud-collab.git
   cd cs440-cloud-collab
   ```

2. **Start all services**:
   ```bash
   docker compose up --build
   ```

3. **Access the application**:
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5001/api/items](http://localhost:5001/api/items)
   - **Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)
   - **Schema Inspector**: [http://localhost:5001/api/info](http://localhost:5001/api/info)

4. **Stop services**:
   ```bash
   docker compose down
   ```

---

### Option B: Running Standalone with Node.js & Local/Docker MySQL

If you prefer running the backend and frontend locally using `npm`:

1. **Start a MySQL database** (via Docker or local MySQL):
   ```bash
   docker compose up mysql -d
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run migrate    # Runs unapplied SQL migrations
   npm run dev        # Starts backend server on http://localhost:5001
   ```

3. **Setup Frontend** (in a second terminal):
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev        # Starts Vite dev server on http://localhost:5173
   ```

---

## 🗄️ Database Migrations

Database schema changes are managed via incremental SQL migration files inside `backend/src/migrations/`.

- **Migration naming convention**: `001_*.sql`, `002_*.sql`, `003_*.sql`, etc.
- When the backend starts (or when you run `npm run migrate`), the runner:
  1. Creates the `_migrations` tracking table if it doesn't exist.
  2. Queries all previously applied migration filenames.
  3. Executes any unapplied `.sql` scripts in alphanumeric order inside a transaction.
  4. Records the applied migration in the `_migrations` table.

---

## ☁️ Cloud Deployment Guide

### 1. Backend & MySQL on Railway

1. Log into [Railway](https://railway.app).
2. Create a new Project.
3. Click **+ New** > **Database** > **Add MySQL**.
4. Click **+ New** > **GitHub Repo** > Select this repository.
5. In the backend service settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. In **Variables**, connect MySQL by referencing Railway's database variables:
   - `DATABASE_URL`: `${{MySQL.DATABASE_URL}}` (or set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`)
   - `PORT`: `5001` (or Railway's default `$PORT`)
   - `FRONTEND_URL`: `https://your-frontend.vercel.app` (your Vercel/Netlify URL)
7. Generate a public domain under **Settings** > **Networking** (e.g. `https://cs440-collab-backend.up.railway.app`).

### 2. Frontend on Vercel or Netlify

#### Deploying on Vercel:
1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** > **Project** > Import this repository.
3. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend.up.railway.app` (your Railway backend URL)
5. Click **Deploy**.

#### Deploying on Netlify:
1. Log into [Netlify](https://netlify.com) and import the repository.
2. Set **Base directory** to `frontend`, **Build command** to `npm run build`, and **Publish directory** to `frontend/dist`.
3. In **Environment Variables**, add `VITE_API_URL` pointing to your Railway backend URL.
4. Click **Deploy Site**.

---

## 👥 Team Collaboration Workflow

For detailed instructions on creating feature branches, adding database migrations, updating the React UI, and submitting pull requests, please read the [**CONTRIBUTING.md**](CONTRIBUTING.md) guide.

---

## 📄 License
Educational coursework repository for Gettysburg College CS 440 (Advanced Systems Design).
