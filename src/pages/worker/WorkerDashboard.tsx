import { useApp } from '../../store/AppContext';
import { useToast } from '../../components/Toast';
import { CalendarCheck, Wallet, Star, Clock, MapPin, FileText, CheckCircle, XCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'var(--amber)',
  confirmed: 'var(--accent-2)',
  'in-progress': 'var(--amber)',
  completed: 'var(--green)',
  cancelled: 'var(--red)',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function WorkerDashboard() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();

  const worker = state.workers.find((w) => w.id === 'w1'); // Demo worker
  if (!worker) return null;

  const todayJobs = state.bookings.filter((b) => b.workerId === worker.id && b.date === new Date().toISOString().split('T')[0]);
  const upcomingJobs = state.bookings.filter((b) => b.workerId === worker.id && b.status !== 'completed' && b.status !== 'cancelled');
  const earnings = state.bookings.filter((b) => b.workerId === worker.id && b.status === 'completed').reduce((sum, b) => sum + b.amount, 0);

  function handleStatusChange(bId: string, newStatus: string) {
    dispatch({ type: 'UPDATE_BOOKING', payload: { id: bId, updates: { status: newStatus } } });
    toast(`Booking marked as ${statusLabels[newStatus]}`, 'success');
  }

  return (
    <div>
      <div className="page-header">
        <h1>Good morning, {worker.name}</h1>
        <p>Manage your jobs and earnings</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-label">Today's Jobs</div>
          <div className="stat-value">{todayJobs.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Upcoming</div>
          <div className="stat-value">{upcomingJobs.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Month's Earnings</div>
          <div className="stat-value">₹{earnings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rating</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={18} fill="#d97706" color="#d97706" /> {worker.rating}
          </div>
        </div>
      </div>

      {/* Today's Jobs */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">Today's Jobs</div>
        </div>
        {todayJobs.length === 0 ? (
          <div className="empty-state">
            <CalendarCheck size={28} />
            <p>No jobs scheduled for today.</p>
          </div>
        ) : (
          <div className="stack">
            {todayJobs.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="row-between">
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.time}</div>
                  <span className={`badge-status badge-${b.status}`} style={{ background: statusColors[b.status], color: '#fff' }}>{statusLabels[b.status]}</span>
                </div>
                <div style={{ fontSize: 13, margin: '6px 0' }}>{b.service}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {b.notes || 'No special instructions'}
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span><MapPin size={12} style={{ verticalAlign: 'text-bottom' }} /> {b.location}</span>
                  <span><Wallet size={12} style={{ verticalAlign: 'text-bottom' }} /> ₹{b.amount}</span>
                  <span>Customer: {b.customerName}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {b.status === 'confirmed' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(b.id, 'in-progress')}>Mark In Progress</button>
                  )}
                  {b.status === 'in-progress' && (
                    <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(b.id, 'completed')}>Mark Completed</button>
                  )}
                  {b.status === 'pending' && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(b.id, 'confirmed')}>Accept</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Jobs */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Upcoming Jobs</div>
        </div>
        {upcomingJobs.length === 0 ? (
          <div className="empty-state">
            <CalendarCheck size={28} />
            <p>No upcoming jobs.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Location</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingJobs.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.service}</td>
                    <td>{b.location}</td>
                    <td>{b.customerName}</td>
                    <td>₹{b.amount}</td>
                    <td><span className={`badge-status badge-${b.status}`}>{statusLabels[b.status]}</span></td>
                    <td>
                      {b.status === 'confirmed' && (
                        <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(b.id, 'in-progress')}>Start</button>
                      )}
                      {b.status === 'in-progress' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(b.id, 'completed')}>Complete</button>
                      )}
                      {b.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(b.id, 'confirmed')}><CheckCircle size={14} /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleStatusChange(b.id, 'cancelled')}><XCircle size={14} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
