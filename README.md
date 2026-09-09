# CS 440: Collaborative Development and Cloud Deployment
**Gettysburg College • Advanced Systems Design • Fall 2026**


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
