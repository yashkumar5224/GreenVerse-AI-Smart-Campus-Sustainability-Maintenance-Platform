import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import { startTelemetrySimulation, stopTelemetrySimulation } from './services/simulator';

// Layouts & Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './layouts/DashboardLayout';
import GreenBot from './components/GreenBot';
import GisMap from './components/GisMap';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Developers from './pages/Developers';
import Login from './pages/Login';
import Register from './pages/Register';

// Portal Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import ReportIssue from './pages/student/ReportIssue';
import Rewards from './pages/student/Rewards';
import Library from './pages/student/Library';

import MaintenanceDashboard from './pages/maintenance/MaintenanceDashboard';
import AssignedTasks from './pages/maintenance/AssignedTasks';

import AdminDashboard from './pages/admin/AdminDashboard';
import ComplaintManager from './pages/admin/ComplaintManager';
import IotManager from './pages/admin/IotManager';
import UserManager from './pages/admin/UserManager';
import AiInsights from './pages/admin/AiInsights';
import SettingsPage from './pages/admin/Settings';

// Protected Route Component mapping RBAC
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center font-mono text-xs text-slate-500">
        Loading GreenVerse session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // If not matching, redirect to default portal
    if (user.role === 'STUDENT') return <Navigate to="/dashboard/student" replace />;
    if (user.role === 'MAINTENANCE') return <Navigate to="/dashboard/maintenance" replace />;
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <>{children}</>;
};

const MapRouteWrapper = () => {
  const location = useLocation();
  const coords = location.state?.coords || null;
  return (
    <div className="w-full h-[calc(100vh-120px)]">
      <h3 className="font-display font-bold text-sm text-white mb-4">SPNREC GIS Smart Campus Blueprint</h3>
      <div className="w-full h-[calc(100vh-170px)] flex flex-col gap-2">
        {coords && (
          <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-3 py-2 rounded-lg w-fit">
            📍 Tracking Issue Location: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </div>
        )}
        <div className="flex-1 w-full relative">
          <GisMap selectedTicketCoords={coords} />
        </div>
      </div>
    </div>
  );
};

// Route wrapper to handle Navbar/Footer display on public sites vs dashboards
const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Portal */}
          <Route path="/dashboard/student" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/report" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><ReportIssue /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/rewards" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><Rewards /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/library" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><Library /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Maintenance Portal */}
          <Route path="/dashboard/maintenance" element={
            <ProtectedRoute allowedRoles={['MAINTENANCE']}>
              <DashboardLayout><MaintenanceDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/maintenance/tasks" element={
            <ProtectedRoute allowedRoles={['MAINTENANCE']}>
              <DashboardLayout><AssignedTasks /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Admin & Super Admin Portals */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/complaints" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <DashboardLayout><ComplaintManager /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/iot" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <DashboardLayout><IotManager /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <DashboardLayout><UserManager /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/ai" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <DashboardLayout><AiInsights /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/settings" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <DashboardLayout><SettingsPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Shared Map Route */}
          <Route path="/dashboard/map" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'MAINTENANCE', 'ADMIN', 'SUPER_ADMIN', 'GUEST']}>
              <DashboardLayout>
                <MapRouteWrapper />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isDashboard && <Footer />}
      <GreenBot />
    </div>
  );
};

export const App: React.FC = () => {
  const { initData } = useStore();

  useEffect(() => {
    // Initialize session and mock DB states
    initData();

    // Start background IoT telemetry simulator
    startTelemetrySimulation();

    return () => {
      // Clean up intervals on close
      stopTelemetrySimulation();
    };
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};
export default App;
