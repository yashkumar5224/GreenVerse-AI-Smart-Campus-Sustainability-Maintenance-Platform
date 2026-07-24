import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { LogIn, Lock, Mail, UserCheck, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useStore();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const success = await login(email, password);
    if (success) {
      const loggedInUser = useStore.getState().user;
      if (loggedInUser) {
        if (loggedInUser.role === 'STUDENT') navigate('/dashboard/student');
        else if (loggedInUser.role === 'MAINTENANCE') navigate('/dashboard/maintenance');
        else navigate('/dashboard/admin');
      }
    }
  };

  // Immediate role login triggers for reviewers
  const handleQuickLogin = async (demoEmail: string, redirectPath: string) => {
    const success = await login(demoEmail);
    if (success) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none" 
        style={{ backgroundImage: 'url(/campus_bg.jpg)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent pointer-events-none"></div>

      {/* Background radial overlays */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-brand-border flex flex-col gap-6 shadow-2xl relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="h-16 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
            <img src="/logo.png" alt="GreenVerse AI Logo" className="h-12 w-auto object-contain" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-white tracking-tight">Access GreenVerse AI Portal</h2>
          <p className="text-xs text-slate-400">Smart Sustainability Dashboard & Ticketing Operations</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 p-3.5 rounded-xl flex gap-2.5 text-xs text-red-400 items-start">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@spnrec.ac.in"
                required
                className="w-full bg-slate-900 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white glass-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <LogIn size={14} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-brand-border"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Quick Login</span>
          <div className="flex-grow border-t border-brand-border"></div>
        </div>

        {/* Demo Roles Panel */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickLogin('student@spnrec.ac.in', '/dashboard/student')}
            className="bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-xl p-2.5 flex flex-col items-center gap-1 cursor-pointer transition text-center"
          >
            <UserCheck className="text-emerald-400" size={14} />
            <span className="text-[10px] font-bold text-white">Student View</span>
            <span className="text-[8px] text-slate-500 font-mono">Aarav Singh</span>
          </button>

          <button
            onClick={() => handleQuickLogin('staff@spnrec.ac.in', '/dashboard/maintenance')}
            className="bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-xl p-2.5 flex flex-col items-center gap-1 cursor-pointer transition text-center"
          >
            <UserCheck className="text-cyan-400" size={14} />
            <span className="text-[10px] font-bold text-white">Staff View</span>
            <span className="text-[8px] text-slate-500 font-mono">Ramesh Prasad</span>
          </button>

        </div>

        <div className="text-center text-xs text-slate-400 mt-1">
          New student or staff?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-bold transition">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
