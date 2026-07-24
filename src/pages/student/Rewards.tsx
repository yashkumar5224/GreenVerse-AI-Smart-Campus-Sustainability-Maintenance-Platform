import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { Award, Gift, Sparkles, Download, BadgeCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Rewards: React.FC = () => {
  const { user, addPoints } = useStore();
  const [showCertificate, setShowCertificate] = useState(false);
  const [redeemedCoupon, setRedeemedCoupon] = useState<string | null>(null);

  const rewardsShop = [
    { id: 'r-01', name: 'Canteen Coffee Coupon', cost: 50, desc: 'Free organic coffee at the SPNREC Dining block' },
    { id: 'r-02', name: 'Premium Stationary Kit', cost: 100, desc: 'Eco-friendly recycled notebook and bamboo pen' },
    { id: 'r-03', name: 'SPNREC Eco Warrior T-Shirt', cost: 200, desc: '100% organic cotton campus green shirt' },
    { id: 'r-04', name: 'Canteen Special Lunch Coupon', cost: 250, desc: 'Free deluxe lunch meal voucher' }
  ];

  const handleRedeem = (cost: number, name: string) => {
    if (!user?.id) {
      alert('Session expired. Please log in again.');
      return;
    }
    if ((user?.points || 0) < cost) {
      alert("Insufficient Eco-points! Report more campus issues to earn points.");
      return;
    }
    
    // Deduct points (add negative points)
    addPoints(user.id, -cost, `Redeemed ${name}`);
    
    // Generate mock coupon code
    const couponCode = 'SPNREC-ECO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setRedeemedCoupon(couponCode);
    
    // Pop confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleGenerateCertificate = () => {
    setShowCertificate(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">Green Rewards Shop & Badges</h2>
          <p className="text-xs text-slate-400">Redeem points for college coupons, view your badges, or generate your ESG certification.</p>
        </div>
        
        {/* Points Display */}
        <div className="bg-emerald-950/50 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">My Balance</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{user?.points || 0} pts</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1 & 2: Rewards Shop */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
            <Gift size={16} className="text-emerald-400" /> Vouchers & Rewards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewardsShop.map(reward => {
              const affordable = (user?.points || 0) >= reward.cost;
              return (
                <div key={reward.id} className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-900/40 px-2 py-0.5 rounded self-start">
                      {reward.cost} Eco-Points
                    </span>
                    <h4 className="font-display font-bold text-xs text-slate-200 mt-1">{reward.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{reward.desc}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward.cost, reward.name)}
                    disabled={!affordable}
                    className={`w-full font-bold text-xs py-2 rounded-xl border transition ${
                      affordable 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/20 cursor-pointer' 
                        : 'bg-slate-900 text-slate-600 border-brand-border cursor-not-allowed'
                    }`}
                  >
                    Redeem Voucher
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 3: Badges & Certificates */}
        <div className="flex flex-col gap-6">
          {/* Badge Display */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <Award size={16} className="text-emerald-400" /> Active Badges
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-brand-border">
                <BadgeCheck className="text-emerald-400 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Eco Novice</h4>
                  <p className="text-[10px] text-slate-500">Unlocked upon registration (+10 pts)</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                (user?.points || 0) >= 150 
                  ? 'bg-slate-900/50 border-brand-border text-slate-200' 
                  : 'bg-slate-950/20 border-brand-border/40 text-slate-600 opacity-50'
              }`}>
                <BadgeCheck className={(user?.points || 0) >= 150 ? "text-cyan-400 flex-shrink-0" : "text-slate-600 flex-shrink-0"} size={24} />
                <div>
                  <h4 className="text-xs font-bold">Green Warrior</h4>
                  <p className="text-[10px] text-slate-500">Requires 150 points to unlock</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                (user?.points || 0) >= 300 
                  ? 'bg-slate-900/50 border-brand-border text-slate-200' 
                  : 'bg-slate-950/20 border-brand-border/40 text-slate-600 opacity-50'
              }`}>
                <BadgeCheck className={(user?.points || 0) >= 300 ? "text-amber-400 flex-shrink-0" : "text-slate-600 flex-shrink-0"} size={24} />
                <div>
                  <h4 className="text-xs font-bold">Eco Champion</h4>
                  <p className="text-[10px] text-slate-500">Requires 300 points to unlock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate generation widget */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4 text-center">
            <h4 className="font-display font-bold text-sm text-white">SPNREC ESG Certificate</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Earn an official college-signed sustainability certification showing your green contribution records.
            </p>
            <button
              onClick={handleGenerateCertificate}
              className="bg-slate-900 hover:bg-slate-800 border border-brand-border text-slate-300 font-semibold text-xs py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download size={12} />
              Generate Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {redeemedCoupon && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="w-full max-w-sm glass-panel p-6 rounded-2xl border border-brand-border text-center flex flex-col gap-4 relative">
            <h3 className="font-display font-bold text-base text-white">Voucher Claimed Successfully!</h3>
            <p className="text-xs text-slate-400">Present this unique code at the college canteen or administration desk to receive your reward.</p>
            <div className="bg-slate-900 border border-brand-border p-3.5 rounded-xl text-emerald-400 font-mono font-bold tracking-widest text-lg">
              {redeemedCoupon}
            </div>
            <button
              onClick={() => setRedeemedCoupon(null)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ESG Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="w-full max-w-2xl bg-amber-50 border-[8px] border-amber-900 p-8 rounded-lg shadow-2xl text-slate-950 relative flex flex-col gap-6 text-center font-serif">
            
            {/* Close */}
            <button 
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 bg-amber-900 text-amber-50 rounded-full p-1 cursor-pointer font-sans"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="flex flex-col gap-1 border-b border-amber-900/35 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900">Bihar Engineering University</span>
              <h2 className="text-xl font-bold text-amber-950 font-display">Shri Phanishwar Nath Renu Engineering College (SPNREC)</h2>
              <span className="text-[10px] text-slate-600 italic">Simraha, Araria, Bihar, India</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-amber-950">Certificate of Green Excellence</span>
              <p className="text-xs text-slate-500">This certifies that student</p>
              <h3 className="text-2xl font-bold font-sans text-amber-900 italic border-b border-slate-300 w-fit mx-auto px-6 py-1">
                {user?.name || 'Aarav Singh'}
              </h3>
              <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed mt-2">
                has successfully registered and completed sustainable tasks including water waste audits, recycling collections, and campus telemetry reporting. Cumulatively contributing to campus carbon offset goals.
              </p>
            </div>

            <div className="flex justify-between items-end mt-6 text-[10px] font-sans border-t border-amber-900/35 pt-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[9px] text-slate-500">POINTS EARNED</span>
                <span className="font-mono font-bold text-amber-950">{user?.points || 0} Eco-points</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full border border-amber-950 flex items-center justify-center bg-amber-200/50 text-amber-900 font-bold text-[8px] font-mono shadow-inner rotate-12">
                  SPNREC
                </div>
                <span className="text-[7px] text-slate-500 uppercase tracking-widest font-mono">Official Seal</span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-slate-900 italic underline">Dr. Yashasvi Raj</span>
                <span className="text-[8px] text-slate-500 uppercase font-mono tracking-wider">Campus Principal</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-4 bg-amber-900 hover:bg-amber-950 text-amber-50 font-bold text-xs py-2 px-6 rounded-lg self-center font-sans cursor-pointer transition shadow"
            >
              Print Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Rewards;
