import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { MapPin, Star, CheckCircle, ArrowLeft, Clock, Filter } from 'lucide-react';
import { ServiceCategory } from '../../types';
import WorkerProfile from './WorkerProfile';
import BookingFlow from './BookingFlow';

export default function ServiceSearch() {
  const { state } = useApp();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const trade = (params.get('trade') || 'Plumber') as ServiceCategory;
  const location = params.get('location') || 'Coimbatore';

  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [bookingWorkerId, setBookingWorkerId] = useState<string | null>(null);

  const results = useMemo(() => {
    return state.workers.filter((w) => w.trade === trade);
  }, [state.workers, trade]);

  const selectedWorker = selectedWorkerId ? state.workers.find((w) => w.id === selectedWorkerId) : null;
  const bookingWorker = bookingWorkerId ? state.workers.find((w) => w.id === bookingWorkerId) : null;

  if (bookingWorker) {
    return <BookingFlow worker={bookingWorker} trade={trade} location={location} onBack={() => setBookingWorkerId(null)} />;
  }

  if (selectedWorker) {
    return (
      <WorkerProfile
        worker={selectedWorker}
        onBack={() => setSelectedWorkerId(null)}
        onBook={() => { setSelectedWorkerId(null); setBookingWorkerId(selectedWorker.id); }}
      />
    );
  }

  return (
    <div>
      <button className="btn btn-sm btn-outline" onClick={() => navigate('/')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="page-header">
        <h1>{trade} near {location}</h1>
        <p>{results.length} verified workers found</p>
      </div>

      <div className="stack">
        {results.length === 0 ? (
          <div className="empty-state card">
            <Filter size={28} />
            <p>No workers found for {trade} in this area.</p>
          </div>
        ) : (
          results.map((w) => (
            <div key={w.id} className="worker-card" onClick={() => setSelectedWorkerId(w.id)}>
              <div className="avatar lg" style={{ background: w.verification === 'verified' ? 'var(--accent)' : 'var(--amber)' }}>{w.avatar}</div>
              <div className="worker-card-body">
                <div className="row-between">
                  <div className="worker-card-name">{w.name}</div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{w.priceRange[0]}–₹{w.priceRange[1]}
                  </span>
                </div>
                <div className="worker-card-meta">
                  <span>{w.trade}</span>
                  <span className="dot" />
                  {w.verification === 'verified' && (
                    <span className="verified-badge"><CheckCircle size={12} /> Cooperative Verified</span>
                  )}
                  <span className="dot" />
                  <span className="rating"><Star size={12} fill="#d97706" /> {w.rating}</span>
                  <span className="dot" />
                  <span><MapPin size={12} style={{ verticalAlign: 'text-bottom' }} /> {w.distance} km</span>
                  <span className="dot" />
                  <span><Clock size={12} style={{ verticalAlign: 'text-bottom' }} /> {w.availableToday ? 'Available today' : w.availability}</span>
                </div>
                <div className="worker-card-skills">
                  {w.skills.slice(0, 4).map((s) => <span key={s} className="skill-tag">{s}</span>)}
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setBookingWorkerId(w.id); }}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
