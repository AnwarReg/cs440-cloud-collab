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
  ExternalLink,
  Flame,
  Coffee,
  Zap,
  Rocket,
  MessageSquareQuote,
  Utensils
} from 'lucide-react';
import './App.css';

// API base URL configured via environment or proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [items, setItems] = useState([]);
  const [vibes, setVibes] = useState([]);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'vibes'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [health, setHealth] = useState({ status: 'connecting', database: 'checking...' });
  const [dbInfo, setDbInfo] = useState(null);
  const [toast, setToast] = useState(null);

  // Main Item Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [chaosRating, setChaosRating] = useState('Mild 🌶️');
  const [description, setDescription] = useState('');

  // Team Member Vibe Station Form State (developer_vibes table)
  const [coderName, setCoderName] = useState('Joseph Sackitey');
  const [vibeStatus, setVibeStatus] = useState('🚀 Hype Train');
  const [snackFuel, setSnackFuel] = useState('☕ Cold Brew & Gummy Bears');
  const [hypeQuote, setHypeQuote] = useState('It worked on my machine, shipping to prod!');

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

  const fetchVibes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/items/vibes`);
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setVibes(result.data || []);
        }
      }
    } catch (err) {
      console.warn('Failed to load developer vibes:', err.message);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchDbInfo();
    fetchItems();
    fetchVibes();

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
          chaos_rating: chaosRating,
          description: description.trim(),
          coder_name: coderName.trim(),
          vibe_status: vibeStatus,
          snack_fuel: snackFuel.trim(),
          hype_quote: hypeQuote.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || `HTTP ${res.status}`);
      }

      showToast(`🚀 Item #${result.data.item.id} & Vibe Log saved to MySQL!`, 'success');
      setTitle('');
      setDescription('');
      fetchItems();
      fetchVibes();
      fetchDbInfo();
    } catch (err) {
      showToast(`Insert failed: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillSample = () => {
    const samples = [
      {
        title: 'Zero Downtime MySQL Migration',
        category: 'Database',
        chaos: 'Spicy 🌶️🌶️',
        desc: 'Added developer_vibes table and chaos rating with automated rollback support.',
        coder: 'Joseph Sackitey',
        vibe: '🚀 Hype Train',
        snack: '🧋 Boba Milk Tea & Pocky',
        quote: 'Migrations ran in 42ms. Pure magic!'
      },
      {
        title: 'Auto-Scaling Express Backend on Railway',
        category: 'DevOps',
        chaos: 'Absolute Mayhem 💥',
        desc: 'Provisioned container replicas under traffic spikes.',
        coder: 'Captain Cloud',
        vibe: '☕ Pure Caffeine',
        snack: '⚡ Monster Energy & Doritos',
        quote: 'No 502 Bad Gateways on my watch!'
      },
      {
        title: 'Modern Glassmorphic React Dashboard',
        category: 'Frontend',
        chaos: 'Zen 🧘',
        desc: 'Crafted responsive tabs, lively badges, and real-time schema inspector.',
        coder: 'Joseph Sackitey',
        vibe: '✨ Cloud Wizard',
        snack: '🍕 Cold Pizza & Cold Brew',
        quote: 'Clean CSS and zero layout shifts.'
      },
      {
        title: 'Debugging Race Condition at 3 AM',
        category: 'Backend',
        chaos: 'Production Danger ☢️',
        desc: 'Traced connection pool deadlock in async transaction wrapper.',
        coder: 'Midnight Hacker',
        vibe: '💀 3 AM Panic',
        snack: '🍫 Dark Chocolate & Tears',
        quote: 'It worked in production, please do not touch anything.'
      }
    ];

    const picked = samples[Math.floor(Math.random() * samples.length)];
    setTitle(picked.title);
    setCategory(picked.category);
    setChaosRating(picked.chaos);
    setDescription(picked.desc);
    setCoderName(picked.coder);
    setVibeStatus(picked.vibe);
    setSnackFuel(picked.snack);
    setHypeQuote(picked.quote);
  };

  const getChaosClass = (chaos) => {
    if (!chaos) return 'mild';
    const lower = chaos.toLowerCase();
    if (lower.includes('zen')) return 'zen';
    if (lower.includes('spicy')) return 'spicy';
    if (lower.includes('mayhem')) return 'mayhem';
    if (lower.includes('danger')) return 'danger';
    return 'mild';
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
              Full-Stack Application with React, Node/Express, MySQL, Automated Migrations, & Developer Hype Station.
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
            <span>Tables in DB: <strong>{dbInfo?.tables?.length ?? '2'}</strong></span>
          </div>
          <div className="meta-item">
            <Zap size={16} />
            <span>Vibes Logged: <strong>{vibes.length}</strong></span>
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
                <h2 className="card-title">Insert Record & Log Vibe</h2>
                <span className="card-subtitle">
                  Saves to <code>items</code> &amp; <code>developer_vibes</code> tables
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="item-form">
            {/* Main Item Fields */}
            <div className="form-group">
              <label htmlFor="item-title">
                Task / Feature Title <span className="required">*</span>
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

            <div className="vibe-grid-2">
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
                <label htmlFor="item-chaos">
                  <span>Chaos Rating</span>
                  <small style={{ color: '#c084fc' }}>+New Column</small>
                </label>
                <select
                  id="item-chaos"
                  className="form-select"
                  value={chaosRating}
                  onChange={(e) => setChaosRating(e.target.value)}
                >
                  <option value="Zen 🧘">Zen 🧘</option>
                  <option value="Mild 🌶️">Mild 🌶️</option>
                  <option value="Spicy 🌶️🌶️">Spicy 🌶️🌶️</option>
                  <option value="Absolute Mayhem 💥">Absolute Mayhem 💥</option>
                  <option value="Production Danger ☢️">Production Danger ☢️</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="item-desc">Description / Notes</label>
              <textarea
                id="item-desc"
                className="form-textarea"
                placeholder="Add implementation notes, architecture details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Teammate Vibe Station Subsection (developer_vibes table) */}
            <div className="vibe-form-box">
              <div className="vibe-form-title">
                <Flame size={16} /> Teammate Vibe &amp; Snack Station
                <small style={{ marginLeft: 'auto', color: '#94a3b8', textTransform: 'none', fontWeight: 400 }}>
                  (<code>developer_vibes</code> table)
                </small>
              </div>

              <div className="vibe-grid-2">
                <div className="form-group">
                  <label htmlFor="vibe-coder">Coder / Teammate</label>
                  <input
                    id="vibe-coder"
                    type="text"
                    className="form-input"
                    value={coderName}
                    onChange={(e) => setCoderName(e.target.value)}
                    placeholder="e.g. Joseph Sackitey"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="vibe-status">Current Vibe</label>
                  <select
                    id="vibe-status"
                    className="form-select"
                    value={vibeStatus}
                    onChange={(e) => setVibeStatus(e.target.value)}
                  >
                    <option value="🚀 Hype Train">🚀 Hype Train</option>
                    <option value="☕ Pure Caffeine">☕ Pure Caffeine</option>
                    <option value="🍕 Pizza Mode">🍕 Pizza Mode</option>
                    <option value="🧠 Galaxy Brain">🧠 Galaxy Brain</option>
                    <option value="💀 3 AM Panic">💀 3 AM Panic</option>
                    <option value="✨ Cloud Wizard">✨ Cloud Wizard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="vibe-snack">
                  <span>Snack Fuel</span>
                  <Utensils size={14} style={{ color: '#fbbf24' }} />
                </label>
                <input
                  id="vibe-snack"
                  type="text"
                  className="form-input"
                  value={snackFuel}
                  onChange={(e) => setSnackFuel(e.target.value)}
                  placeholder="e.g. Monster & Flamin' Hot Cheetos"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vibe-quote">
                  <span>Hype Battle Cry / Quote</span>
                  <MessageSquareQuote size={14} style={{ color: '#818cf8' }} />
                </label>
                <input
                  id="vibe-quote"
                  type="text"
                  className="form-input"
                  value={hypeQuote}
                  onChange={(e) => setHypeQuote(e.target.value)}
                  placeholder="e.g. It worked on my machine, ship it!"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Saving Dual Records...
                  </>
                ) : (
                  <>
                    <Rocket size={16} /> Launch &amp; Boost Team Vibe!
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={handleFillSample}
              >
                <Sparkles size={14} /> 🎲 Random Vibe &amp; Snack Preset
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Live Records & Vibe Wall Card */}
        <section className="card records-container">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon">
                <Database size={20} />
              </div>
              <div>
                <h2 className="card-title">Live Database Records</h2>
                <span className="card-subtitle">Real-time sync from MySQL tables</span>
              </div>
            </div>

            <div className="tab-group">
              <button
                className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`}
                onClick={() => setActiveTab('items')}
              >
                📦 Items ({items.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'vibes' ? 'active' : ''}`}
                onClick={() => setActiveTab('vibes')}
              >
                ⚡ Vibe Wall ({vibes.length})
              </button>
            </div>
          </div>

          <div className="records-meta-bar">
            <span className="count-badge">
              {activeTab === 'items'
                ? `${items.length} ${items.length === 1 ? 'Item' : 'Items'} in MySQL`
                : `${vibes.length} ${vibes.length === 1 ? 'Vibe' : 'Vibes'} in MySQL`}
            </span>
            <button
              className="btn-secondary"
              onClick={() => {
                fetchItems();
                fetchVibes();
                fetchDbInfo();
                fetchHealth();
              }}
              title="Refresh Records"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {/* Tab 1: Main Items Table */}
          {activeTab === 'items' && (
            loading && items.length === 0 ? (
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
                      <th>Chaos Level</th>
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
                        <td>
                          <span className={`chaos-badge ${getChaosClass(item.chaos_rating)}`}>
                            {item.chaos_rating || 'Mild 🌶️'}
                          </span>
                        </td>
                        <td style={{ color: '#cbd5e1', maxWidth: '240px' }}>
                          {item.description || <span style={{ color: '#64748b' }}>—</span>}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {item.created_at ? new Date(item.created_at).toLocaleTimeString() : 'Just now'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Tab 2: Developer Vibe Wall */}
          {activeTab === 'vibes' && (
            vibes.length === 0 ? (
              <div className="empty-state">
                <Coffee size={40} className="empty-icon" />
                <p>No developer vibes logged yet.</p>
                <span className="card-subtitle">Submit the form to log your first hype entry!</span>
              </div>
            ) : (
              <div className="vibe-card-grid">
                {vibes.map((v) => (
                  <div key={v.id} className="vibe-card">
                    <div className="vibe-card-header">
                      <div className="vibe-coder-info">
                        <span className="vibe-coder-name">{v.coder_name}</span>
                      </div>
                      <span className="vibe-status-tag">{v.vibe_status}</span>
                    </div>

                    <div className="snack-tag">
                      <Utensils size={12} />
                      <span>{v.snack_fuel || 'Coffee & Code'}</span>
                    </div>

                    {v.hype_quote && (
                      <div className="vibe-quote">
                        "{v.hype_quote}"
                      </div>
                    )}

                    <div className="vibe-item-ref">
                      <span>🔗 Task: <strong>{v.item_title || `#${v.item_id || 'N/A'}`}</strong></span>
                      <small>{v.logged_at ? new Date(v.logged_at).toLocaleTimeString() : 'Just now'}</small>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      </main>

      {/* Schema Inspector Section */}
      <section className="collapsible-card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon">
              <GitBranch size={20} />
            </div>
            <div>
              <h2 className="card-title">Live Schema &amp; Migration Inspector</h2>
              <span className="card-subtitle">
                Inspect database tables and columns dynamically as migrations are applied
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
                  <span
                    key={tbl}
                    className="schema-pill"
                    style={tbl === 'developer_vibes' ? { borderColor: '#c084fc', color: '#e9d5ff' } : {}}
                  >
                    📁 {tbl} {tbl === 'developer_vibes' ? '✨ [New]' : ''}
                  </span>
                ))
              ) : (
                <>
                  <span className="schema-pill">📁 items</span>
                  <span className="schema-pill" style={{ borderColor: '#c084fc', color: '#e9d5ff' }}>📁 developer_vibes ✨ [New]</span>
                </>
              )}
            </div>
          </div>

          <div className="schema-box">
            <div className="schema-box-title">Columns in `items` Table</div>
            <div className="schema-pill-list">
              {dbInfo?.itemsColumns && dbInfo.itemsColumns.length > 0 ? (
                dbInfo.itemsColumns.map((col) => (
                  <span
                    key={col.field}
                    className="schema-pill"
                    style={col.field === 'chaos_rating' ? { borderColor: '#f97316', color: '#fed7aa' } : {}}
                  >
                    {col.field} <small style={{ color: '#94a3b8' }}>({col.type})</small>
                    {col.field === 'chaos_rating' ? ' ✨ [New]' : ''}
                  </span>
                ))
              ) : (
                <>
                  <span className="schema-pill">id</span>
                  <span className="schema-pill">title</span>
                  <span className="schema-pill">category</span>
                  <span className="schema-pill" style={{ borderColor: '#f97316', color: '#fed7aa' }}>chaos_rating ✨ [New]</span>
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
                <>
                  <span className="schema-pill">✅ 001_initial_schema.sql</span>
                  <span className="schema-pill">✅ 002_create_developer_vibes_table.sql</span>
                  <span className="schema-pill">✅ 003_add_chaos_rating_to_items.sql</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
