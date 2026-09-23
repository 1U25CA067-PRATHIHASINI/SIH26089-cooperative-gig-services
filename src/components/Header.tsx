import { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { Bell, Search } from 'lucide-react';

const titles: Record<string, Record<string, string>> = {
  customer: { '/': 'Dashboard', '/services': 'Find Services', '/bookings': 'My Bookings', '/payments': 'Payments', '/settings': 'Settings' },
  worker: { '/': 'Worker Dashboard', '/bookings': 'My Jobs', '/payments': 'Earnings', '/settings': 'Settings' },
  cooperative: { '/': 'Cooperative Dashboard', '/workers': 'Worker Management', '/bookings': 'All Bookings', '/payments': 'Payments', '/analytics': 'Demand Intelligence', '/settings': 'Settings' },
};

const roleLabels = { customer: 'Customer', worker: 'Worker', cooperative: 'Co-op Admin' } as const;

export default function Header({ pathname }: { pathname: string }) {
  const { state } = useApp();
  const { role, notifications } = state;
  const unread = notifications.filter((n) => !n.read).length;
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const title = titles[role]?.[pathname] || 'Dashboard';

  return (
    <header className="header">
      <div className="header-title">{title}</div>
      <div className="header-search">
        <Search size={15} color="var(--text-muted)" />
        <input placeholder="Search..." />
      </div>
      <div className="header-actions" ref={notifRef} style={{ position: 'relative' }}>
        <button className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
          <Bell size={17} />
          {unread > 0 && <span className="badge" />}
        </button>
        {showNotif && (
          <div className="notif-panel">
            <div style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px', borderBottom: '1px solid var(--border)' }}>
              Notifications
            </div>
            {state.notifications.length === 0 ? (
              <div style={{ padding: '24px 16px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>No notifications</div>
            ) : (
              state.notifications.slice(0, 6).map((n) => (
                <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                  {!n.read && <span className="notif-dot" />}
                  <div>
                    <div>{n.message}</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="user-chip">
          <div className="avatar">{role === 'customer' ? 'CU' : role === 'worker' ? 'AK' : 'CA'}</div>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{roleLabels[role]}</span>
        </div>
      </div>
    </header>
  );
}
