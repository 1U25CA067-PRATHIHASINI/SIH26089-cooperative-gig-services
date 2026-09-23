import { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';
import { Star, MapPin, Clock, FileText, CreditCard } from 'lucide-react';

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function CustomerBookings() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [payModal, setPayModal] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const bookings = state.bookings.filter((b) => {
    if (tab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress';
    if (tab === 'completed') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  function handleRate(bId: string) {
    dispatch({ type: 'UPDATE_BOOKING', payload: { id: bId, updates: { rating, review } } });
    toast('Rating submitted. Thank you!', 'success');
    setRatingModal(null);
    setRating(5);
    setReview('');
  }

  function handlePay(bId: string) {
    dispatch({ type: 'UPDATE_BOOKING', payload: { id: bId, updates: { paymentStatus: 'completed' } } });
    toast('Payment recorded (simulated)', 'success');
    setPayModal(null);
  }

  function handleCancel(bId: string) {
    dispatch({ type: 'UPDATE_BOOKING', payload: { id: bId, updates: { status: 'cancelled' } } });
    toast('Booking cancelled', 'info');
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your service bookings</p>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20, display: 'inline-flex' }}>
        {(['upcoming', 'completed', 'cancelled'] as Tab[]).map((t) => (
          <div key={t} className={`filter-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state card"><p>No {tab} bookings.</p></div>
      ) : (
        <div className="stack">
          {bookings.map((b) => (
            <div key={b.id} className="card">
              <div className="row-between" style={{ marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{b.service}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Booking #{b.id}
                  </div>
                </div>
                <span className={`badge-status badge-${b.status}`}>{b.status.replace('-', ' ')}</span>
              </div>
              <div className="grid-2" style={{ fontSize: 13 }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Worker:</span> {b.workerName}</div>
                <div><MapPin size={13} style={{ verticalAlign: 'text-bottom' }} /> {b.location}</div>
                <div><Clock size={13} style={{ verticalAlign: 'text-bottom' }} /> {b.date} · {b.time}</div>
                <div><CreditCard size={13} style={{ verticalAlign: 'text-bottom' }} /> ₹{b.amount} · <span className={`badge-status badge-${b.paymentStatus === 'completed' ? 'completed' : 'pending'}`} style={{ fontSize: 10 }}>{b.paymentStatus}</span></div>
              </div>
              {b.notes && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}><FileText size={12} style={{ verticalAlign: 'text-bottom' }} /> {b.notes}</div>}
              {b.rating && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  <span className="rating"><Star size={13} fill="#d97706" /> {b.rating}</span>
                  {b.review && <span style={{ marginLeft: 8, color: 'var(--text-secondary)' }}>"{b.review}"</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {b.status === 'completed' && !b.rating && (
                  <button className="btn btn-sm btn-primary" onClick={() => setRatingModal(b.id)}>Rate Service</button>
                )}
                {b.status === 'completed' && b.paymentStatus !== 'completed' && (
                  <button className="btn btn-sm btn-success" onClick={() => setPayModal(b.id)}>Complete Payment</button>
                )}
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleCancel(b.id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <Modal open={!!ratingModal} onClose={() => setRatingModal(null)} title="Rate Service">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`star ${s <= rating ? 'filled' : ''}`} onClick={() => setRating(s)}>★</span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{rating} / 5</div>
        </div>
        <div className="form-group">
          <label className="form-label">Review (optional)</label>
          <textarea className="form-textarea" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Arrived on time and resolved issue." />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setRatingModal(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => ratingModal && handleRate(ratingModal)}>Submit Rating</button>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Complete Payment">
        {payModal && (() => {
          const b = state.bookings.find((x) => x.id === payModal);
          if (!b) return null;
          return (
            <div>
              <div className="info-row"><div className="info-key">Service</div><div className="info-val">{b.service}</div></div>
              <div className="info-row"><div className="info-key">Service Amount</div><div className="info-val">₹{b.amount}</div></div>
              <div className="info-row"><div className="info-key">Platform Fee</div><div className="info-val">₹0</div></div>
              <div className="info-row"><div className="info-key">Worker Payout</div><div className="info-val" style={{ fontWeight: 700 }}>₹{b.amount}</div></div>
              <div className="info-row"><div className="info-key">Status</div><div className="info-val"><span className="badge-status badge-pending">Simulated</span></div></div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPayModal(null)}>Cancel</button>
                <button className="btn btn-success" onClick={() => handlePay(payModal)}>Complete Demo Payment</button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
