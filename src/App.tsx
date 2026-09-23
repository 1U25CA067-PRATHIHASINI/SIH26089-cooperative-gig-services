import { Routes, Route } from 'react-router-dom';
import { useApp } from './store/AppContext';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ServiceSearch from './pages/customer/ServiceSearch';
import CustomerBookings from './pages/customer/CustomerBookings';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import CooperativeDashboard from './pages/cooperative/CooperativeDashboard';
import DemandIntelligence from './pages/cooperative/DemandIntelligence';

function App() {
  const { state } = useApp();

  return (
    <ToastProvider>
      <div className="app-layout">
        <div className="sidebar-wrap">
          <Sidebar />
        </div>
        <div className="main-wrap">
          <Header pathname={window.location.pathname} />
          <div className="page-content">
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<CustomerDashboard />} />
              <Route path="/services" element={<ServiceSearch />} />
              <Route path="/bookings" element={<CustomerBookings />} />
              <Route path="/payments" element={<div>Customer Payments Page</div>} />
              <Route path="/settings" element={<div>Customer Settings Page</div>} />

              {/* Worker Routes */}
              <Route path="/" element={<WorkerDashboard />} />
              <Route path="/bookings" element={<div>Worker Bookings Page</div>} />
              <Route path="/payments" element={<div>Worker Payments Page</div>} />
              <Route path="/settings" element={<div>Worker Settings Page</div>} />

              {/* Cooperative Routes */}
              <Route path="/" element={<CooperativeDashboard />} />
              <Route path="/workers" element={<div>Worker Management Page</div>} />
              <Route path="/bookings" element={<div>Cooperative Bookings Page</div>} />
              <Route path="/payments" element={<div>Cooperative Payments Page</div>} />
              <Route path="/analytics" element={<DemandIntelligence />} />
              <Route path="/settings" element={<div>Cooperative Settings Page</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
