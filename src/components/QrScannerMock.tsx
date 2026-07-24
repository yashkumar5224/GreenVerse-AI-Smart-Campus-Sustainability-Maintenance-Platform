import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import type { Sensor } from '../types/database';
import { QrCode, Camera, CheckCircle, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';

interface QrScannerMockProps {
  onScanSuccess: (sensorId: string) => void;
}

export const QrScannerMock: React.FC<QrScannerMockProps> = ({ onScanSuccess }) => {
  const { sensors } = useStore();
  const [selectedSensorId, setSelectedSensorId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedSensor, setScannedSensor] = useState<Sensor | null>(null);

  const handleSimulateScan = () => {
    if (!selectedSensorId) return;
    
    setScanning(true);
    setScannedSensor(null);

    // Simulate scanning delay
    setTimeout(() => {
      setScanning(false);
      const match = sensors.find(s => s.id === selectedSensorId) || null;
      setScannedSensor(match);
      if (match) {
        // Trigger success callback after showing summary
        onScanSuccess(match.id);
      }
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <ShieldCheck className="text-emerald-400" size={16} />;
      case 'WARNING':
        return <AlertTriangle className="text-amber-400" size={16} />;
      default:
        return <AlertTriangle className="text-red-500 animate-pulse" size={16} />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <QrCode size={24} />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-white">QR Code Scan Simulator</h3>
          <p className="text-xs text-slate-400">Scan QR codes attached to campus panels to check telemetry or report issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Viewfinder simulation */}
        <div className="relative aspect-video md:aspect-square bg-slate-950 border border-brand-border rounded-xl overflow-hidden flex flex-col items-center justify-center">
          {scanning ? (
            <>
              {/* Viewfinder borders */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-emerald-500"></div>
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-emerald-500"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-emerald-500"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-emerald-500"></div>

              {/* Laser Line Animation */}
              <div className="absolute left-6 right-6 h-0.5 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-[pulse-glow_1.5s_infinite] top-1/2 transform -translate-y-1/2"></div>
              
              <Camera className="text-emerald-500/35 animate-pulse" size={48} />
              <span className="text-xs font-mono text-emerald-400 mt-4 tracking-widest uppercase">
                Locking QR target...
              </span>
            </>
          ) : scannedSensor ? (
            <div className="p-6 text-center flex flex-col items-center gap-3">
              <CheckCircle className="text-emerald-400 animate-bounce" size={40} />
              <span className="text-sm font-semibold text-white">QR Decoded Successfully</span>
              <div className="bg-slate-900 border border-brand-border p-3.5 rounded-lg text-left w-full mt-2 flex flex-col gap-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID:</span>
                  <span>{scannedSensor.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Asset:</span>
                  <span>{scannedSensor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span>{scannedSensor.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status:</span>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(scannedSensor.status)} {scannedSensor.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-500 p-6 text-center">
              <QrCode size={48} className="opacity-40" />
              <p className="text-xs">Choose a hardware target to scan from the selectors.</p>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Scan Target Selector */}
        <div className="flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Select Campus Hardware Asset QR
              </label>
              <select
                value={selectedSensorId}
                onChange={(e) => setSelectedSensorId(e.target.value)}
                disabled={scanning}
                className="w-full bg-slate-900/80 border border-brand-border text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 glass-input"
              >
                <option value="">-- Choose Asset Tag --</option>
                {sensors.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.type}] {s.name} - {s.location}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={!selectedSensorId || scanning}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <Camera size={14} />
              {scanning ? 'Reading tag...' : 'Simulate QR Scan'}
            </button>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-brand-border flex gap-3 text-xs text-slate-400 leading-relaxed">
            <FileText className="text-emerald-400 flex-shrink-0" size={16} />
            <p>
              In real deployment, scanning a SPNREC QR label automatically links users to:
              <br />
              <span className="text-white font-semibold">• Student:</span> Auto-fills coordinates and logs immediate maintenance tickets.
              <br />
              <span className="text-white font-semibold">• Staff:</span> Loads full device logs and maintenance repair histories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QrScannerMock;
