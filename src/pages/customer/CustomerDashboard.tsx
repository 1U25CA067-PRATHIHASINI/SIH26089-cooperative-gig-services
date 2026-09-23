import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import {
  Zap, Wrench, Hammer, Paintbrush, Sparkles, Heart, Car, Flower2, Settings as SettingsIcon,
  MapPin, Search, ArrowRight, CalendarCheck, Star, TrendingUp
} from 'lucide-react';
import { ServiceCategory } from '../../types';

const serviceIcons: Record<string, typeof Zap> = {
  Electrician: Zap, Plumber: Wrench, Carpenter: Hammer, Painter: Paintbrush,
  Cleaner: Sparkles, Caregiver: Heart, Driver: Car, Gardener: Flower2, Technician: SettingsIcon,
};

const categories: ServiceCategory[] = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner', 'Caregiver', 'Driver', 'Gardener', 'Technician',
];

const LOCATIONS = [
  'RS Puram, Coimbatore', 'Gandhipuram, Coimbatore', 'Saibaba Colony, Coimbatore',
  'Peelamedu, Coimbatore', 'Race Course, Coimbatore', 'Singanallur, Coimbatore',
];

export default function CustomerDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ServiceCategory | null>(null);
  const [location, setLocation] = useState('');
  const [showLocations, setShowLocations] = useState(false);

  const upcomingCount = state.bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;
  const completedCount = state.bookings.filter((b) => b.status === 'completed').length;

  function handleFind() {
    if (!selected) return;
    const loc = location || 'Coimbatore';
    navigate(`/services?trade=${selected}&location=${encodeURIComponent(loc)}`);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Find a skilled professional near you</h1>
        <p>Book verified workers from trusted labour cooperatives</p>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-label">Upcoming Bookings</div>
          <div className="stat-value">{upcomingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed Services</div>
          <div className="stat-value">{completedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available Workers</div>
          <div className="stat-value">{state.workers.filter((w) => w.availableToday).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Rating</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={18} fill="#d97706" color="#d97706" /> 4.6
          </div>
        </div>
      </div>

      {/* Service picker */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">What service do you need?</div>
        </div>
        <div className="service-grid">
          {categories.map((cat) => {
            const Icon = serviceIcons[cat];
            return (
              <button
                key={cat}
                className={`service-btn ${selected === cat ? 'selected' : ''}`}
                onClick={() => setSelected(cat)}
              >
                <div className="service-icon"><Icon size={20} /></div>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location + Find */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Your location</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-2)', borderRadius: 'var(--radius)', padding: '9px 12px' }}>
              <MapPin size={16} color="var(--text-muted)" />
              <input
                className="form-input"
                style={{ border: 'none', padding: 0 }}
                placeholder="Enter locality or area"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setShowLocations(true); }}
                onFocus={() => setShowLocations(true)}
                onBlur={() => setTimeout(() => setShowLocations(false), 150)}
              />
            </div>
            {showLocations && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', zIndex: 10, maxHeight: 200, overflowY: 'auto',
              }}>
                {LOCATIONS.filter((l) => l.toLowerCase().includes(location.toLowerCase())).map((l) => (
                  <div key={l}
                    style={{ padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}
                    onMouseDown={() => { setLocation(l); setShowLocations(false); }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = '')}
                  >
                    <MapPin size={13} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} />
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-lg" disabled={!selected} onClick={handleFind}>
            <Search size={16} /> Find Workers
          </button>
        </div>
      </div>

      {/* Recent bookings */}
      {state.bookings.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="row-between" style={{ marginBottom: 12 }}>
            <div className="section-title">Recent Bookings</div>
            <button className="btn btn-sm btn-outline" onClick={() => navigate('/bookings')}>View All <ArrowRight size={13} /></button>
          </div>
          {state.bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="booking-card">
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.service}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {b.workerName} · {b.date} · {b.time}
                  </div>
                </div>
                <span className={`badge-status badge-${b.status}`}>{b.status.replace('-', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
