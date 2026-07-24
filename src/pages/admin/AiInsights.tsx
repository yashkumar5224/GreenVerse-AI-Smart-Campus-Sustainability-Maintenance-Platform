import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { 
  AlertTriangle, ShieldCheck, Download, 
  Brain, Combine, TrendingUp 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AiInsights: React.FC = () => {
  const { sustainability } = useStore();
  const [showEsgReport, setShowEsgReport] = useState(false);
  const [duplicateMerged, setDuplicateMerged] = useState(false);

  // Simulated AI predictions based on sensor values
  const predictions = [
    { target: 'Hostel Leak Sensor (s-water-02)', metric: 'Flow Rate Anomaly', prob: 92, action: 'Replace pipe valve at Boys Hostel Washroom within 48 hours', days: 2 },
    { target: 'Smart Bin Canteen (s-bin-02)', metric: 'Fill Accumulation Rate', prob: 78, action: 'Schedule waste emptying within 3 hours to prevent spill', hours: 3 },
    { target: 'Solar Inverter (s-solar-01)', metric: 'Efficiency Decay', prob: 12, action: 'Routine array cleaning scheduled in 15 days', days: 15 }
  ];

  // Simulated duplicates matching
  const duplicateIncidents = [
    { id1: 'c-01', title1: 'Water pipe leakage in Boys Hostel ground floor washroom', id2: 'c-sim-dup', title2: 'Water flooding in Hostel washrooms', similarity: 94, category: 'PLUMBING' }
  ];

  const handleMergeDuplicates = () => {
    setDuplicateMerged(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => {
      setDuplicateMerged(false);
    }, 4000);
  };

  const handleGenerateEsg = () => {
    setShowEsgReport(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">AI Diagnostics & ESG Hub</h2>
          <p className="text-xs text-slate-400">Generative insights, predictive diagnostics, duplicate detection, and ESG audits.</p>
        </div>

        <button 
          onClick={handleGenerateEsg}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
        >
          <Download size={14} />
          Generate ESG Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Col 1: Predictive Maintenance */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-brand-border pb-3">
            <Brain size={16} className="text-cyan-400" /> AI Predictive Maintenance Logs
          </h3>

          <div className="flex flex-col gap-4">
            {predictions.map((p, idx) => {
              const warning = p.prob > 50;
              return (
                <div key={idx} className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
                  warning ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-900/40 border-brand-border'
                }`}>
                  <div className="mt-0.5">
                    {warning ? <AlertTriangle className="text-red-500 animate-pulse" size={16} /> : <ShieldCheck className="text-emerald-400" size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-200">{p.target}</h4>
                      <span className={`font-bold font-mono ${warning ? 'text-red-400' : 'text-slate-400'}`}>
                        {p.prob}% failure risk
                      </span>
                    </div>
                    <p className="text-slate-400 mt-1">{p.action}</p>
                    <span className="text-[9px] text-slate-500 font-mono block mt-1.5">
                      Estimated limit: {p.days ? `${p.days} days` : `${p.hours} hours`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 2: Duplicate detection & ESG Details */}
        <div className="flex flex-col gap-6">
          {/* AI Duplicate Detection */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-brand-border pb-3">
              <Combine size={16} className="text-emerald-400" /> AI Duplicate Incident Matching
            </h3>

            {duplicateMerged ? (
              <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-xl flex gap-2.5 text-xs text-emerald-400 items-start">
                <ShieldCheck size={16} className="mt-0.5" />
                <div>
                  <h5 className="font-bold">Tickets Merged Successfully</h5>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Duplicate alerts resolved. Ticket list updated.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI scans reported complaints using GPS coordinates and category parameters to resolve duplicates.
                </p>
                {duplicateIncidents.map((d, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-brand-border p-3.5 rounded-xl flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Category: {d.category}</span>
                      <span className="text-emerald-400 font-bold">{d.similarity}% Match</span>
                    </div>
                    <div className="flex flex-col gap-1.5 font-mono text-[10px] text-slate-400 border-l border-brand-border pl-2.5">
                      <div><span className="text-slate-600 font-bold">1:</span> {d.title1}</div>
                      <div><span className="text-slate-600 font-bold">2:</span> {d.title2}</div>
                    </div>
                    <button
                      onClick={handleMergeDuplicates}
                      className="bg-slate-950 hover:bg-emerald-950/30 hover:border-emerald-900 border border-brand-border text-[10px] text-slate-300 hover:text-emerald-400 font-bold py-1.5 rounded-lg transition cursor-pointer text-center"
                    >
                      Merge Duplicates
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core ESG Stats summary */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-brand-border pb-3">
              <TrendingUp size={16} className="text-cyan-400" /> Carbon Neutrality Index
            </h3>

            <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Solar Energy Produced:</span>
                <span>{sustainability.energy_saved.toFixed(1)} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Water preserved:</span>
                <span>{sustainability.water_saved} Liters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recycle Segregation:</span>
                <span>{sustainability.recycling_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cumulative CO2 Offset:</span>
                <span className="text-emerald-400 font-bold">{sustainability.carbon_offset.toFixed(4)} Tons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ESG Report PDF Preview Modal */}
      {showEsgReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-300 p-8 rounded-lg shadow-2xl text-slate-950 relative flex flex-col gap-6 text-left font-sans">
            
            {/* Close */}
            <button 
              onClick={() => setShowEsgReport(false)}
              className="absolute top-4 right-4 bg-slate-900 text-white rounded-full p-1 cursor-pointer font-sans"
            >
              ✕
            </button>

            {/* Title Header */}
            <div className="border-b border-slate-300 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">SPNREC campus ESG report</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">Sustainability Performance Audit</h2>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs font-mono">
                  ESG
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Shri Phanishwar Nath Renu Engineering College | Araria, Bihar</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <div className="text-[8px] text-slate-500 font-sans font-bold">SOLAR YIELD</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{sustainability.energy_saved.toFixed(1)} kWh</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <div className="text-[8px] text-slate-500 font-sans font-bold">WATER SAVED</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{sustainability.water_saved} Liters</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <div className="text-[8px] text-slate-500 font-sans font-bold">CARBON OFFSET</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{sustainability.carbon_offset.toFixed(4)} Tons</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                <div className="text-[8px] text-slate-500 font-sans font-bold">CAMPUS INDEX</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{sustainability.score}% Score</div>
              </div>
            </div>

            {/* Audit Details */}
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-slate-950 border-b border-slate-100 pb-1">Performance Details</h4>
              <p>
                This audit validates the campus sustainability operations managed by the GreenVerse platform for the current quarter. Clean renewable offsets generated by the 250kW solar panel array have offset grid dependencies by <strong>12.4%</strong>.
              </p>
              <p>
                Plumbing flow sensors have successfully reduced overall water losses in Boys Hostel washrooms through real-time notifications to Ramesh Prasad and automatic maintenance dispatches, resulting in <strong>45,200 liters</strong> of greywater savings.
              </p>
            </div>

            {/* Signature Block */}
            <div className="flex justify-between items-end mt-6 text-[10px] pt-4 border-t border-slate-200">
              <div className="flex flex-col gap-1 text-slate-500 font-mono">
                <div>AUDIT ID: SPNREC-ESG-{Math.floor(Math.random()*10000)}</div>
                <div>DATE GENERATED: {new Date().toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col items-end gap-1 font-sans">
                <span className="text-slate-900 italic underline">Dr. Yashasvi Raj</span>
                <span className="text-[8px] text-slate-500 uppercase font-mono tracking-wider">Campus Principal</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 px-6 rounded-lg self-center cursor-pointer transition shadow"
            >
              Print Audit PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default AiInsights;
