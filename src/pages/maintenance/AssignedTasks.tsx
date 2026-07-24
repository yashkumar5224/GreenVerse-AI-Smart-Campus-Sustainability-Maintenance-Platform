import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { 
  ClipboardList, CheckCircle, Wrench, 
  User, FileText, Upload, Map
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssignedTasks: React.FC = () => {
  const { user, complaints, updateComplaintStatus } = useStore();
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

  // Find assigned active and completed tasks OR open pending tickets to claim
  const assignedComplaints = complaints.filter(c => {
    if (c.assignee_id && user?.id && c.assignee_id === user.id) return true;
    if (c.assignee_name && user?.name && c.assignee_name.toLowerCase() === user.name.toLowerCase()) return true;
    if (user?.role === 'MAINTENANCE') {
      if (c.assignee_name === 'Ramesh Prasad' || c.assignee_id === 'u-staff') return true;
      if (!c.assignee_id || c.status === 'PENDING') return true; // Show pending unassigned tickets
    }
    return false;
  });
  
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [repairNotes, setRepairNotes] = useState('');
  const [uploadingAfterImage, setUploadingAfterImage] = useState(false);
  const [afterImageUrl, setAfterImageUrl] = useState('');

  const currentTask = assignedComplaints.find(t => t.id === selectedTaskId) || null;

  const handleStatusChange = async (id: string, newStatus: 'IN_PROGRESS' | 'RESOLVED') => {
    if (newStatus === 'RESOLVED') {
      if (!repairNotes.trim()) {
        alert("Please write service repair logs before resolving the incident.");
        return;
      }
      
      const mockAfterUrl = afterImageUrl || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400';
      await updateComplaintStatus(id, 'RESOLVED', repairNotes, mockAfterUrl);
      
      // Celebrate completion
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });

      // Clear states
      setRepairNotes('');
      setAfterImageUrl('');
      setSelectedTaskId('');
    } else {
      if (user) {
        await useStore.getState().assignComplaint(id, user.id, user.name);
      }
      await updateComplaintStatus(id, 'IN_PROGRESS', `Work started by ${user?.name || 'Ramesh Prasad'}.`);
    }
  };

  const handleSimulateAfterUpload = () => {
    setUploadingAfterImage(true);
    setTimeout(() => {
      setUploadingAfterImage(false);
      setAfterImageUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400');
    }, 1500);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-950 text-red-400 border border-red-900';
      case 'HIGH': return 'bg-amber-950 text-amber-400 border border-amber-900';
      default: return 'bg-slate-900 text-slate-500 border border-slate-800';
    }
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-white">Assigned Job Management</h2>
        <p className="text-xs text-slate-400">View diagnostic reports, submit repair verification photo logs, and update resolution states.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Task List */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
            <ClipboardList size={16} className="text-cyan-400" /> Active Job List
          </h3>

          <div className="glass-panel rounded-2xl border border-brand-border divide-y divide-brand-border overflow-hidden">
            {assignedComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No active jobs in your queue.
              </div>
            ) : (
              assignedComplaints.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`p-4 flex flex-col gap-2 transition hover:bg-slate-900/30 cursor-pointer ${selectedTaskId === t.id ? 'bg-cyan-950/20 border-l-4 border-cyan-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase ${getPriorityBadge(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                      t.status === 'RESOLVED' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-xs text-slate-200 truncate">{t.title}</h4>
                    <span className="text-[9px] text-slate-500 font-mono">Location: {t.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Detailed form */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white">Incident Details & Resolution Log</h3>
          
          {currentTask ? (
            <div className="glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-6">
              {/* Ticket Meta */}
              <div className="flex flex-col gap-2 border-b border-brand-border pb-4">
                <span className="text-[9px] font-mono text-slate-500">ID: {currentTask.id.toUpperCase()}</span>
                <h4 className="font-display font-bold text-base text-white">{currentTask.title}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400 mt-2 font-medium">
                  <div 
                    onClick={() => navigate('/dashboard/map', { state: { coords: { lat: currentTask.latitude, lng: currentTask.longitude } } })}
                    className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/40 w-max"
                  >
                    <Map size={14} className="text-cyan-400" /> 
                    {currentTask.location}
                    {currentTask.latitude && currentTask.longitude && currentTask.location === 'Live GPS Location' && (
                      <span className="text-[10px] text-cyan-600 ml-1">({Number(currentTask.latitude).toFixed(4)}, {Number(currentTask.longitude).toFixed(4)})</span>
                    )}
                    - Live Radar
                  </div>
                  <div className="flex items-center gap-1.5"><User size={14} className="text-cyan-400" /> {currentTask.reporter_name}</div>
                  <div className="flex items-center gap-1.5"><FileText size={14} className="text-cyan-400" /> {currentTask.category}</div>
                </div>
              </div>

              {/* Description & Photo */}
              <div className="flex flex-col gap-3">
                <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Student Description</h5>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-brand-border italic">
                  "{currentTask.description}"
                </p>
                {currentTask.image_url && (
                  <div className="relative w-full max-h-[180px] overflow-hidden rounded-xl border border-brand-border">
                    <img 
                      src={currentTask.image_url} 
                      alt="defect"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[8px] font-mono text-slate-400">
                      Reported Issue Photo
                    </div>
                  </div>
                )}
              </div>

              {/* Resolution Form (Only if active) */}
              {currentTask.status !== 'RESOLVED' ? (
                <div className="flex flex-col gap-4 border-t border-brand-border pt-6">
                  <h5 className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Wrench size={10} /> Submit Service Logs
                  </h5>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-semibold uppercase">Resolution Details</label>
                    <textarea
                      rows={3}
                      value={repairNotes}
                      onChange={(e) => setRepairNotes(e.target.value)}
                      placeholder="Write tools used, parts replaced, and resolution summary..."
                      className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Simulated Upload button */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 font-semibold uppercase">Resolved Photo Verification</label>
                      <button
                        onClick={handleSimulateAfterUpload}
                        disabled={uploadingAfterImage}
                        className="bg-slate-900 hover:bg-slate-800 border border-brand-border p-3.5 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Upload size={18} />
                        <span className="text-[10px] font-bold">
                          {afterImageUrl ? '✅ Photo Attached' : 'Attach Repair Photo'}
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-col justify-end gap-2">
                      {currentTask.status === 'ACCEPTED' && (
                        <button
                          onClick={() => handleStatusChange(currentTask.id, 'IN_PROGRESS')}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
                        >
                          Mark as In Progress
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleStatusChange(currentTask.id, 'RESOLVED')}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/20"
                      >
                        Submit Resolution Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-xl flex gap-2.5 text-xs text-emerald-400 items-start">
                  <CheckCircle size={16} className="mt-0.5" />
                  <div>
                    <h5 className="font-bold">Job Resolved</h5>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Notes: "{currentTask.repair_notes}"
                    </p>
                    {currentTask.after_image_url && (
                      <div className="mt-3 relative max-w-[240px] rounded-lg overflow-hidden border border-emerald-900">
                        <img src={currentTask.after_image_url} className="w-full h-full object-cover" alt="resolved" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-10 rounded-2xl border border-brand-border text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <ClipboardList size={36} className="opacity-45" />
              <p>Select a job from the queue to load diagnostics details and log repairs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AssignedTasks;
