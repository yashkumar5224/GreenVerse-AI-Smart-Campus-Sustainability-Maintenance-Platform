import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Bot, UserPlus, Lock, Mail, User, BookOpen, ShieldAlert, ArrowLeft } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'MAINTENANCE'>('STUDENT');
  const [dept, setDept] = useState('');
  
  const { register, error, loading } = useStore();
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;

    const success = await register(email, name, role, password, role === 'STUDENT' ? dept : undefined);
    if (success) {
      // Redirect based on role
      if (role === 'STUDENT') navigate('/dashboard/student');
      else navigate('/dashboard/maintenance');
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
        {/* Back Link */}
        <Link to="/login" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition w-fit">
          <ArrowLeft size={12} />
          <span>Back to Sign In</span>
        </Link>

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserPlus size={22} className="animate-pulse" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-white tracking-tight">Create GreenVerse Account</h2>
          <p className="text-xs text-slate-400">Join the Smart Campus Sustainability Operations</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 p-3.5 rounded-xl flex gap-2.5 text-xs text-red-400 items-start">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Singh"
                required
                className="w-full bg-slate-900 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white glass-input"
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Role Picker */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campus Role</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'STUDENT'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-900 border-brand-border text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen size={13} />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('MAINTENANCE')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'MAINTENANCE'
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900 border-brand-border text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bot size={13} />
                Staff / Tech
              </button>
            </div>
          </div>

          {/* Department (For Students Only) */}
          {role === 'STUDENT' && (
            <div className="flex flex-col gap-1 animate-slide-down">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Academic Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                required
                className="w-full bg-slate-900 border border-brand-border rounded-xl px-3 py-2.5 text-xs text-white glass-input appearance-none"
              >
                <option value="" disabled>Select Department</option>
                <option value="Computer Science Engineering">Computer Science Engineering</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
              </select>
            </div>
          )}

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20 mt-2"
          >
            {loading ? 'Registering Account...' : 'Register & Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
