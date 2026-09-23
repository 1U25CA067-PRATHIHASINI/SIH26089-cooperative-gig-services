import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import {
  Users, CheckCircle, XCircle, Search, Filter, Shield, FileText, CalendarCheck,
  Wallet, BarChart3, TrendingUp, MapPin, Star, Check, X
} from 'lucide-react';
import { VerificationStatus, ServiceCategory } from '../../types';

const statusColors: Record<VerificationStatus, string> = {
  verified: 'var(--green)',
  pending: 'var(--amber)',
  rejected: 'var(--red)',
};

const statusLabels: Record<VerificationStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  rejected: 'Rejected',
};

export default function CooperativeDashboard() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState<ServiceCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [viewModal, setViewModal] = useState<string | null>(null);

  const activeWorkers = state.workers.filter((w) => w.verification === 'verified').length;
  const todayBookings = state.bookings.filter((b) => b.date === new Date().toISOString().split('T')[0]).length;
  const pendingVerification = state.workers.filter((w) => w.verification === 'pending').length;
  const openRequests = state.bookings.filter((b) => b.status === 'pending').length;

  const filteredWorkers = state.workers.filter((w) => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tradeFilter !== 'all' && w.trade !== tradeFilter) return false;
    if (statusFilter !== 'all' && w.verification !== statusFilter) return false;
    return true;
  });

  function handleVerify(wId: string, status: VerificationStatus) {
    dispatch({ type: 'UPDATE_WORKER', payload: { id: wId, updates: { verification: status } } });
    toast(`Worker ${statusLabels[status]}`, 'success');
    setViewModal(null);
  }

  const tradeCounts = state.bookings.reduce((acc, b) => {
    acc[b.service] = (acc[b.service] || 0) + 1;
    return acc;
  }, {} as Record<ServiceCategory, number>);

  const locationCounts = state.bookings.reduce((acc, b) => {
    const loc = b.location.split(',')[0];
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const worker = viewModal ? state.workers.find((w) => w.id === viewModal) : null;

  return (
    <div>
      <div className="page-header">
        <h1>Cooperative Operations</h1>
        <p>Manage workers, bookings, and service demand</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-label">Active Workers</div>
          <div className="stat-value">{activeWorkers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today's Bookings</div>
          <div className="stat-value">{todayBookings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Verification</div>
          <div className="stat-value">{pendingVerification}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open Requests</div>
          <div className="stat-value">{openRequests}</div>
        </div>
      </div>

      {/* Worker Management */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Worker Management</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="header-search" style={{ width: 200 }}>
              <Search size={15} color="var(--text-muted)" />
              <input placeholder="Search workers..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="form-select" value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value as ServiceCategory | 'all')} style={{ width: 160 }}>
              <option value="all">All Trades</option>
              <option value="Electrician">Electrician</option>
              <option value="Plumber">Plumber</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Painter">Painter</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Driver">Driver</option>
              <option value="Gardener">Gardener</option>
              <option value="Technician">Technician</option>
            </select>
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as VerificationStatus | 'all')} style={{ width: 140 }}>
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Worker</th>
                <th>Trade</th>
                <th>Verification</th>
                <th>Availability</th>
                <th>Rating</th>
                <th>Jobs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w) => (
                <tr key={w.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar" style={{ background: w.verification === 'verified' ? 'var(--accent)' : 'var(--amber)' }}>{w.avatar}</div>
                    {w.name}
                  </td>
                  <td>{w.trade}</td>
                  <td><span className={`badge-status badge-${w.verification}`}>{statusLabels[w.verification]}</span></td>
                  <td>{w.availableToday ? 'Today' : w.availability}</td>
                  <td><span className="rating"><Star size={12} fill="#d97706" /> {w.rating}</span></td>
                  <td>{w.completedJobs}</td>
                  <td>{w.availableToday ? 'Available' : 'Unavailable'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => setViewModal(w.id)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand Analytics */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Service Demand</div>
        </div>
        <div className="grid-2">
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>By Trade</div>
            {Object.entries(tradeCounts).map(([trade, count]) => (
              <div key={trade} className="demand-bar-wrap">
                <div className="demand-label">{trade}</div>
                <div className="demand-bar-bg">
                  <div className="demand-bar-fill" style={{ width: `${(count / Math.max(...Object.values(tradeCounts))) * 100}%` }} />
                </div>
                <div className="demand-value">{count}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>By Location</div>
            {Object.entries(locationCounts).map(([loc, count]) => (
              <div key={loc} className="demand-bar-wrap">
                <div className="demand-label">{loc}</div>
                <div className="demand-bar-bg">
                  <div className="demand-bar-fill" style={{ width: `${(count / Math.max(...Object.values(locationCounts))) * 100}%` }} />
                </div>
                <div className="demand-value">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Forecast */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
            AI Demand Forecast
          </div>
        </div>
        <div style={{ fontSize: 13, marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>Plumbing demand is expected to increase in Zone B tomorrow.</div>
          <div style={{ marginBottom: 8 }}>Confidence: <strong>78%</strong></div>
          <div>Recommended action: <strong>Make 3 additional plumbers available in Zone B.</strong></div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Prototype Forecast</div>
      </div>

      {/* Worker Modal */}
      {worker && (
        <Modal open={!!viewModal} onClose={() => setViewModal(null)} title="Worker Details">
          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <div className="avatar xl" style={{ background: worker.verification === 'verified' ? 'var(--accent)' : 'var(--amber)' }}>{worker.avatar}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{worker.name}</h2>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>{worker.trade}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <span className="rating"><Star size={14} fill="#d97706" /> {worker.rating} ({worker.completedJobs} jobs)</span>
                <span style={{ color: 'var(--text-secondary)' }}><MapPin size={14} style={{ verticalAlign: 'text-bottom' }} /> {worker.distance} km away</span>
              </div>
            </div>
          </div>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div>
              <div className="info-row"><div className="info-key">Cooperative</div><div className="info-val">{worker.cooperative}</div></div>
              <div className="info-row"><div className="info-key">Experience</div><div className="info-val">{worker.experience}</div></div>
              <div className="info-row"><div className="info-key">Service Area</div><div className="info-val">{worker.serviceArea}</div></div>
              <div className="info-row"><div className="info-key">Price Range</div><div className="info-val">₹{worker.priceRange[0]} – ₹{worker.priceRange[1]}</div></div>
            </div>
            <div>
              <div className="info-row"><div className="info-key">Verification</div><div className="info-val"><span className={`badge-status badge-${worker.verification}`}>{statusLabels[worker.verification]}</span></div></div>
              <div className="info-row"><div className="info-key">Availability</div><div className="info-val">{worker.availability}</div></div>
              <div className="info-row"><div className="info-key">Status</div><div className="info-val">{worker.availableToday ? 'Available' : 'Unavailable'}</div></div>
            </div>
          </div>
          <div className="card-title" style={{ marginBottom: 12 }}>Documents</div>
          <div className="info-row"><div className="info-key">Identity</div><div className="info-val" style={{ color: 'var(--green)' }}><CheckCircle size={14} /> Verified</div></div>
          <div className="info-row"><div className="info-key">Skill Certificate</div><div className="info-val" style={{ color: worker.documents.skillCertificate ? 'var(--green)' : 'var(--amber)' }}>{worker.documents.skillCertificate ? <><CheckCircle size={14} /> Verified</> : 'Pending'}</div></div>
          <div className="info-row"><div className="info-key">Co-op Membership</div><div className="info-val" style={{ color: 'var(--green)' }}><CheckCircle size={14} /> Verified</div></div>
          {worker.verification === 'pending' && (
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewModal(null)}>Cancel</button>
              <button className="btn btn-success" onClick={() => handleVerify(worker.id, 'verified')}><Check size={14} /> Approve</button>
              <button className="btn btn-danger" onClick={() => handleVerify(worker.id, 'rejected')}><X size={14} /> Reject</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
