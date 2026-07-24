import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Droplets, Zap, MapPin, Bot, Camera, Radio, 
  BarChart3, Award, Cloud, ChevronRight, ChevronLeft, CheckCircle2, 
  Sparkles, Activity, ShieldCheck, ArrowRight, X, 
  Cpu, Globe, Layers, Layers3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

interface FeatureNode {
  id: number;
  title: string;
  category: string;
  icon: React.ReactNode;
  shortDesc: string;
  detail: string;
  statValue: string;
  statLabel: string;
  accentColor: string; // Tailwind class
  borderColor: string;
  bgGlow: string;
  tags: string[];
  animationType: 'waste' | 'water' | 'energy' | 'gis' | 'ai' | 'vision' | 'iot' | 'analytics' | 'rewards' | 'cloud';
}

export const Features: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FeatureNode | null>(null);
  const [completedNodes, setCompletedNodes] = useState<number[]>([0, 1]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'roadmap' | 'grid'>('roadmap');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Vision AI Scanner simulator state
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerResult, setScannerResult] = useState<string | null>(null);

  // Handle Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  const featureNodes: FeatureNode[] = [
    {
      id: 0,
      title: "Smart Waste Monitoring",
      category: "Feature 1 • Waste AI",
      icon: <Trash2 size={26} />,
      shortDesc: "Ultrasonic sensors & computer vision categorize bin fill capacity in real-time.",
      detail: "Deployed across SPNREC hostels and academic yards. Ultrasonic sensors broadcast waste level % to facilities, auto-triggering pickup routes when capacity hits 85%.",
      statValue: "94% Fill",
      statLabel: "CSE Yard Warning",
      accentColor: "emerald",
      borderColor: "border-emerald-500/50",
      bgGlow: "from-emerald-500/20 to-lime-500/10",
      tags: ["Ultrasonic Sensor", "Overflow Detection", "AI Classification", "Live Dispatches"],
      animationType: 'waste'
    },
    {
      id: 1,
      title: "Smart Water Monitoring",
      category: "Feature 2 • Water Telemetry",
      icon: <Droplets size={26} />,
      shortDesc: "Flow pressure sensors & continuous leak detectors guard hostel overhead tanks.",
      detail: "Measures water reserves in hostel overhead tanks and dispatches alerts if continuous flow pipe leaks are detected, saving 45,200 Liters of water monthly.",
      statValue: "45,200 L",
      statLabel: "Recycled Water",
      accentColor: "sky",
      borderColor: "border-sky-500/50",
      bgGlow: "from-sky-500/20 to-teal-500/10",
      tags: ["Water Tanks", "Flow Sensors", "Leak Detection", "Consumption Analytics"],
      animationType: 'water'
    },
    {
      id: 2,
      title: "Solar & Energy Monitoring",
      category: "Feature 3 • Renewable Energy",
      icon: <Zap size={26} />,
      shortDesc: "Aggregates 250kW solar PV array output vs campus power grid load.",
      detail: "Tracks real-time kilowatt inverter output across SPNREC rooftop panels, automatically optimizing HVAC and lighting grid distribution for +12% efficiency.",
      statValue: "185.4 kW",
      statLabel: "Current Solar Yield",
      accentColor: "amber",
      borderColor: "border-amber-500/50",
      bgGlow: "from-amber-500/20 to-yellow-500/10",
      tags: ["Solar PV Array", "250kW Grid", "Power Analytics", "Carbon Offset"],
      animationType: 'energy'
    },
    {
      id: 3,
      title: "GIS Campus Smart Radar",
      category: "Feature 4 • Spatial Intelligence",
      icon: <MapPin size={26} />,
      shortDesc: "Interactive 3D GIS campus radar mapping defect heatmaps & maintenance routes.",
      detail: "Renders exact GPS coordinates of reported incidents on a high-precision spatial map, assigning nearest staff responders with step-by-step route guidance.",
      statValue: "26.1989 N",
      statLabel: "SPNREC Radar Coordinates",
      accentColor: "teal",
      borderColor: "border-teal-500/50",
      bgGlow: "from-teal-500/20 to-emerald-500/10",
      tags: ["3D Map", "Heatmap", "Live GPS", "Route Guidance"],
      animationType: 'gis'
    },
    {
      id: 4,
      title: "GreenBot AI Copilot",
      category: "Feature 5 • Conversational AI",
      icon: <Bot size={26} />,
      shortDesc: "Glassmorphic AI assistant supporting voice commands, photo diagnostics, & chat.",
      detail: "Powered by Gemini AI. Accepts voice audio reports, answers environmental queries, and guides students to green reward leaderboards in multiple languages.",
      statValue: "< 1.2s",
      statLabel: "AI Response Speed",
      accentColor: "emerald",
      borderColor: "border-emerald-400/50",
      bgGlow: "from-emerald-500/30 to-lime-500/10",
      tags: ["Gemini AI", "Voice Speech", "Photo Diagnosis", "Multilingual"],
      animationType: 'ai'
    },
    {
      id: 5,
      title: "AI Vision Defect Scan",
      category: "Feature 6 • Computer Vision",
      icon: <Camera size={26} />,
      shortDesc: "Scans uploaded photos to detect garbage, water leaks, & electrical faults.",
      detail: "Neural vision model analyzes uploaded student photos, draws bounding box defect detections, assigns 98.4% confidence scores, and auto-categorizes priority.",
      statValue: "98.4%",
      statLabel: "Vision Accuracy",
      accentColor: "lime",
      borderColor: "border-lime-500/50",
      bgGlow: "from-lime-500/20 to-emerald-500/10",
      tags: ["Bounding Box", "Defect Detection", "Auto Priority", "Confidence Score"],
      animationType: 'vision'
    },
    {
      id: 6,
      title: "IoT Sensor Mesh Network",
      category: "Feature 7 • Hardware Telemetry",
      icon: <Radio size={26} />,
      shortDesc: "ESP32 edge microcontrollers broadcasting PM2.5, AQI, pressure, & load 24/7.",
      detail: "Distributed mesh of ESP32 and Arduino edge nodes continuously streaming environmental telemetry to Supabase real-time webhooks with offline fallback.",
      statValue: "12 Nodes",
      statLabel: "Active Sensor Mesh",
      accentColor: "cyan",
      borderColor: "border-cyan-500/50",
      bgGlow: "from-cyan-500/20 to-sky-500/10",
      tags: ["ESP32 Edge", "AQI PM2.5", "Pressure Telemetry", "Realtime Webhooks"],
      animationType: 'iot'
    },
    {
      id: 7,
      title: "Executive Sustainability HUD",
      category: "Feature 8 • Management Analytics",
      icon: <BarChart3 size={26} />,
      shortDesc: "Live glass KPI widgets monitoring net-zero compliance & Microsoft ESG scores.",
      detail: "Aggregates university-wide environmental data into executive visual charts—computing weekly carbon offsets, waste diversion rates, and net-zero indexes.",
      statValue: "8.2 / 10",
      statLabel: "Net-Zero Index",
      accentColor: "indigo",
      borderColor: "border-indigo-500/50",
      bgGlow: "from-indigo-500/20 to-emerald-500/10",
      tags: ["ESG Audit", "Net-Zero Index", "Live Charts", "Carbon Offsets"],
      animationType: 'analytics'
    },
    {
      id: 8,
      title: "Green Rewards & Gamification",
      category: "Feature 9 • Student Incentive",
      icon: <Award size={26} />,
      shortDesc: "Leaderboards, eco-points, & digital badges rewarding verified green acts.",
      detail: "Students earn +50 Eco-Points for verified plastic recycling or leakage reporting, unlocking campus library perks and Sustainability Leaderboard trophies.",
      statValue: "#1 Rank",
      statLabel: "Ramesh Prasad (1,450 pts)",
      accentColor: "amber",
      borderColor: "border-amber-400/50",
      bgGlow: "from-amber-500/30 to-lime-500/10",
      tags: ["Eco-Points", "Leaderboard", "Verified Badges", "Library Perks"],
      animationType: 'rewards'
    },
    {
      id: 9,
      title: "Cloud Edge Infrastructure",
      category: "Feature 10 • Backend Engine",
      icon: <Cloud size={26} />,
      shortDesc: "Supabase PostgreSQL, row-level security, realtime channels, & edge functions.",
      detail: "Enterprise cloud stack powering instantaneous websocket notifications, encrypted authentication, RLS policy isolation, and automated database backups.",
      statValue: "99.99%",
      statLabel: "Cloud Uptime",
      accentColor: "emerald",
      borderColor: "border-emerald-500/50",
      bgGlow: "from-emerald-500/25 to-teal-500/10",
      tags: ["Supabase DB", "Realtime WebSockets", "RLS Isolation", "Edge Sync"],
      animationType: 'cloud'
    }
  ];

  const techStack = [
    { name: "React 19", color: "text-cyan-400", border: "border-cyan-500/30" },
    { name: "Vite 8", color: "text-emerald-400", border: "border-emerald-500/30" },
    { name: "Tailwind CSS", color: "text-teal-400", border: "border-teal-500/30" },
    { name: "Supabase DB", color: "text-emerald-300", border: "border-emerald-400/30" },
    { name: "Leaflet GIS", color: "text-lime-400", border: "border-lime-500/30" },
    { name: "Gemini AI", color: "text-sky-400", border: "border-sky-500/30" },
    { name: "Framer Motion", color: "text-amber-400", border: "border-amber-500/30" },
    { name: "GSAP", color: "text-green-400", border: "border-green-500/30" },
    { name: "Three.js", color: "text-indigo-400", border: "border-indigo-500/30" },
    { name: "Node.js", color: "text-emerald-400", border: "border-emerald-500/30" }
  ];

  const roadmapTimeline = [
    { phase: "Phase 1", title: "Research & Design", status: "Completed", date: "Q1 2026" },
    { phase: "Phase 2", title: "IoT Prototype Test", status: "Completed", date: "Q2 2026" },
    { phase: "Phase 3", title: "AI Vision Training", status: "Completed", date: "Q2 2026" },
    { phase: "Phase 4", title: "SPNREC Pilot Launch", status: "Active Live", date: "Q3 2026" },
    { phase: "Phase 5", title: "District Colleges", status: "Upcoming", date: "Q4 2026" },
    { phase: "Phase 6", title: "Engineering Colleges", status: "Upcoming", date: "Q1 2027" },
    { phase: "Phase 7", title: "National Campus Mesh", status: "Vision 2027", date: "2027+" }
  ];

  // Scroll horizontal container
  const scrollRoadmap = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNodeClick = (node: FeatureNode) => {
    setSelectedNode(node);
    if (!completedNodes.includes(node.id)) {
      setCompletedNodes(prev => [...prev, node.id]);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const runVisionScanSim = () => {
    setScannerActive(true);
    setScannerResult(null);
    setTimeout(() => {
      setScannerActive(false);
      setScannerResult("Waste Overflow Detected • Priority: HIGH • Confidence: 98.4%");
    }, 2200);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="w-full min-h-screen bg-[#08120D] text-[#F8FAFC] flex flex-col font-sans overflow-x-hidden relative"
    >
      
      {/* Background Campus Backdrop Image Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none mix-blend-luminosity z-0"
        style={{ backgroundImage: 'url(/campus_bg.jpg)' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#08120D]/60 via-[#08120D]/90 to-[#08120D] pointer-events-none z-0" />

      {/* Floating Volumetric Lighting Flares */}
      <div 
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b from-emerald-500/20 via-lime-500/10 to-transparent rounded-full blur-[150px] pointer-events-none z-0"
        style={{
          transform: `translate(-50%, ${mousePos.y * 0.5}px)`
        }}
      />

      {/* ==================================================
          1. HEADER & CENTERPIECE: 3D EARTH CORE HUD
         ================================================== */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono tracking-wider shadow-2xl backdrop-blur-md mb-6"
        >
          <Sparkles size={14} className="text-lime-400 animate-spin-slow" />
          <span>Interactive 3D Sustainability Ecosystem</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-center text-white tracking-tight leading-[1.1] max-w-4xl"
        >
          Explore the <span className="text-gradient-eco">GreenVerse AI</span> Ecosystem
        </motion.h1>

        <p className="text-sm sm:text-base text-slate-300 text-center max-w-2xl mt-3 font-medium">
          Take a cinematic 3D journey through our integrated AI, IoT telemetry, GIS mapping, and renewable energy features.
        </p>

        {/* Centerpiece AI Control Matrix HUD Emblem (Without Rotating Earth) */}
        <div className="relative w-full max-w-md aspect-square mt-10 flex items-center justify-center">
          {/* Rotating Holographic Rings */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-spin-slow pointer-events-none" />
          <div className="absolute inset-4 rounded-full border border-dashed border-lime-500/30 animate-reverse-spin pointer-events-none" />
          
          {/* Glowing Top Center Badge */}
          <div className="absolute -top-4 glass-card px-4 py-2 rounded-2xl border border-emerald-400/50 text-xs font-mono text-emerald-300 font-extrabold shadow-2xl backdrop-blur-xl flex items-center gap-2 z-20">
            <Cpu size={16} className="text-lime-400 animate-pulse" />
            <span>GreenVerse AI Core v4.2</span>
          </div>

          {/* AI Control Matrix Centerpiece Box */}
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative border border-white/20 glass-card bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center gap-4">
            
            {/* Official Logo Display */}
            <div className="h-20 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-xl animate-float">
              <img src="/logo.png" alt="GreenVerse AI Logo" className="h-16 w-auto object-contain" />
            </div>

            <div className="flex flex-col gap-1 z-10">
              <h3 className="font-display font-extrabold text-2xl text-white">Smart Campus Platform</h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">12 Active IoT Sensor Nodes • SPNREC</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full text-[10px] font-mono text-emerald-300 z-10">
              <div className="glass-card p-2 rounded-xl border border-white/10 text-center">
                ☀️ 185.4 kW Solar
              </div>
              <div className="glass-card p-2 rounded-xl border border-white/10 text-center">
                💧 45,200 L Water
              </div>
              <div className="glass-card p-2 rounded-xl border border-white/10 text-center">
                🗑️ 94% Fill Alert
              </div>
              <div className="glass-card p-2 rounded-xl border border-white/10 text-center">
                🌿 9.8T Carbon Offset
              </div>
            </div>
          </div>

          {/* Bottom Ambient HUD Badge */}
          <div className="absolute -bottom-4 glass-card px-4 py-2 rounded-2xl border border-sky-400/50 text-xs font-mono text-sky-300 font-extrabold shadow-2xl backdrop-blur-xl flex items-center gap-2 z-20">
            <Activity size={16} className="text-sky-400 animate-pulse" />
            <span>Realtime Stream Active</span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-3 mt-12 bg-white/5 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md z-20">
          <button 
            onClick={() => setViewMode('roadmap')}
            className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'roadmap' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers3 size={16} /> 3D Horizontal Roadmap Flow
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={16} /> 3D Matrix Card View
          </button>
        </div>

      </section>

      {/* ==================================================
          2. HORIZONTAL 3D ROADMAP / GRID MATRIX SECTION
         ================================================== */}
      <section className="relative py-12 px-6 md:px-12 w-full z-10">
        
        {viewMode === 'roadmap' ? (
          /* ==========================================
             A. HORIZONTAL 3D ROADMAP FLOW
             ========================================== */
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            
            {/* Scroll Navigation Controls */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Drag or Scroll Horizontal Timeline (Features 1 - 10)</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => scrollRoadmap('left')}
                  className="w-10 h-10 rounded-xl glass-card border border-white/20 text-white hover:border-emerald-400 flex items-center justify-center cursor-pointer transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => scrollRoadmap('right')}
                  className="w-10 h-10 rounded-xl glass-card border border-white/20 text-white hover:border-emerald-400 flex items-center justify-center cursor-pointer transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Track */}
            <div 
              ref={scrollContainerRef}
              className="w-full overflow-x-auto pb-10 pt-4 scrollbar-none flex gap-8 items-center snap-x cursor-grab active:cursor-grabbing relative"
            >
              {featureNodes.map((node, index) => {
                const isCompleted = completedNodes.includes(node.id);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div key={node.id} className="flex items-center flex-shrink-0 snap-center">
                    
                    {/* Feature Node Card */}
                    <motion.div
                      whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() => handleNodeClick(node)}
                      className={`w-[340px] sm:w-[380px] glass-card glass-card-interactive p-6 rounded-3xl border ${node.borderColor} flex flex-col gap-5 relative bg-gradient-to-b ${node.bgGlow} shadow-2xl cursor-pointer ${
                        isSelected ? 'ring-2 ring-emerald-400 shadow-emerald-500/20' : ''
                      }`}
                    >
                      {/* Node Header Row */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                          {node.category}
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/40">
                            <CheckCircle2 size={12} className="text-emerald-400" /> Done
                          </span>
                        )}
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg backdrop-blur-md">
                          {node.icon}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-display font-extrabold text-xl text-white tracking-tight leading-snug">
                            {node.title}
                          </h3>
                          <span className="text-xs text-slate-300 font-medium line-clamp-2 mt-1">
                            {node.shortDesc}
                          </span>
                        </div>
                      </div>

                      {/* Live Statistic HUD Pill */}
                      <div className="glass-card p-3.5 rounded-2xl border border-white/15 flex items-center justify-between bg-white/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">{node.statLabel}</span>
                          <span className="font-display font-extrabold text-lg text-white">{node.statValue}</span>
                        </div>
                        <button 
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-[11px] transition shadow flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {node.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Glowing Connector Pipe to Next Node */}
                    {index < featureNodes.length - 1 && (
                      <div className="w-16 flex items-center justify-center relative">
                        <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-lime-500 opacity-60 rounded-full animate-pulse" />
                        <div className="absolute w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* ==========================================
             B. 3D MATRIX GRID VIEW
             ========================================== */
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureNodes.map((node) => {
              const isCompleted = completedNodes.includes(node.id);
              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.03, y: -6 }}
                  onClick={() => handleNodeClick(node)}
                  className={`glass-card glass-card-interactive p-6 rounded-3xl border ${node.borderColor} flex flex-col gap-4 relative bg-gradient-to-b ${node.bgGlow} shadow-2xl cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {node.category}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                      {node.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-white">{node.title}</h3>
                      <span className="text-xs text-slate-300 font-medium">{node.shortDesc}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
                    <span>{node.statLabel}: {node.statValue}</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </section>

      {/* ==================================================
          3. RIGHT FLOATING HUD METRICS & TECH STACK CHIPS
         ================================================== */}
      <section className="relative py-12 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Floating Technology Stack Chips */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <Cpu size={16} /> Technology Stack Architecture
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Built with Next-Generation Enterprise Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            GreenVerse utilizes high-performance web frameworks, real-time database webhooks, geospatial radar GIS components, and Gemini AI vision models.
          </p>

          {/* Tech Stack Chips Grid */}
          <div className="flex flex-wrap gap-3 mt-2">
            {techStack.map((tech, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`glass-card px-4 py-2.5 rounded-xl border ${tech.border} font-mono text-xs font-bold ${tech.color} backdrop-blur-md shadow-lg flex items-center gap-2 cursor-pointer`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Live System Metrics Floating HUD Panel */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 rounded-3xl border border-white/20 flex flex-col gap-5 shadow-2xl bg-gradient-to-b from-white/10 to-white/5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                <h3 className="font-display font-extrabold text-base text-white">Live System Metrics HUD</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-sans">
              <div className="glass-card p-3 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">AI Defect Accuracy</span>
                <span className="font-display font-extrabold text-2xl text-white">95%</span>
                <span className="text-[9px] text-emerald-400 font-medium">Verified by Vision Model</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Energy Saved</span>
                <span className="font-display font-extrabold text-2xl text-lime-400">40%</span>
                <span className="text-[9px] text-slate-300 font-medium">Vs Grid Utility Baseline</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Water Saved</span>
                <span className="font-display font-extrabold text-2xl text-sky-400">35%</span>
                <span className="text-[9px] text-slate-300 font-medium">Continuous Leak Audits</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-white/10 flex flex-col">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Waste Managed</span>
                <span className="font-display font-extrabold text-2xl text-emerald-400">50%</span>
                <span className="text-[9px] text-slate-300 font-medium">Smart Bin Dispatches</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
              <span>Resolution Speed: 90% Faster</span>
              <span>12 IoT Nodes</span>
            </div>
          </div>
        </div>

      </section>

      {/* ==================================================
          4. BOTTOM INTERACTIVE TIMELINE / ROADMAP
         ================================================== */}
      <section className="relative py-16 px-6 md:px-12 max-w-7xl mx-auto w-full z-10 flex flex-col gap-10">
        
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Globe size={14} /> Deployment Roadmap
          </span>
          <h2 className="font-display font-extrabold text-3xl text-white">Scaling Smart Campuses Across India</h2>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {roadmapTimeline.map((item, idx) => (
            <div 
              key={idx} 
              className={`glass-card p-4 rounded-2xl border flex flex-col gap-2 relative ${
                item.status === 'Active Live' 
                  ? 'border-emerald-400/60 bg-emerald-950/40 shadow-lg shadow-emerald-950/50' 
                  : 'border-white/10'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">{item.phase}</span>
              <h4 className="font-display font-bold text-xs text-white leading-tight">{item.title}</h4>
              <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>{item.date}</span>
                <span className={item.status === 'Active Live' ? 'text-emerald-300 font-bold' : ''}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ==================================================
          5. INTERACTIVE NODE INSPECTION MODAL
         ================================================== */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl glass-card p-8 rounded-3xl border border-white/20 flex flex-col gap-6 shadow-2xl relative bg-[#08120D] bg-gradient-to-b from-white/10 to-white/5"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  {selectedNode.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    {selectedNode.category}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-white">{selectedNode.title}</h3>
                </div>
              </div>

              {/* Detailed Content */}
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {selectedNode.detail}
              </p>

              {/* Live Interactive Simulator Panel */}
              <div className="glass-card p-4 rounded-2xl border border-white/15 flex flex-col gap-3 bg-white/5">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>Live Telemetry Simulator</span>
                  <span>{selectedNode.statLabel}: {selectedNode.statValue}</span>
                </div>

                {selectedNode.animationType === 'vision' ? (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={runVisionScanSim}
                      disabled={scannerActive}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Camera size={14} />
                      <span>{scannerActive ? 'Scanning Neural Bounding Boxes...' : 'Run Vision Diagnostic Scan'}</span>
                    </button>
                    {scannerResult && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold text-center">
                        {scannerResult}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 font-mono flex items-center justify-between">
                    <span>Status: OPERATIONAL</span>
                    <span className="text-emerald-400 font-bold">100% REALTIME SYNC</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs font-mono text-slate-400">Node ID: #{selectedNode.id + 1} of 10</span>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-display font-bold text-xs px-6 py-3 rounded-xl transition shadow flex items-center gap-2"
                >
                  <span>Launch Campus Portal</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Features;
