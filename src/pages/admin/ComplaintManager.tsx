import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { 
  UserPlus, Check, Map 
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export const ComplaintManager: React.FC = () => {
  const { complaints, assignComplaint, verifyComplaint } = useStore();
  const navigate = useNavigate();

  // Force-sync localStorage complaints into store on mount
  // This ensures student reports are always visible even after login switching
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
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [verifyingTicketId, setVerifyingTicketId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  const [staffResponders, setStaffResponders] = useState([
    { id: 'u-staff', name: 'Ramesh Prasad', dept: 'Facilities Plumbing' },
    { id: 'u-staff-2', name: 'Manoj Sinha', dept: 'High-Voltage Electrical' }
  ]);

  React.useEffect(() => {
    const loadStaff = async () => {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('role', 'MAINTENANCE');
        const localUsers = JSON.parse(localStorage.getItem('gv_users') || '[]');
        const localStaff = localUsers.filter((u: any) => u.role === 'MAINTENANCE');
        
        const combined = [
          { id: 'u-staff', name: 'Ramesh Prasad', dept: 'Facilities Plumbing' },
          { id: 'u-staff-2', name: 'Manoj Sinha', dept: 'High-Voltage Electrical' }
        ];

        const dbStaff = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          dept: p.dept || 'Facilities Maintenance'
        }));

        const locStaff = localStaff.map((u: any) => ({
          id: u.id,
          name: u.name,
          dept: u.dept || 'Facilities Maintenance'
        }));

        [...dbStaff, ...locStaff].forEach(item => {
          if (!combined.some(c => c.id === item.id)) {
            combined.push(item);
          }
        });

        setStaffResponders(combined);
      } catch (err) {
        console.warn('Failed to load dynamic staff list:', err);
      }
    };
    loadStaff();
  }, []);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTicketId || !selectedStaffId) return;

    const matchedStaff = staffResponders.find(s => s.id === selectedStaffId);
    if (matchedStaff) {
      await assignComplaint(assigningTicketId, matchedStaff.id, matchedStaff.name);
      setAssigningTicketId(null);
      setSelectedStaffId('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-950/80 text-red-400 border-red-900';
      case 'HIGH': return 'bg-amber-950/80 text-amber-400 border-amber-900';
      case 'MEDIUM': return 'bg-cyan-950/80 text-cyan-400 border-cyan-900';
      default: return 'bg-slate-900 text-slate-500 border-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'text-emerald-400 font-bold';
      case 'IN_PROGRESS': return 'text-cyan-400 font-bold animate-pulse';
      case 'ACCEPTED': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') return c.status !== 'RESOLVED';
    return c.status === filterStatus;
  });

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">Manage Campus Complaints</h2>
          <p className="text-xs text-slate-400">Review student reported incidents and dispatch repair orders to active maintenance responders.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition ${filterStatus === 'ALL' ? 'bg-slate-900 border-brand-border text-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition ${filterStatus === 'ACTIVE' ? 'bg-slate-900 border-brand-border text-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilterStatus('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition ${filterStatus === 'RESOLVED' ? 'bg-slate-900 border-brand-border text-white' : 'bg-transparent border-transparent text-slate-500 hover:text-white'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-brand-border text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4">Ticket</th>
                <th className="p-4">Location</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assignee</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredComplaints.map(c => (
                <tr key={c.id} className="hover:bg-slate-900/10 transition">
                  <td className="p-4 min-w-[200px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] text-slate-500 font-mono">#{c.id.substring(0, 8).toUpperCase()} | {c.category}</span>
                      <span className="font-bold text-slate-200">{c.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className="text-slate-300 font-mono text-[11px]">
                        {c.location}
                        {c.latitude && c.longitude && c.location === 'Live GPS Location' && (
                          <span className="block text-[9px] text-slate-500 mt-0.5">({Number(c.latitude).toFixed(4)}, {Number(c.longitude).toFixed(4)})</span>
                        )}
                      </span>
                      <button 
                        onClick={() => navigate('/dashboard/map', { state: { coords: { lat: c.latitude, lng: c.longitude } } })}
                        className="flex items-center gap-1 text-[9px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 px-1.5 py-0.5 rounded border border-cyan-900/50 uppercase tracking-wide transition cursor-pointer"
                      >
                        <Map size={10} /> Live Radar
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityColor(c.priority)}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-medium">{c.reporter_name}</td>
                  <td className="p-4 font-semibold uppercase tracking-wider text-[10px]">
                    <div className="flex flex-col gap-1">
                      <span className={getStatusColor(c.status)}>{c.status}</span>
                      {c.status === 'RESOLVED' && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${c.verified ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' : 'bg-amber-950/80 text-amber-400 border border-amber-900/50'}`}>
                          {c.verified ? 'VERIFIED' : 'AWAITING APPROVAL'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-medium">{c.assignee_name || 'Unassigned'}</td>
                  <td className="p-4 text-center">
                    {c.status === 'RESOLVED' ? (
                      c.verified ? (
                        <span className="text-emerald-500 flex items-center justify-center gap-1 font-bold text-[10px] uppercase"><Check size={12} /> Closed</span>
                      ) : (
                        <button
                          onClick={() => {
                            setVerifyingTicketId(c.id);
                            setVerificationNotes('');
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 mx-auto shadow-md shadow-emerald-950/30"
                        >
                          <Check size={12} /> Verify Work
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => setAssigningTicketId(c.id)}
                        className="bg-slate-900 hover:bg-cyan-950/20 border border-brand-border hover:border-cyan-900 text-slate-300 hover:text-cyan-400 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <UserPlus size={12} /> Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal overlay */}
      {assigningTicketId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-4 relative">
            <h3 className="font-display font-bold text-base text-white">Dispatch Maintenance Order</h3>
            <p className="text-xs text-slate-400">Choose an active college facilities responder to assign this job to.</p>
            
            <form onSubmit={handleAssignSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Select Staff Member</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  required
                  className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2.5 text-xs text-white glass-input"
                >
                  <option value="">-- Choose Responder --</option>
                  {staffResponders.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} - {staff.dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setAssigningTicketId(null)}
                  className="bg-slate-900 hover:bg-slate-800 border border-brand-border text-slate-400 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal overlay */}
      {verifyingTicketId && (() => {
        const ticket = complaints.find(c => c.id === verifyingTicketId);
        if (!ticket) return null;
        
        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
            <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-4 relative">
              <h3 className="font-display font-bold text-base text-white">Verify Maintenance Completion</h3>
              <p className="text-xs text-slate-400">Review technician repair details before closing the ticket.</p>
              
              <div className="bg-slate-950/50 border border-brand-border p-3 rounded-xl flex flex-col gap-2 text-xs">
                <div>
                  <span className="text-slate-500 font-mono">Job Title:</span>
                  <span className="text-white ml-2 font-bold">{ticket.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono">Completed By:</span>
                  <span className="text-white ml-2 font-semibold text-cyan-400">{ticket.assignee_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono">Technician Notes:</span>
                  <p className="text-slate-300 italic mt-1 bg-slate-900/50 p-2.5 rounded-lg border border-brand-border font-sans">{ticket.repair_notes || 'No notes provided.'}</p>
                </div>
                {ticket.after_image_url && (
                  <div>
                    <span className="text-slate-500 font-mono block mb-1">Completion Photo:</span>
                    <div className="w-full h-32 rounded-lg border border-brand-border overflow-hidden">
                      <img src={ticket.after_image_url} alt="After repair" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verification Remarks</label>
                <textarea
                  rows={2}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Resolution checks out. Eco-points released."
                  className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingTicketId(null)}
                  className="bg-slate-900 hover:bg-slate-800 border border-brand-border text-slate-400 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const ticketId = verifyingTicketId;
                    if (!ticketId) return;
                    await verifyComplaint(ticketId, verificationNotes);
                    setVerifyingTicketId(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-lg shadow-emerald-950/20"
                >
                  Verify & Release Points
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
export default ComplaintManager;

