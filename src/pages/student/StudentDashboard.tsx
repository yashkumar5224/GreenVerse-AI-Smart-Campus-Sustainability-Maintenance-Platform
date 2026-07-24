import React from 'react';
import { useStore } from '../../hooks/useStore';
import { Award, Leaf, Clock, Send, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user, complaints, leaderboard, sustainability } = useStore();
  const navigate = useNavigate();

  // Get current user reported complaints
  const myComplaints = complaints.filter(c => c.reporter_id === user?.id).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'bg-emerald-950/80 text-emerald-400 border-emerald-900';
      case 'IN_PROGRESS': return 'bg-cyan-950/80 text-cyan-400 border-cyan-900';
      case 'ACCEPTED': return 'bg-amber-950/80 text-amber-400 border-amber-900';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-500';
      case 'HIGH': return 'text-amber-500';
      case 'MEDIUM': return 'text-cyan-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-gradient-to-r from-emerald-950/30 to-slate-950 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none -translate-y-1/2"></div>
        
        <div className="flex items-center gap-4">
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'} 
            alt="user"
            className="w-14 h-14 rounded-full border-2 border-emerald-500/30 shadow-lg object-cover"
          />
          <div>
            <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Leaf size={10} className="animate-spin-slow" /> SPNREC Eco Champion
            </span>
            <h2 className="font-display font-extrabold text-2xl text-white mt-1">Hello, {user?.name}!</h2>
            <p className="text-xs text-slate-400">Department: {user?.dept || 'General Engineering'}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/student/report')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl transition duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/30"
          >
            <Send size={12} />
            Report Issue
          </button>
        </div>
      </div>

      {/* 2. KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: My Points */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">My Reward Balance</span>
            <h3 className="text-3xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
              {user?.points || 0} <Sparkles size={20} className="text-emerald-400 animate-pulse" />
            </h3>
            <span className="text-[10px] text-slate-400">Rank: #1 Eco Champion</span>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-105 transition duration-300">
            <Award size={26} />
          </div>
        </div>

        {/* Card 2: CO2 Saved */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Carbon Footprint Saved</span>
            <h3 className="text-3xl font-bold font-mono text-cyan-400 mt-1">
              {(sustainability.carbon_offset * 0.05).toFixed(3)} Tons
            </h3>
            <span className="text-[10px] text-slate-400">Equivalent to 2.4 trees planted</span>
          </div>
          <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:scale-105 transition duration-300">
            <Leaf size={26} />
          </div>
        </div>

        {/* Card 3: ESG score */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex items-center justify-between relative overflow-hidden group">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SPNREC Sustainability Index</span>
            <h3 className="text-3xl font-bold font-mono text-white mt-1">
              {sustainability.score}%
            </h3>
            <span className="text-[10px] text-slate-400">Goal: target 90% by year end</span>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-105 transition duration-300">
            <ShieldCheck size={26} />
          </div>
        </div>
      </div>

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: My Reported Issues */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">My Reported Incidents</h3>
            <Link to="/dashboard/map" className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 transition">
              View on GIS Map <ChevronRight size={12} />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl border border-brand-border divide-y divide-brand-border overflow-hidden">
            {myComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                <Clock size={32} className="opacity-45" />
                <p>You haven't reported any complaints yet. Report water leaks or overflow bins to earn green points!</p>
              </div>
            ) : (
              myComplaints.map(c => (
                <div key={c.id} className="p-4 flex items-start justify-between gap-4 transition hover:bg-slate-900/30">
                  <div className="min-w-0 flex flex-col gap-1">
                    <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-widest">
                      ID: {c.id.substring(0, 8).toUpperCase()} | {c.category}
                    </span>
                    <h4 className="font-display font-semibold text-xs text-white truncate">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed truncate max-w-[400px]">
                      {c.description}
                    </p>
                    {c.verification_notes && (
                      <p className="text-[10px] text-emerald-400 font-medium">
                        Verification Remarks: "{c.verification_notes}"
                      </p>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">Location: {c.location}</span>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border uppercase ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                      {c.status === 'RESOLVED' && (
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded ${c.verified ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' : 'bg-amber-950/80 text-amber-400 border border-amber-900/50 animate-pulse'}`}>
                          {c.verified ? 'VERIFIED' : 'AWAITING ADMIN APPROVAL'}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-600">
                      Priority: <span className={`font-semibold ${getPriorityColor(c.priority)}`}>{c.priority}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Col 3: Eco Leaderboard */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white">Campus Eco Leaderboard</h3>
          
          <div className="glass-panel p-4 rounded-2xl border border-brand-border flex flex-col gap-4">
            <div className="divide-y divide-brand-border">
              {leaderboard.slice(0, 5).map((l, idx) => (
                <div key={l.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500 w-4">
                      #{idx + 1}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-brand-border flex items-center justify-center font-bold text-[10px] text-white">
                      {l.name[0]}
                    </div>
                    <div>
                      <h5 className="font-semibold text-slate-200">{l.name}</h5>
                      <span className="text-[8px] text-slate-500 uppercase font-mono tracking-wider">{l.tier}</span>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5 text-[11px]">
                    {l.points} pts
                  </span>
                </div>
              ))}
            </div>
            
            <div className="pt-2 border-t border-brand-border text-center">
              <button 
                onClick={() => navigate('/dashboard/student/rewards')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 font-bold py-2 rounded-xl border border-brand-border transition"
              >
                Go to Rewards Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;
