import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useStore } from '../../hooks/useStore';
import { RefreshCw, Settings, Battery, MapPin } from 'lucide-react';

export const IotManager: React.FC = () => {
  const { sensors, fetchSensors } = useStore();
  const [editingSensorId, setEditingSensorId] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState('');

  const handleEditSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editLocation.trim()) return;

    try {
      await supabase.from('sensors').update({ location: editLocation, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (err) {
      console.warn('Supabase sensor update failed, saving locally:', err);
    }

    const nextSensors = useStore.getState().sensors.map((s: any) => 
      s.id === id ? { ...s, location: editLocation, updated_at: new Date().toISOString() } : s
    );
    localStorage.setItem('gv_sensors', JSON.stringify(nextSensors));
    useStore.setState({ sensors: nextSensors });

    fetchSensors();
    setEditingSensorId(null);
    setEditLocation('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-950/80 text-red-400 border border-red-900 animate-pulse';
      case 'WARNING': return 'bg-amber-950 text-amber-400 border border-amber-900';
      default: return 'bg-emerald-950/80 text-emerald-400 border border-emerald-900';
    }
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">IoT Node Telemetry Directory</h2>
          <p className="text-xs text-slate-400">Monitor active ultrasonic, flow rate, particulate PM2.5, and temperature sensor parameters.</p>
        </div>

        <button 
          onClick={() => fetchSensors()}
          className="bg-slate-900 hover:bg-slate-800 border border-brand-border text-[11px] text-slate-300 font-bold p-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={12} />
          Poll Sensors
        </button>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-medium text-xs">
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Active Nodes</span>
          <h4 className="text-lg font-bold font-mono text-white mt-1">{sensors.length} sensors</h4>
        </div>
        
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Healthy Status</span>
          <h4 className="text-lg font-bold font-mono text-emerald-400 mt-1">
            {sensors.filter(s => s.status === 'HEALTHY').length} / {sensors.length} online
          </h4>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Low Battery Alerts (&lt; 20%)</span>
          <h4 className="text-lg font-bold font-mono text-amber-500 mt-1">
            {sensors.filter(s => s.battery < 20).length} nodes
          </h4>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-brand-border text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="p-4">Sensor ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Battery</th>
                <th className="p-4">Value</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {sensors.map(s => (
                <tr key={s.id} className="hover:bg-slate-900/10 transition">
                  <td className="p-4 font-mono text-[10px] text-slate-500">
                    {s.id.toUpperCase()}
                  </td>
                  <td className="p-4 font-bold text-slate-200">{s.name}</td>
                  <td className="p-4 text-slate-300">
                    {editingSensorId === s.id ? (
                      <form onSubmit={(e) => handleEditSubmit(e, s.id)} className="flex gap-2 max-w-[200px]">
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="New location..."
                          className="bg-slate-950 border border-brand-border rounded px-2 py-1 text-[10px] text-white flex-1"
                        />
                        <button type="submit" className="bg-emerald-600 px-2 py-1 rounded text-[9px] font-bold text-white">Save</button>
                      </form>
                    ) : (
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin size={12} className="text-slate-500" /> {s.location}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Battery size={14} className={s.battery < 20 ? 'text-red-500 animate-pulse' : 'text-slate-400'} />
                      <span>{s.battery}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-300">
                    {s.last_reading} {s.unit}
                  </td>
                  <td className="p-4 uppercase text-[10px] font-bold">
                    <span className={getStatusBadge(s.status)}>{s.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => { setEditingSensorId(s.id); setEditLocation(s.location); }}
                      className="bg-slate-900 hover:bg-slate-800 border border-brand-border p-1.5 rounded-lg transition cursor-pointer inline-flex items-center justify-center text-slate-400 hover:text-white"
                      title="Edit location parameters"
                    >
                      <Settings size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default IotManager;
