import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { 
  Bot, Map, LayoutDashboard, Ticket, Award, Bell, LogOut, 
  Menu, X, ShieldAlert, Cpu, Users, Settings, BookOpen, 
  Sparkles, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, notifications, markNotificationRead, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };



  const getSidebarItems = () => {
    const role = user?.role || 'GUEST';
    
    const items = [
      { path: '/dashboard/map', name: 'GIS Campus Map', icon: <Map size={18} /> },
    ];

    if (role === 'STUDENT') {
      return [
        { path: '/dashboard/student', name: 'Student Dashboard', icon: <LayoutDashboard size={18} /> },
        ...items,
        { path: '/dashboard/student/report', name: 'Report Issue', icon: <Ticket size={18} /> },
        { path: '/dashboard/student/rewards', name: 'Green Rewards', icon: <Award size={18} /> },
        { path: '/dashboard/student/library', name: 'Smart Library', icon: <BookOpen size={18} /> },
      ];
    }

    if (role === 'MAINTENANCE') {
      return [
        { path: '/dashboard/maintenance', name: 'Maintenance Hub', icon: <LayoutDashboard size={18} /> },
        ...items,
        { path: '/dashboard/maintenance/tasks', name: 'Assigned Tasks', icon: <Ticket size={18} /> },
      ];
    }

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return [
        { path: '/dashboard/admin', name: 'Admin Dashboard', icon: <LayoutDashboard size={18} /> },
        ...items,
        { path: '/dashboard/admin/complaints', name: 'Manage Complaints', icon: <Ticket size={18} /> },
        { path: '/dashboard/admin/iot', name: 'IoT Telemetry', icon: <Cpu size={18} /> },
        { path: '/dashboard/admin/users', name: 'User Directory', icon: <Users size={18} /> },
        { path: '/dashboard/admin/ai', name: 'AI Insights Hub', icon: <Bot size={18} /> },
        { path: '/dashboard/admin/settings', name: 'System Settings', icon: <Settings size={18} /> },
      ];
    }

    // Guest Fallback
    return [
      { path: '/dashboard/map', name: 'Campus GIS Map', icon: <Map size={18} /> }
    ];
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="text-emerald-400" size={16} />;
      case 'WARNING':
        return <AlertTriangle className="text-amber-400" size={16} />;
      case 'CRITICAL':
        return <ShieldAlert className="text-red-400" size={16} />;
      default:
        return <ShieldCheck className="text-cyan-400" size={16} />;
    }
  };

  const unreadNotifs = notifications.filter(n => !n.read && (n.user_id === 'u-all' || n.user_id === user?.id));

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-950/80 backdrop-blur-md border-r border-brand-border z-30 transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-brand-border bg-slate-950">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 px-1.5 py-0.5 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              <img src="/logo.png" alt="GreenVerse AI Logo" className="h-6 w-auto object-contain" />
            </div>
            <span className="font-display font-bold text-base text-white tracking-tight flex items-center gap-1">
              GreenVerse <span className="text-[9px] text-emerald-400 font-mono px-1 py-0.5 rounded bg-emerald-950 border border-emerald-800">AI</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-brand-border bg-slate-900/30">
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
              alt="avatar" 
              className="w-10 h-10 rounded-full border border-brand-border"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-white truncate">{user?.name || 'Guest User'}</h4>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">{user?.email}</p>
            </div>
          </div>
          {user?.points !== undefined && (
            <div className="mt-3 flex items-center justify-between bg-emerald-950/40 border border-emerald-800/30 rounded-lg px-2.5 py-1.5 text-[11px]">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Eco-Points:</span>
              <span className="text-emerald-400 font-bold font-mono flex items-center gap-0.5">
                {user.points} <Sparkles size={10} className="animate-spin-slow" />
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {getSidebarItems().map((item, idx) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition duration-200 ${
                  active 
                    ? 'bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brand-border bg-slate-950/60">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-950/30 hover:border-red-900/50 border border-brand-border text-slate-400 hover:text-red-400 text-xs font-semibold py-2.5 rounded-xl transition duration-200 cursor-pointer"
          >
            <LogOut size={14} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-brand-border bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-6 z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white flex items-center justify-center"
            >
              <Menu size={20} />
            </button>
            <div className="text-xs text-slate-400 font-semibold hidden md:block">
              Welcome to GreenVerse Management Hub
            </div>
          </div>

          <div className="flex items-center gap-4">

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 hover:bg-slate-900 rounded-xl border border-brand-border text-slate-400 hover:text-white relative cursor-pointer"
              >
                <Bell size={18} />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-950 animate-ping"></span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto glass-panel border border-brand-border rounded-xl shadow-2xl flex flex-col z-50 animate-slide-up">
                  <div className="p-3 border-b border-brand-border bg-slate-950 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Campus Radar Alerts</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900">
                      {unreadNotifs.length} Unread
                    </span>
                  </div>
                  <div className="flex-1 divide-y divide-brand-border bg-slate-950/20 max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-xs">No active alerts.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-[11px] leading-relaxed transition hover:bg-slate-900/50 cursor-pointer flex gap-2.5 ${n.read ? 'opacity-55' : 'bg-slate-900/20'}`}
                        >
                          <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-slate-200">{n.title}</h5>
                            <p className="text-slate-400 mt-0.5">{n.message}</p>
                            <span className="text-[8px] text-slate-600 font-mono block mt-1">
                              {new Date(n.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950/15">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
