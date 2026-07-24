import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import GisMap from '../../components/GisMap';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, CheckCircle, Clock, Map, ClipboardList, 
  ArrowRight 
} from 'lucide-react';

export const MaintenanceDashboard: React.FC = () => {
  const { user, complaints, updateComplaintStatus, assignComplaint } = useStore();
  const navigate = useNavigate();

  // Force-sync localStorage complaints on mount
  React.useEffect(() => {
    const localComplaints = JSON.parse(localStorage.getItem('gv_complaints') || '[]');
    const storeComplaints = useStore.getState().complaints;
    let merged = [...storeComplaints];
    let changed = false;
    localComplaints.forEach((lc: any) => {
      if (!merged.some((c: any) => c.id === lc.id)) {
        merged.push(lc);
        changed = true;
      }
    });
    if (changed) {
      merged.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      useStore.setState({ complaints: merged });
    }
  }, []);
  
  // Filter active complaints assigned to current staff OR open pending tickets
  const assignedTasks = complaints.filter(c => {
    if (c.status === 'RESOLVED') return false;
    if (c.assignee_id && user?.id && c.assignee_id === user.id) return true;
    if (c.assignee_name && user?.name && c.assignee_name.toLowerCase() === user.name.toLowerCase()) return true;
    if (user?.role === 'MAINTENANCE') {
      if (c.assignee_name === 'Ramesh Prasad' || c.assignee_id === 'u-staff') return true;
      if (!c.assignee_id || c.status === 'PENDING') return true; // Show unassigned/pending tickets to staff
    }
    return false;
  });
  const progressCount = assignedTasks.filter(t => t.status === 'IN_PROGRESS').length;

  const [selectedTaskCoords, setSelectedTaskCoords] = useState<{ lat: number; lng: number } | null>(null);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-950/80 text-red-400 border-red-900';
      case 'HIGH': return 'bg-amber-950/80 text-amber-400 border-amber-900';
      default: return 'bg-slate-900 text-slate-500 border-slate-800';
    }
  };

  const handleStartTask = async (id: string) => {
    if (user) {
      await assignComplaint(id, user.id, user.name);
    }
    await updateComplaintStatus(id, 'IN_PROGRESS', `Work started by ${user?.name || 'Ramesh Prasad'}.`);
  };

  const handleNavigateTask = (lat: number, lng: number) => {
    setSelectedTaskCoords({ lat, lng });
    // Panning visual cue
    setTimeout(() => setSelectedTaskCoords(null), 1000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-gradient-to-r from-slate-900 to-slate-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'} 
            alt="staff"
            className="w-14 h-14 rounded-full border-2 border-cyan-500/30 object-cover"
          />
          <div>
            <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Wrench size={10} /> SPNREC Facilities Team
            </span>
            <h2 className="font-display font-extrabold text-xl text-white mt-0.5">Welcome Back, {user?.name}!</h2>
            <p className="text-xs text-slate-400">Duty Status: Active Responder</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard/maintenance/tasks')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950/20"
        >
          <ClipboardList size={12} />
          Go to Job Queue ({assignedTasks.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-4 rounded-2xl border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Assigned Backlog</span>
            <h4 className="text-2xl font-bold font-mono text-white mt-1">{assignedTasks.length} jobs</h4>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl text-slate-400">
            <ClipboardList size={20} />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">In Progress</span>
            <h4 className="text-2xl font-bold font-mono text-cyan-400 mt-1">{progressCount} working</h4>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Clock size={20} />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-brand-border flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Avg. Repair Time</span>
            <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">45 mins</h4>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Leaflet GIS Routing Radar */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
            <Map size={16} className="text-cyan-400" /> GIS Dispatch Radar
          </h3>
          <div className="h-[380px] w-full">
            <GisMap selectedTicketCoords={selectedTaskCoords} />
          </div>
        </div>

        {/* Col 3: Assigned Job List */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white">Active Queue</h3>
          
          <div className="glass-panel rounded-2xl border border-brand-border divide-y divide-brand-border max-h-[380px] overflow-y-auto">
            {assignedTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                <CheckCircle size={32} className="text-emerald-400" />
                <p>No jobs assigned! Stand by for active warnings or admin dispatches.</p>
              </div>
            ) : (
              assignedTasks.map(t => (
                <div key={t.id} className="p-4 flex flex-col gap-3 hover:bg-slate-900/20 transition">
                  <div className="flex justify-between items-start">
                    <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Status: {t.status}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-display font-semibold text-xs text-white truncate">{t.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Loc: {t.location}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleNavigateTask(t.latitude, t.longitude)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 border border-brand-border text-[10px] text-slate-300 font-bold py-1.5 rounded-lg transition cursor-pointer text-center"
                    >
                      Radar Pin
                    </button>
                    {t.status === 'ACCEPTED' ? (
                      <button
                        onClick={() => handleStartTask(t.id)}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] py-1.5 rounded-lg transition cursor-pointer text-center"
                      >
                        Start Work
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/dashboard/maintenance/tasks')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-0.5"
                      >
                        Resolve <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MaintenanceDashboard;
