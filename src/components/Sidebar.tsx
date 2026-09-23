import { useApp } from '../store/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../data/mockData';
import {
  LayoutDashboard, Briefcase, CalendarCheck, Users, Wallet, BarChart3,
  Settings, User, HardHat, Building2
} from 'lucide-react';

const roleConfig = {
  customer: { label: 'customer', color: '#2563eb', icon: User },
  worker: { label: 'worker', color: '#d97706', icon: HardHat },
  cooperative: { label: 'cooperative', color: '#16a34a', icon: Building2 },
};

const navSections: Record<string, { key: string; icon: typeof LayoutDashboard; path: string }[]> = {
  customer: [
    { key: 'dashboard', icon: LayoutDashboard, path: '/' },
    { key: 'services', icon: Briefcase, path: '/services' },
    { key: 'bookings', icon: CalendarCheck, path: '/bookings' },
    { key: 'payments', icon: Wallet, path: '/payments' },
    { key: 'settings', icon: Settings, path: '/settings' },
  ],
  worker: [
    { key: 'dashboard', icon: LayoutDashboard, path: '/' },
    { key: 'bookings', icon: CalendarCheck, path: '/bookings' },
    { key: 'payments', icon: Wallet, path: '/payments' },
    { key: 'settings', icon: Settings, path: '/settings' },
  ],
  cooperative: [
    { key: 'dashboard', icon: LayoutDashboard, path: '/' },
    { key: 'workers', icon: Users, path: '/workers' },
    { key: 'bookings', icon: CalendarCheck, path: '/bookings' },
    { key: 'payments', icon: Wallet, path: '/payments' },
    { key: 'analytics', icon: BarChart3, path: '/analytics' },
    { key: 'settings', icon: Settings, path: '/settings' },
  ],
};

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { role, language } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const t = (key: string) => TRANSLATIONS[language]?.[key] ?? key;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">S</div>
        <div>
          <div className="sidebar-logo-name">SkillSetu</div>
          <div className="sidebar-logo-tagline">Cooperative Marketplace</div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="sidebar-roles">
        <div className="sidebar-roles-label">Switch Role</div>
        {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((r) => {
          const cfg = roleConfig[r];
          const Icon = cfg.icon;
          return (
            <button
              key={r}
              className={`role-btn ${role === r ? 'active' : ''}`}
              onClick={() => { dispatch({ type: 'SET_ROLE', payload: r }); navigate('/'); }}
            >
              <span className="role-dot" style={{ background: cfg.color }} />
              <Icon size={15} />
              {t(cfg.label).charAt(0).toUpperCase() + t(cfg.label).slice(1)}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>
        {navSections[role]?.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.key}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={16} />
              {t(item.key).charAt(0).toUpperCase() + t(item.key).slice(1)}
            </div>
          );
        })}
      </nav>

      {/* Language */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--navy-border)' }}>
        <div className="sidebar-roles-label">Language</div>
        <select
          value={language}
          onChange={(e) => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value as 'en' | 'ta' | 'hi' })}
          style={{
            width: '100%',
            padding: '5px 8px',
            borderRadius: 'var(--radius)',
            background: 'var(--navy-light)',
            color: '#c9d8ea',
            border: '1px solid var(--navy-border)',
            fontSize: '12px',
          }}
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
    </aside>
  );
}
