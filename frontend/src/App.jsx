import React, { useState, useEffect } from 'react';
import {
  Database,
  Server,
  PlusCircle,
  RefreshCw,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  GitBranch,
  Terminal,
  ExternalLink
} from 'lucide-react';
import './App.css';

// API base URL configured via environment or proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [health, setHealth] = useState({ status: 'connecting', database: 'checking...' });
  const [dbInfo, setDbInfo] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [description, setDescription] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'disconnected', database: 'unreachable', error: err.message });
    }
  };

  const fetchDbInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/info`);
      if (res.ok) {
        const data = await res.json();
        setDbInfo(data);
      }
    } catch (err) {
      console.warn('Could not load database info:', err.message);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/items`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result.success) {
        setItems(result.data || []);
      }
    } catch (err) {
      showToast(`Failed to load items: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchDbInfo();
    fetchItems();

    // Heartbeat check every 15 seconds
    const interval = setInterval(() => {
      fetchHealth();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an item title.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || `HTTP ${res.status}`);
      }

      showToast(`Row #${result.data.id} inserted successfully into MySQL!`, 'success');
      setTitle('');
      setDescription('');
      fetchItems();
      fetchDbInfo();
    } catch (err) {
      showToast(`Insert failed: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillSample = () => {
    const samples = [
      { title: 'Setup GitHub Actions CI', category: 'DevOps', description: 'Automated testing and linting workflow on push.' },
      { title: 'Add MySQL Table Migration', category: 'Database', description: 'Defined schema for user activity tracking.' },
      { title: 'Deploy API to Railway', category: 'Backend', description: 'Configured environment variables and auto-deploy trigger.' },
      { title: 'Build React Filter UI', category: 'Frontend', description: 'Added category selector and live search.' }
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setTitle(picked.title);
    setCategory(picked.category);
    setDescription(picked.description);
  };

  return (
    <div className="app-container">
      {/* Toast Banner */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Header */}
      <header className="hero-header">
        <div className="header-top">
          <div>
            <div className="course-badge">
              <Sparkles size={14} /> Gettysburg College • CS 440
            </div>
            <h1 className="hero-title">
              Cloud <span>Collaborative Development</span>
            </h1>
            <p className="hero-subtitle">
              Full-Stack Application with React, Node/Express, MySQL, Docker, and Automated Migrations.
            </p>
          </div>

          <div className="status-pill">
            <span className={`status-indicator ${health.status}`} />
            <span>
              {health.status === 'healthy'
                ? 'Cloud Backend & MySQL Online'
                : health.status === 'connecting'
                ? 'Connecting to API...'
                : 'Service Offline'}
            </span>
          </div>
        </div>

        <div className="header-meta">
          <div className="meta-item">
            <Server size={16} />
            <span>Target API: <strong>{API_BASE_URL || 'Local Proxy (/api)'}</strong></span>
          </div>
          <div className="meta-item">
            <Database size={16} />
            <span>Database: <strong>{dbInfo?.database || (health.database === 'connected' ? 'Connected' : 'MySQL')}</strong></span>
          </div>
          <div className="meta-item">
            <Layers size={16} />
            <span>Tables in DB: <strong>{dbInfo?.tables?.length ?? '1'}</strong></span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* Left Column: Form Card */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon">
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 className="card-title">Insert Record</h2>
                <span className="card-subtitle">Adds a new row to the MySQL <code>items</code> table</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="item-form">
            <div className="form-group">
              <label htmlFor="item-title">
                Title <span className="required">*</span>
              </label>
              <input
                id="item-title"
                type="text"
                className="form-input"
                placeholder="e.g. Deploy feature to Railway"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="item-category">Category</label>
              <select
                id="item-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="item-desc">Description / Notes</label>
              <textarea
                id="item-desc"
                className="form-textarea"
                placeholder="Add details, notes, or teammate attribution..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Inserting...
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} /> Insert Into Database
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleFillSample}
              >
                <Sparkles size={14} /> Fill Sample Data
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Live Records Card */}
        <section className="card records-container">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon">
                <Database size={20} />
              </div>
              <div>
                <h2 className="card-title">Live Database Records</h2>
                <span className="card-subtitle">Real-time rows fetched from MySQL <code>items</code> table</span>
              </div>
            </div>

            <div className="records-meta-bar">
              <span className="count-badge">{items.length} {items.length === 1 ? 'Record' : 'Records'}</span>
              <button
                className="btn-secondary"
                onClick={() => {
                  fetchItems();
                  fetchDbInfo();
                  fetchHealth();
                }}
                title="Refresh Records"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          {loading && items.length === 0 ? (
            <div className="empty-state">
              <RefreshCw size={32} className="animate-spin text-muted" />
              <p>Fetching records from MySQL...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <Database size={40} className="empty-icon" />
              <p>No records found in the database yet.</p>
              <span className="card-subtitle">Use the form on the left to insert the first record!</span>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>#{item.id}</td>
                      <td style={{ fontWeight: 600 }}>{item.title}</td>
                      <td>
                        <span className="tag-badge">{item.category || 'General'}</span>
                      </td>
                      <td style={{ color: '#cbd5e1', maxWidth: '280px' }}>
                        {item.description || <span style={{ color: '#64748b' }}>—</span>}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Schema Inspector & Teammate Feature Work Section */}
      <section className="collapsible-card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon">
              <GitBranch size={20} />
            </div>
            <div>
              <h2 className="card-title">Live Schema & Migration Inspector</h2>
              <span className="card-subtitle">
                Inspect database tables and columns dynamically as teammates apply new migrations
              </span>
            </div>
          </div>
        </div>

        <div className="schema-grid">
          <div className="schema-box">
            <div className="schema-box-title">Active Database Tables</div>
            <div className="schema-pill-list">
              {dbInfo?.tables && dbInfo.tables.length > 0 ? (
                dbInfo.tables.map((tbl) => (
                  <span key={tbl} className="schema-pill">
                    📁 {tbl}
                  </span>
                ))
              ) : (
                <span className="schema-pill">items</span>
              )}
            </div>
          </div>

          <div className="schema-box">
            <div className="schema-box-title">Columns in `items` Table</div>
            <div className="schema-pill-list">
              {dbInfo?.itemsColumns && dbInfo.itemsColumns.length > 0 ? (
                dbInfo.itemsColumns.map((col) => (
                  <span key={col.field} className="schema-pill">
                    {col.field} <small style={{ color: '#94a3b8' }}>({col.type})</small>
                  </span>
                ))
              ) : (
                <>
                  <span className="schema-pill">id</span>
                  <span className="schema-pill">title</span>
                  <span className="schema-pill">category</span>
                  <span className="schema-pill">description</span>
                  <span className="schema-pill">created_at</span>
                </>
              )}
            </div>
          </div>

          <div className="schema-box">
            <div className="schema-box-title">Applied Migrations</div>
            <div className="schema-pill-list">
              {dbInfo?.appliedMigrations && dbInfo.appliedMigrations.length > 0 ? (
                dbInfo.appliedMigrations.map((m) => (
                  <span key={m.name} className="schema-pill" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                    ✅ {m.name}
                  </span>
                ))
              ) : (
                <span className="schema-pill">001_initial_schema.sql</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
