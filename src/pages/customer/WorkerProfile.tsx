import { Worker } from '../../types';
import { ArrowLeft, Star, CheckCircle, MapPin, Clock, Shield, Briefcase } from 'lucide-react';

interface Props {
  worker: Worker;
  onBack: () => void;
  onBook: () => void;
}

export default function WorkerProfile({ worker, onBack, onBook }: Props) {
  return (
    <div>
      <button className="btn btn-sm btn-outline" onClick={onBack} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to results
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div className="avatar xl" style={{ background: 'var(--accent)' }}>{worker.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{worker.name}</h1>
              {worker.verification === 'verified' && (
                <span className="badge-status badge-verified"><CheckCircle size={12} /> Verified</span>
              )}
              {worker.verification === 'pending' && (
                <span className="badge-status badge-pending">Pending</span>
              )}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10 }}>{worker.trade}</div>
            <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
              <span className="rating"><Star size={14} fill="#d97706" /> {worker.rating} ({worker.completedJobs} jobs)</span>
              <span style={{ color: 'var(--text-secondary)' }}><MapPin size={14} style={{ verticalAlign: 'text-bottom' }} /> {worker.distance} km away</span>
              <span style={{ color: 'var(--text-secondary)' }}><Briefcase size={14} style={{ verticalAlign: 'text-bottom' }} /> {worker.experience}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14 }}>Details</div>
          <div className="info-row"><div className="info-key">Cooperative</div><div className="info-val">{worker.cooperative}</div></div>
          <div className="info-row"><div className="info-key">Experience</div><div className="info-val">{worker.experience}</div></div>
          <div className="info-row"><div className="info-key">Completed Jobs</div><div className="info-val">{worker.completedJobs}</div></div>
          <div className="info-row"><div className="info-key">Service Area</div><div className="info-val">{worker.serviceArea}</div></div>
          <div className="info-row"><div className="info-key">Price Range</div><div className="info-val">₹{worker.priceRange[0]} – ₹{worker.priceRange[1]}</div></div>
        </div>
        <div className="stack">
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>
              <Shield size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
              Verification
            </div>
            <div style={{ fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}>
                Verified by: <strong>{worker.cooperative}</strong>
              </div>
              <div className="info-row"><div className="info-key">Identity</div><div className="info-val" style={{ color: 'var(--green)' }}><CheckCircle size={14} /> Verified</div></div>
              <div className="info-row"><div className="info-key">Skill Certificate</div><div className="info-val" style={{ color: worker.documents.skillCertificate ? 'var(--green)' : 'var(--amber)' }}>{worker.documents.skillCertificate ? <><CheckCircle size={14} /> Verified</> : 'Pending'}</div></div>
              <div className="info-row"><div className="info-key">Co-op Membership</div><div className="info-val" style={{ color: 'var(--green)' }}><CheckCircle size={14} /> Verified</div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>
              <Clock size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
              Availability
            </div>
            <div style={{ fontSize: 13 }}>
              <div className="info-row"><div className="info-key">Today</div><div className="info-val">{worker.availability}</div></div>
              <div className="info-row"><div className="info-key">Status</div><div className="info-val">{worker.availableToday ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>Available</span> : <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Not available today</span>}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title" style={{ marginBottom: 14 }}>Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {worker.skills.map((s) => <span key={s} className="skill-tag" style={{ padding: '4px 12px', fontSize: 12 }}>{s}</span>)}
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <button className="btn btn-primary btn-lg" onClick={onBook}>Book Service</button>
        <button className="btn btn-secondary btn-lg" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
