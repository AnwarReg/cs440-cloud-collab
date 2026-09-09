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
  Utensils,
  MapPin,
  FileText
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
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [extractedText, setExtractedText] = useState('');

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
          location: location.trim(),
          description: description.trim(),
          extractedText: extractedText.trim(),
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

      const itemId = result.data?.item?.id || result.data?.id || 'New';
      showToast(`🚀 Item #${itemId} & Vibe Log saved to MySQL!`, 'success');
      setTitle('');
      setDescription('');
      setLocation('');
      setExtractedText('');
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
        loc: 'AWS us-east-1 / Gettysburg Lab',
        desc: 'Added developer_vibes, document_text, chaos_rating, and location support with automated rollback.',
        text: 'MIGRATION LOG: 001_initial_schema.sql -> 002_create_document_text_table.sql -> 003_add_location_column_to_items.sql -> 004_create_developer_vibes_table.sql -> 005_add_chaos_rating_to_items.sql applied seamlessly.',
        coder: 'Joseph Sackitey',
        vibe: '🚀 Hype Train',
        snack: '🧋 Boba Milk Tea & Pocky',
        quote: 'Migrations ran in 42ms. Pure magic!'
      },
      {
        title: 'Document Digitization & OCR Pipeline',
        category: 'Backend',
        chaos: 'Mild 🌶️',
        loc: 'State Archives, Box 12',
        desc: 'Extracting historical manuscripts and storing fulltext indexes in document_text table.',
        text: 'Transcribed excerpt: "Collaborative cloud systems enable rapid parallel engineering with automated migrations and microservice telemetry."',
        coder: 'Heidi & Joseph',
        vibe: '✨ Cloud Wizard',
        snack: '☕ Cold Brew & Croissants',
        quote: 'Full-text indexing with MySQL FULLTEXT search enabled!'
      },
      {
        title: 'Auto-Scaling Express Backend on Railway',
        category: 'DevOps',
        chaos: 'Absolute Mayhem 💥',
        loc: 'Production Cluster node-alpha',
        desc: 'Provisioned container replicas under high query concurrency.',
        text: 'DOCKER CONTAINER TELEMETRY: Container healthy, listening on 0.0.0.0:5001, pool connections: active.',
        coder: 'Captain Cloud',
        vibe: '☕ Pure Caffeine',
        snack: '⚡ Monster Energy & Doritos',
        quote: 'Zero 502 Bad Gateways on my watch!'
      },
      {
        title: 'Modern Glassmorphic React Dashboard',
        category: 'Frontend',
        chaos: 'Zen 🧘',
        loc: 'Client Browser WebApp',
        desc: 'Crafted responsive tabs, lively badges, schema inspector, and multi-table support.',
        text: 'UI SPECS: Accessible semantic markup, real-time database heartbeat, and fluid tab animations.',
        coder: 'Joseph Sackitey',
        vibe: '✨ Cloud Wizard',
        snack: '🍕 Cold Pizza & Cold Brew',
        quote: 'Clean CSS and zero layout shifts.'
      }
    ];

    const picked = samples[Math.floor(Math.random() * samples.length)];
    setTitle(picked.title);
    setCategory(picked.category);
    setChaosRating(picked.chaos);
    setLocation(picked.loc);
    setDescription(picked.desc);
    setExtractedText(picked.text);
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
              Full-Stack Application with React, Node/Express, MySQL, Automated Migrations, Multi-Table Schemas &amp; Developer Hype Station.
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
            <span>Tables in DB: <strong>{dbInfo?.tables?.length ?? '4'}</strong></span>
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
                <h2 className="card-title">Insert Record &amp; Log Vibe</h2>
                <span className="card-subtitle">
                  Saves to <code>items</code>, <code>document_text</code> &amp; <code>developer_vibes</code>
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
                  <small style={{ color: '#c084fc' }}>+Col 005</small>
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
              <label htmlFor="item-location">
                <span>Location</span>
                <small style={{ color: '#38bdf8' }}>+Col 003</small>
              </label>
              <input
                id="item-location"
                type="text"
                className="form-input"
                placeholder="e.g. State Archives, Box 12 / AWS us-east-1"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
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

            <div className="form-group">
              <label htmlFor="item-text">
                <span>Transcribed / Extracted Text</span>
                <small style={{ color: '#34d399' }}>+Table <code>document_text</code></small>
              </label>
              <textarea
                id="item-text"
                className="form-textarea"
                placeholder="Paste or type document text content or OCR extract..."
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
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
                    <RefreshCw size={16} className="animate-spin" /> Saving Multi-Table Records...
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
                <Sparkles size={14} /> 🎲 Random Multi-Feature Preset
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
                      <th>Location</th>
                      <th>Chaos Level</th>
                      <th>Description / Text</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>#{item.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.title}</div>
                          {item.extracted_text && (
                            <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <FileText size={12} /> {item.extracted_text.slice(0, 45)}
                              {item.extracted_text.length > 45 ? '...' : ''}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="tag-badge">{item.category || 'General'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.82rem', color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} /> {item.location || 'Unknown'}
                          </span>
                        </td>
                        <td>
                          <span className={`chaos-badge ${getChaosClass(item.chaos_rating)}`}>
                            {item.chaos_rating || 'Mild 🌶️'}
                          </span>
                        </td>
                        <td style={{ color: '#cbd5e1', maxWidth: '220px', fontSize: '0.85rem' }}>
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
                    style={
                      tbl === 'developer_vibes'
                        ? { borderColor: '#c084fc', color: '#e9d5ff' }
                        : tbl === 'document_text'
                        ? { borderColor: '#34d399', color: '#a7f3d0' }
                        : {}
                    }
                  >
                    📁 {tbl} {tbl === 'developer_vibes' || tbl === 'document_text' ? '✨ [New]' : ''}
                  </span>
                ))
              ) : (
                <>
                  <span className="schema-pill">📁 items</span>
                  <span className="schema-pill" style={{ borderColor: '#34d399', color: '#a7f3d0' }}>📁 document_text ✨ [New]</span>
                  <span className="schema-pill" style={{ borderColor: '#c084fc', color: '#e9d5ff' }}>📁 developer_vibes ✨ [New]</span>
                  <span className="schema-pill">📁 _migrations</span>
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
                    style={
                      col.field === 'chaos_rating'
                        ? { borderColor: '#f97316', color: '#fed7aa' }
                        : col.field === 'location'
                        ? { borderColor: '#38bdf8', color: '#bae6fd' }
                        : {}
                    }
                  >
                    {col.field} <small style={{ color: '#94a3b8' }}>({col.type})</small>
                    {col.field === 'chaos_rating' || col.field === 'location' ? ' ✨ [New]' : ''}
                  </span>
                ))
              ) : (
                <>
                  <span className="schema-pill">id</span>
                  <span className="schema-pill">title</span>
                  <span className="schema-pill">category</span>
                  <span className="schema-pill" style={{ borderColor: '#38bdf8', color: '#bae6fd' }}>location ✨ [New]</span>
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
                  <span className="schema-pill">✅ 002_create_document_text_table.sql</span>
                  <span className="schema-pill">✅ 003_add_location_column_to_items.sql</span>
                  <span className="schema-pill">✅ 004_create_developer_vibes_table.sql</span>
                  <span className="schema-pill">✅ 005_add_chaos_rating_to_items.sql</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
