import React from 'react';
import { useStore } from '../../hooks/useStore';
import { 
  Zap, Droplets, Leaf, ShieldAlert, CheckCircle, ClipboardList, 
  Cpu, TrendingUp, RefreshCw 
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminDashboard: React.FC = () => {
  const { complaints, sensors, sustainability, initData } = useStore();

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

  const openTickets = complaints.filter(c => c.status !== 'RESOLVED');
  const criticalSensors = sensors.filter(s => s.status === 'CRITICAL');
  const warningSensors = sensors.filter(s => s.status === 'WARNING');

  // Chart Data 1: Energy savings weekly comparison (Solar vs Grid)
  const energyChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Solar Output (kWh)',
        data: [145, 178, 190, 160, 205, 185, 220],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Grid Consumption (kWh)',
        data: [210, 240, 230, 260, 245, 180, 190],
        borderColor: '#06b6d4',
        backgroundColor: 'transparent',
        tension: 0.4
      }
    ]
  };

  const energyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 10 } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  // Chart Data 2: Water conservation indices (Liters saved)
  const waterChartData = {
    labels: ['Hostels', 'Academic', 'Labs', 'Canteen', 'Gardens'],
    datasets: [
      {
        label: 'Liters Conserved',
        data: [1850, 1200, 950, 600, 1400],
        backgroundColor: 'rgba(6, 182, 212, 0.8)',
        borderColor: '#06b6d4',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const waterChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">Campus Enterprise Control</h2>
          <p className="text-xs text-slate-400">Microsoft Sustainability Manager Model for SPNREC, Araria.</p>
        </div>

        <button 
          onClick={() => initData()}
          className="bg-slate-900 hover:bg-slate-800 border border-brand-border text-[11px] text-slate-300 font-bold p-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw size={12} className="animate-spin-slow" />
          Refresh telemetry
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Solar */}
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1 relative overflow-hidden">
          <Zap className="text-amber-500 absolute top-3 right-3 opacity-25" size={32} />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Solar Yield</span>
          <h4 className="text-lg font-bold font-mono text-white mt-1">
            {sustainability.energy_saved.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh
          </h4>
          <span className="text-[9px] text-emerald-400 font-mono">250kW Grid Active</span>
        </div>

        {/* Water */}
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1 relative overflow-hidden">
          <Droplets className="text-cyan-400 absolute top-3 right-3 opacity-25" size={32} />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Water Recycled</span>
          <h4 className="text-lg font-bold font-mono text-white mt-1">
            {sustainability.water_saved.toLocaleString()} L
          </h4>
          <span className="text-[9px] text-cyan-400 font-mono">Pump Station OK</span>
        </div>

        {/* Carbon */}
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1 relative overflow-hidden">
          <Leaf className="text-emerald-500 absolute top-3 right-3 opacity-25" size={32} />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Carbon Offset</span>
          <h4 className="text-lg font-bold font-mono text-white mt-1">
            {sustainability.carbon_offset.toLocaleString(undefined, { maximumFractionDigits: 3 })} t
          </h4>
          <span className="text-[9px] text-emerald-400 font-mono">Net Zero Index 8.2</span>
        </div>

        {/* Active Tickets */}
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1 relative overflow-hidden">
          <ClipboardList className="text-cyan-400 absolute top-3 right-3 opacity-25" size={32} />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Job Backlog</span>
          <h4 className="text-lg font-bold font-mono text-white mt-1">{openTickets.length} open</h4>
          <span className="text-[9px] text-slate-400 font-mono">Ramesh Prasad active</span>
        </div>

        {/* Anomaly warnings */}
        <div className="glass-panel p-4 rounded-xl border border-brand-border flex flex-col gap-1 relative overflow-hidden col-span-2 md:col-span-1">
          <ShieldAlert className="text-red-500 absolute top-3 right-3 opacity-25 animate-pulse" size={32} />
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">IoT Anomaly Alerts</span>
          <h4 className="text-lg font-bold font-mono text-red-400 mt-1">
            {criticalSensors.length + warningSensors.length} warnings
          </h4>
          <span className="text-[9px] text-red-500 font-mono animate-pulse">{criticalSensors.length} Critical Faults</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-display font-bold text-sm text-white">Clean Energy Generation (kWh)</h3>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp size={10} /> +12% vs grid</span>
          </div>
          <div className="h-64 relative">
            <Line data={energyChartData} options={energyChartOptions} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-display font-bold text-sm text-white">Campus Water Savings (Liters)</h3>
            <span className="text-[10px] text-slate-500 font-mono">By Facility Block</span>
          </div>
          <div className="h-64 relative">
            <Bar data={waterChartData} options={waterChartOptions} />
          </div>
        </div>
      </div>

      {/* Warnings alert HUD */}
      <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
        <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
          <Cpu className="text-cyan-400" size={16} /> Live IoT Critical Telemetry Warnings
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sensors.filter(s => s.status !== 'HEALTHY').map(s => (
            <div key={s.id} className="p-3 bg-slate-900/50 rounded-xl border border-brand-border flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <span className="text-[8px] font-bold font-mono text-slate-500 uppercase tracking-widest">{s.id}</span>
                <h4 className="font-semibold text-slate-200 truncate">{s.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">Location: {s.location}</p>
              </div>

              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                  s.status === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border-red-900 animate-pulse' : 'bg-amber-950 text-amber-400 border-amber-900'
                }`}>
                  {s.status}
                </span>
                <span className="text-[10px] font-mono text-slate-300">{s.last_reading} {s.unit}</span>
              </div>
            </div>
          ))}
          {sensors.filter(s => s.status !== 'HEALTHY').length === 0 && (
            <div className="col-span-2 text-center py-6 text-slate-500 text-xs flex items-center justify-center gap-1.5">
              <CheckCircle className="text-emerald-400" size={16} /> All campus IoT sensors are operating at healthy levels.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
