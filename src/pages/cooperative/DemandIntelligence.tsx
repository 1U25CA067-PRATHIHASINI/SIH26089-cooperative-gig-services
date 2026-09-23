import { useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, MapPin, Zap, Wrench, Hammer, Paintbrush, Sparkles, Heart, Car, Flower2, Settings as SettingsIcon } from 'lucide-react';

const serviceIcons: Record<string, typeof Zap> = {
  Electrician: Zap, Plumber: Wrench, Carpenter: Hammer, Painter: Paintbrush,
  Cleaner: Sparkles, Caregiver: Heart, Driver: Car, Gardener: Flower2, Technician: SettingsIcon,
};

export default function DemandIntelligence() {
  const { state } = useApp();

  const tradeCounts = useMemo(() => {
    return state.bookings.reduce((acc, b) => {
      acc[b.service] = (acc[b.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [state.bookings]);

  const locationCounts = useMemo(() => {
    return state.bookings.reduce((acc, b) => {
      const loc = b.location.split(',')[0];
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [state.bookings]);

  const tradeChartData = useMemo(() => {
    return Object.entries(tradeCounts).map(([trade, count]) => ({ name: trade, demand: count }));
  }, [tradeCounts]);

  const locationChartData = useMemo(() => {
    return Object.entries(locationCounts).map(([loc, count]) => ({ name: loc, demand: count }));
  }, [locationCounts]);

  return (
    <div>
      <div className="page-header">
        <h1>Demand Intelligence</h1>
        <p>Analyze service demand patterns and forecast trends</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
            Service Demand by Trade
          </div>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tradeChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="demand" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <MapPin size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
            Service Demand by Location
          </div>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="demand" fill="var(--accent-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
    </div>
  );
}
