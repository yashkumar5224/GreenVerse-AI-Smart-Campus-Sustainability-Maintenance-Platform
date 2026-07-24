import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { supabase } from '../../services/supabaseClient';
import { ShieldCheck, RefreshCw, Send, CheckCircle2, Sliders, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsPage: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const [sent, setSent] = useState(false);
  const [simInterval, setSimInterval] = useState(10); // seconds

  const handleResetData = () => {
    if (confirm("This will clear all changes and restore original database records. Proceed?")) {
      localStorage.clear();
      // Re-initialize tables
      window.location.reload();
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    const newNotif = {
      user_id: 'u-all',
      title: 'Official Campus Announcement',
      message: announcement,
      read: false,
      type: 'INFO'
    };

    try {
      await supabase.from('notifications').insert([newNotif]);
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err);
      const notifs = JSON.parse(localStorage.getItem('gv_notifications') || '[]');
      const localNotif = {
        ...newNotif,
        id: 'n-ann-' + Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString()
      };
      localStorage.setItem('gv_notifications', JSON.stringify([localNotif, ...notifs]));
    }

    useStore.getState().fetchNotifications();

    setAnnouncement('');
    setSent(true);
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 }
    });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-3xl mx-auto flex flex-col gap-8 animate-slide-up">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-white">System Configuration</h2>
        <p className="text-xs text-slate-400">Configure campus IoT alert thresholds, post announcements, and manage backend states.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Settings panel 1: Simulator */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-brand-border pb-3">
            <Sliders size={16} className="text-cyan-400" /> IoT Telemetry Parameters
          </h3>

          <div className="flex flex-col gap-4 text-xs font-semibold">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-slate-200">Simulation Refresh Interval</h4>
                <p className="text-[10px] text-slate-500 font-medium">Secs between telemetry updates</p>
              </div>
              <input
                type="number"
                value={simInterval}
                onChange={(e) => setSimInterval(Number(e.target.value))}
                className="bg-slate-900 border border-brand-border text-center rounded-lg w-20 py-1.5 text-white"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-slate-200">Threshold Warning Limit</h4>
                <p className="text-[10px] text-slate-500 font-medium">Water level / bin alert triggers</p>
              </div>
              <span className="text-emerald-400 font-mono text-[11px]">80% Trigger</span>
            </div>
          </div>
        </div>

        {/* Settings panel 2: Broadcast */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-brand-border pb-3">
            <MessageSquare size={16} className="text-emerald-400" /> Post Campus Broadcast
          </h3>

          {sent ? (
            <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-xl flex gap-2.5 text-xs text-emerald-400 items-start">
              <CheckCircle2 size={16} className="mt-0.5" />
              <div>
                <h5 className="font-bold">Broadcast Dispatched</h5>
                <p className="text-[10px] text-slate-400 mt-1">
                  Sent to all registered accounts and dashboard timelines.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAnnouncementSubmit} className="flex flex-col gap-3">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Announcement Text</label>
              <textarea
                rows={3}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Alert student body about clean drives or maintenance blocks..."
                required
                className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input resize-none"
              />
              <button
                type="submit"
                className="self-end bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Send size={12} /> Post Announcement
              </button>
            </form>
          )}
        </div>

        {/* Settings panel 3: System reset */}
        <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5 border-b border-brand-border pb-3">
            <ShieldCheck size={16} className="text-red-400" /> Maintenance & Reset Tools
          </h3>
          
          <div className="flex justify-between items-center text-xs">
            <div>
              <h4 className="text-slate-200">Reinitialize Database</h4>
              <p className="text-[10px] text-slate-500 font-medium">Deletes local storage changes and resets original seed records</p>
            </div>
            <button
              onClick={handleResetData}
              className="bg-red-950 border border-red-900 hover:bg-red-900 hover:border-red-700 text-red-400 hover:text-white font-bold text-[10px] px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={12} /> Reset Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
