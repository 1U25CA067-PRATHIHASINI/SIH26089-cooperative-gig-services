import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { useToast } from '../../components/Toast';
import { Worker, ServiceCategory, Booking } from '../../types';
import { ArrowLeft, CheckCircle, CalendarDays, Clock, MapPin, FileText, Wrench } from 'lucide-react';

interface Props {
  worker: Worker;
  trade: ServiceCategory;
  location: string;
  onBack: () => void;
}

const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

function getNext7Days(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function BookingFlow({ worker, trade, location, onBack }: Props) {
  const { dispatch } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const dates = getNext7Days();

  function handleConfirm() {
    const id = `b-${Date.now()}`;
    const amount = Math.round((worker.priceRange[0] + worker.priceRange[1]) / 2 / 50) * 50;
    const booking: Booking = {
      id,
      service: trade,
      workerId: worker.id,
      workerName: worker.name,
      customerName: 'Demo Customer',
      customerPhone: '+91 99xxx xxxxx',
      location,
      date,
      time,
      notes,
      status: 'confirmed',
      amount,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_BOOKING', payload: booking });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `n-${Date.now()}`,
        message: `Booking confirmed with ${worker.name} for ${trade}`,
        time: 'Just now',
        read: false,
        type: 'booking',
      },
    });
    setBookingId(id);
    setConfirmed(true);
    toast('Booking confirmed successfully!', 'success');
  }

  if (confirmed) {
    return (
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center', paddingTop: 40 }}>
        <div className="confirm-icon"><CheckCircle size={28} color="var(--green)" /></div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Booking Confirmed</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Your service has been booked successfully.</p>
        <div className="card" style={{ textAlign: 'left' }}>
          <div className="info-row"><div className="info-key">Booking ID</div><div className="info-val" style={{ fontFamily: 'monospace' }}>{bookingId}</div></div>
          <div className="info-row"><div className="info-key">Worker</div><div className="info-val">{worker.name}</div></div>
          <div className="info-row"><div className="info-key">Service</div><div className="info-val">{trade}</div></div>
          <div className="info-row"><div className="info-key">Date</div><div className="info-val">{formatDate(date)}</div></div>
          <div className="info-row"><div className="info-key">Time</div><div className="info-val">{time}</div></div>
          <div className="info-row"><div className="info-key">Location</div><div className="info-val">{location}</div></div>
          <div className="info-row"><div className="info-key">Status</div><div className="info-val"><span className="badge-status badge-confirmed">Confirmed</span></div></div>
          {notes && <div className="info-row"><div className="info-key">Notes</div><div className="info-val">{notes}</div></div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => navigate('/bookings')}>View Bookings</button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  const stepLabels = ['Service', 'Location', 'Date', 'Time', 'Notes'];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <button className="btn btn-sm btn-outline" onClick={onBack} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="page-header">
        <h1>Book Service</h1>
        <p>Complete the details below to confirm your booking.</p>
      </div>

      {/* Steps */}
      <div className="steps">
        {stepLabels.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step-item ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
            </div>
            {i < stepLabels.length - 1 && <div className="step-sep" />}
          </div>
        ))}
      </div>

      <div className="card">
        {step === 1 && (
          <div>
            <div className="card-title" style={{ marginBottom: 16 }}><Wrench size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} /> Service</div>
            <div className="info-row"><div className="info-key">Service</div><div className="info-val">{trade}</div></div>
            <div className="info-row"><div className="info-key">Worker</div><div className="info-val">{worker.name}</div></div>
            <div className="info-row"><div className="info-key">Est. Price</div><div className="info-val">₹{worker.priceRange[0]} – ₹{worker.priceRange[1]}</div></div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setStep(2)}>Next</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="card-title" style={{ marginBottom: 16 }}><MapPin size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} /> Location</div>
            <div className="form-group">
              <label className="form-label">Service Location</label>
              <input className="form-input" value={location} readOnly />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="card-title" style={{ marginBottom: 16 }}><CalendarDays size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} /> Choose Date</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {dates.map((d) => (
                <button
                  key={d}
                  className={`btn ${date === d ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flexDirection: 'column', padding: '10px 6px', fontSize: 12 }}
                  onClick={() => setDate(d)}
                >
                  <strong>{new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' })}</strong>
                  {new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </button>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" disabled={!date} onClick={() => setStep(4)}>Next</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div className="card-title" style={{ marginBottom: 16 }}><Clock size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} /> Choose Time</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {timeSlots.map((t) => (
                <button
                  key={t}
                  className={`btn btn-sm ${time === t ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
              <button className="btn btn-primary" disabled={!time} onClick={() => setStep(5)}>Next</button>
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <div className="card-title" style={{ marginBottom: 16 }}><FileText size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} /> Additional Notes</div>
            <div className="form-group">
              <label className="form-label">Describe your requirement (optional)</label>
              <textarea className="form-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Kitchen sink pipe is leaking" />
            </div>
            <hr className="section-divider" />
            <div className="section-title">Booking Summary</div>
            <div className="info-row"><div className="info-key">Service</div><div className="info-val">{trade}</div></div>
            <div className="info-row"><div className="info-key">Worker</div><div className="info-val">{worker.name}</div></div>
            <div className="info-row"><div className="info-key">Date</div><div className="info-val">{formatDate(date)}</div></div>
            <div className="info-row"><div className="info-key">Time</div><div className="info-val">{time}</div></div>
            <div className="info-row"><div className="info-key">Location</div><div className="info-val">{location}</div></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep(4)}>Back</button>
              <button className="btn btn-primary btn-lg" onClick={handleConfirm}>Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
