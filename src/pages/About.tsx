import React from 'react';
import { ShieldCheck, BookOpen, Compass, Award, Globe, Sparkles, Building2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#08120D] pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto flex flex-col gap-16 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <Building2 size={14} /> Institutional Context
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Shri Phanishwar Nath Renu Engineering College
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
          Established in 2019 under the Department of Science, Technology & Technical Education, Government of Bihar, and affiliated with Bihar Engineering University (BEU), Patna.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="glass-card p-8 border border-white/15 flex flex-col gap-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Building2 size={24} />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">Campus Infrastructure Profile</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            SPNREC Araria is dedicated to providing high-quality technical education across core engineering disciplines: Civil, Mechanical, Electrical, Computer Science, and Electronics Engineering.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Our campus serves as a living laboratory for green technologies—integrating 250kW solar photovoltaic arrays, rainwater harvesting systems, and automated IoT sensor monitoring.
          </p>
        </div>

        <div className="glass-card p-8 border border-white/15 flex flex-col gap-5">
          <div className="w-12 h-12 rounded-2xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400">
            <Sparkles size={24} />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">GreenVerse Applied AI Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            GreenVerse was developed for the <strong>1M1B Applied AI & Green Skills Initiative</strong>. It automates campus maintenance, monitors resource waste, and rewards students for environmental actions.
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-xs font-mono text-emerald-300 mt-2">
            <div className="flex items-center gap-2 glass-card p-3 border border-white/10">
              <ShieldCheck size={14} className="text-emerald-400" /> Clean Campus
            </div>
            <div className="flex items-center gap-2 glass-card p-3 border border-white/10">
              <BookOpen size={14} className="text-lime-400" /> Digital Library
            </div>
            <div className="flex items-center gap-2 glass-card p-3 border border-white/10">
              <Compass size={14} className="text-teal-400" /> IoT Network
            </div>
            <div className="flex items-center gap-2 glass-card p-3 border border-white/10">
              <Award size={14} className="text-amber-400" /> Eco Rewards
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Alignment SDGs */}
      <div className="flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Globe size={14} /> Global Impact
          </span>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">United Nations Sustainable Development Goals</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 border border-amber-500/30 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-amber-400">SDG 7</span>
            <h4 className="font-display font-bold text-base text-white">Clean Energy</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Monitors solar generation arrays at SPNREC to maximize clean renewable energy usage.
            </p>
          </div>
          <div className="glass-card p-6 border border-teal-500/30 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-teal-400">SDG 9</span>
            <h4 className="font-display font-bold text-base text-white">Industry & Innovation</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Deploys IoT edge sensors and spatial GIS mapping for intelligent infrastructure.
            </p>
          </div>
          <div className="glass-card p-6 border border-emerald-500/30 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-emerald-400">SDG 11</span>
            <h4 className="font-display font-bold text-base text-white">Sustainable Cities</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Tracks municipal waste bins, greywater levels, and air quality metrics 24/7.
            </p>
          </div>
          <div className="glass-card p-6 border border-lime-500/30 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-lime-400">SDG 12</span>
            <h4 className="font-display font-bold text-base text-white">Responsible Consumption</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Encourages plastic recycling and water conservation via gamified eco points.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
export default About;
