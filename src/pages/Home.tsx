import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GisMap from '../components/GisMap';
import { 
  Leaf, Sparkles, Brain, Map, Award, Zap, Droplets, ShieldCheck, 
  Trash2, Activity, Send, CheckCircle, ArrowRight, Play, 
  FileText, BookOpen, Layers, BarChart3, Sun, Radio,
  Globe, CheckCircle2, Mic, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'sdg'>('mission');
  const [demoChatInput, setDemoChatInput] = useState('');
  const [demoMessages, setDemoMessages] = useState([
    { sender: 'bot', text: 'Hello! I am GreenBot AI. How can I assist with your campus sustainability or maintenance today?' },
    { sender: 'user', text: 'Where is the nearest waste overflow alert?' },
    { sender: 'bot', text: 'Alert detected: Computer Science Department Yard Smart Bin is at 94% capacity. Ramesh Prasad has been dispatched.' }
  ]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [beforeAfterPos, setBeforeAfterPos] = useState(50);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoChatInput.trim()) return;
    const userText = demoChatInput;
    setDemoMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setDemoChatInput('');
    setTimeout(() => {
      setDemoMessages(prev => [
        ...prev, 
        { sender: 'bot', text: `GreenBot AI Analysis: Recorded inquiry regarding "${userText}". All IoT nodes in SPNREC Araria are operating normally.` }
      ]);
    }, 1000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      setNewsletterEmail('');
    }
  };

  const statistics = [
    { value: '100+', label: 'Campus Problems Solved', icon: <CheckCircle className="text-emerald-400" size={20} /> },
    { value: '95%', label: 'AI Accuracy', icon: <Brain className="text-teal-400" size={20} /> },
    { value: '40%', label: 'Energy Saved', icon: <Zap className="text-lime-400" size={20} /> },
    { value: '35%', label: 'Water Saved', icon: <Droplets className="text-sky-400" size={20} /> },
    { value: '50%', label: 'Waste Reduction', icon: <Trash2 className="text-amber-400" size={20} /> }
  ];

  const premiumFeatures = [
    { icon: <Trash2 className="text-emerald-400" size={24} />, title: "Smart Waste Monitoring", desc: "Ultrasonic depth sensors continuously measure bin fill levels to prevent litter spillage." },
    { icon: <Droplets className="text-sky-400" size={24} />, title: "Water Quality & Leakage", desc: "Flow and pressure telemetry nodes instantly trigger alerts for underground pipe leaks." },
    { icon: <Zap className="text-lime-400" size={24} />, title: "Solar & Grid Telemetry", desc: "Monitors peak photovoltaic yield from the 250kW solar array vs main campus grid usage." },
    { icon: <ImageIcon className="text-amber-400" size={24} />, title: "AI Defect Image Recognition", desc: "Computer vision analyzes uploaded photo logs to classify failure types automatically." },
    { icon: <Brain className="text-emerald-400" size={24} />, title: "GreenBot Conversational AI", desc: "Multilingual copilot answers sustainability questions and logs student issues via chat." },
    { icon: <Activity className="text-teal-400" size={24} />, title: "Predictive Maintenance", desc: "Machine learning forecasts equipment decay rates to replace parts before outages occur." },
    { icon: <Map className="text-cyan-400" size={24} />, title: "GIS Campus Smart Mapping", desc: "Leaflet spatial overlays track building health, solar panels, and active responder pins." },
    { icon: <Radio className="text-lime-400" size={24} />, title: "IoT Sensor Telemetry Network", desc: "Multi-node mesh network collecting PM2.5 AQI, temperature, and power metrics 24/7." },
    { icon: <FileText className="text-emerald-400" size={24} />, title: "Complaint Management", desc: "Complete ticket lifecycle management with photo verification and dispatch routing." },
    { icon: <BarChart3 className="text-sky-400" size={24} />, title: "Executive Analytics Dashboard", desc: "Live glass widgets displaying real-time sustainability scores and carbon offsets." },
    { icon: <Leaf className="text-emerald-400" size={24} />, title: "Carbon Footprint Ledger", desc: "Microsoft ESG-aligned auditing framework calculating weekly carbon reductions." },
    { icon: <Award className="text-amber-400" size={24} />, title: "Green Rewards & Gamification", desc: "Eco leaderboards and badges rewarding students for verified environmental actions." },
    { icon: <BookOpen className="text-teal-400" size={24} />, title: "Digital Smart Library", desc: "Monitors reading room ambient climate control and provides green research papers." }
  ];

  return (
    <div className="w-full bg-[#08120D] text-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      
      {/* ==================================================
          1. CINEMATIC HERO SECTION
         ================================================== */}
      <section className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col justify-center items-center overflow-hidden">
        {/* Volumetric Sunlight Flare & Ambient Fog */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/20 via-lime-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Matching Cinematic Eco Campus Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none mix-blend-luminosity" 
          style={{ backgroundImage: 'url(/campus_bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08120D]/50 via-[#08120D]/80 to-[#08120D] pointer-events-none" />

        {/* Floating Eco Leaf Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/5 animate-float opacity-30 text-emerald-400"><Leaf size={24} /></div>
          <div className="absolute top-2/3 right-1/4 animate-float-delayed opacity-25 text-lime-400"><Leaf size={28} /></div>
          <div className="absolute top-1/2 left-3/4 animate-float opacity-20 text-teal-400"><Sparkles size={20} /></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex self-center lg:self-start items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono tracking-wider shadow-lg shadow-emerald-950/50">
              <Leaf size={14} className="text-lime-400 animate-pulse" />
              <span>Eco-Futuristic Campus Intelligence & Maintenance</span>
              <Sparkles size={12} className="text-emerald-400" />
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Building Smarter & <br />
              <span className="text-gradient-eco">Greener Campuses</span> <br />
              with Artificial Intelligence
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              GreenVerse transforms educational institutions using <strong>Artificial Intelligence</strong>, <strong>Internet of Things</strong>, <strong>GIS Mapping</strong> and <strong>Cloud Computing</strong> to create sustainable campuses.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <button 
                onClick={handleGetStarted}
                className="relative group overflow-hidden rounded-2xl p-px font-display font-bold text-sm cursor-pointer shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="relative block px-8 py-4 rounded-[15px] bg-slate-950/90 text-white group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center gap-2">
                  <span>Explore Platform</span>
                  <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button 
                onClick={() => {
                  const target = document.getElementById('demo-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass-card glass-card-interactive px-7 py-4 rounded-2xl text-white font-display font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer border border-white/20"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Play size={12} fill="currentColor" />
                </div>
                <span>Watch Interactive Demo</span>
              </button>
            </div>

            {/* Live Campus Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Deployment:
              </span>
              <span>SPNREC College Campus, Araria (Bihar)</span>
            </div>

          </div>

          {/* Right Column: Eco-Futuristic Smart Campus Telemetry HUD Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-lime-500/10 to-teal-500/20 rounded-full blur-3xl" />
            
            {/* Interactive Smart Campus HUD Box */}
            <div className="w-full max-w-[440px] rounded-3xl glass-card border border-white/20 p-6 shadow-2xl relative flex flex-col gap-5 animate-float overflow-hidden bg-gradient-to-b from-white/10 to-white/5">
              
              {/* Background Image Accent */}
              <div 
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none rounded-3xl"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600)' }}
              />

              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Activity size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-white">SPNREC Telemetry HUD</h3>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Real-Time Grid Active
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                  AI NODE v4.2
                </span>
              </div>

              {/* Realtime Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 z-10">
                <div className="glass-card p-3.5 border border-white/15 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-lime-400 text-xs font-bold font-mono">
                    <Sun size={14} /> Solar Yield
                  </div>
                  <span className="font-display font-extrabold text-lg text-white">185.4 kW</span>
                  <span className="text-[9px] text-slate-400 font-medium">250kW Photovoltaic Grid</span>
                </div>

                <div className="glass-card p-3.5 border border-white/15 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold font-mono">
                    <Droplets size={14} /> Recycled Water
                  </div>
                  <span className="font-display font-extrabold text-lg text-white">45,200 L</span>
                  <span className="text-[9px] text-slate-400 font-medium">Greywater Treatment OK</span>
                </div>

                <div className="glass-card p-3.5 border border-white/15 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
                    <Trash2 size={14} /> Smart Bin Hub
                  </div>
                  <span className="font-display font-extrabold text-lg text-white">94% Fill</span>
                  <span className="text-[9px] text-amber-300 font-semibold">CSE Yard Bin Warning</span>
                </div>

                <div className="glass-card p-3.5 border border-white/15 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-mono">
                    <Leaf size={14} /> Carbon Offset
                  </div>
                  <span className="font-display font-extrabold text-lg text-white">9.8 Tons</span>
                  <span className="text-[9px] text-emerald-300 font-semibold">Microsoft ESG Ledger</span>
                </div>
              </div>

              {/* Bottom Live Action Alert */}
              <div className="glass-card p-3 border border-emerald-500/30 flex items-center justify-between z-10 bg-emerald-950/40">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Campus Net-Zero Index: <strong>8.2 / 10</strong></span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400">OPTIMAL</span>
              </div>

            </div>

          </div>

        </div>

        {/* Live Statistics Banner */}
        <div className="max-w-7xl mx-auto w-full mt-20 z-10">
          <div className="glass-card p-6 md:p-8 border border-white/15 grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {statistics.map((stat, idx) => (
              <div key={idx} className={`flex flex-col items-center text-center gap-2 ${idx !== 0 ? 'pt-4 md:pt-0' : ''}`}>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 mb-1">
                  {stat.icon}
                </div>
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-300 font-semibold max-w-[140px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ==================================================
          2. ABOUT GREENVERSE SECTION
         ================================================== */}
      <section className="py-24 px-6 md:px-12 relative border-t border-white/10 bg-emerald-950/10">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Globe size={14} /> Eco-System Overview
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Pioneering Campus Sustainability & Intelligent Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
              GreenVerse bridges environmental conservation with cutting-edge artificial intelligence, unifying energy monitoring, waste logistics, water infrastructure, and maintenance dispatches.
            </p>
          </div>

          {/* Mission / Vision / SDGs Tabs */}
          <div className="glass-card p-8 border border-white/15 flex flex-col gap-8">
            <div className="flex justify-center gap-4 border-b border-white/10 pb-4">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'mission' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'vision' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Our Vision
              </button>
              <button
                onClick={() => setActiveTab('sdg')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'sdg' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                UN SDGs Alignment
              </button>
            </div>

            {activeTab === 'mission' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-slide-up">
                <div className="flex flex-col gap-4">
                  <h3 className="font-display font-extrabold text-2xl text-white">Accelerating Net-Zero Higher Education</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    Our mission is to eliminate resource waste across college campuses by combining real-time IoT sensors with predictive AI workflows, turning everyday campus data into actionable environmental savings.
                  </p>
                  <ul className="flex flex-col gap-2 text-xs text-slate-300 font-semibold">
                    <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={16} /> Automated zero-latency issue detection</li>
                    <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={16} /> Transparent ESG compliance reporting</li>
                    <li className="flex items-center gap-2 text-emerald-400"><CheckCircle2 size={16} /> Student engagement through Gamified Rewards</li>
                  </ul>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-[260px]">
                  <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600" alt="Solar Campus" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-slide-up">
                <div className="flex flex-col gap-4">
                  <h3 className="font-display font-extrabold text-2xl text-white">Empowering 1,000+ Smart Green Campuses</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    We envision a future where educational institutions operate as self-sustaining eco-havens—producing clean solar energy, recycling 100% of wastewater, and inspiring the next generation of environmental leaders.
                  </p>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-semibold">
                    "Nature meets Artificial Intelligence to create resilient educational infrastructure."
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-[260px]">
                  <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600" alt="Green Campus" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {activeTab === 'sdg' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
                <div className="glass-card p-5 border border-amber-500/30 flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">SDG 7</span>
                  <h4 className="font-display font-bold text-base text-white">Affordable & Clean Energy</h4>
                  <p className="text-xs text-slate-400">Monitors solar PV output and optimizes building energy consumption.</p>
                </div>
                <div className="glass-card p-5 border border-emerald-500/30 flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">SDG 11</span>
                  <h4 className="font-display font-bold text-base text-white">Sustainable Cities & Communities</h4>
                  <p className="text-xs text-slate-400">Empowers campus infrastructure with smart waste & water IoT networks.</p>
                </div>
                <div className="glass-card p-5 border border-sky-500/30 flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">SDG 12</span>
                  <h4 className="font-display font-bold text-base text-white">Responsible Consumption</h4>
                  <p className="text-xs text-slate-400">Reduces plastic waste through smart bin telemetry and recycling rewards.</p>
                </div>
                <div className="glass-card p-5 border border-lime-500/30 flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-lime-400">SDG 13</span>
                  <h4 className="font-display font-bold text-base text-white">Climate Action</h4>
                  <p className="text-xs text-slate-400">Calculates carbon emission offsets and generates weekly ESG audit ledgers.</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ==================================================
          3. PREMIUM GLASS FEATURES GRID (13 Cards)
         ================================================== */}
      <section id="features" className="py-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Layers size={14} /> Platform Capabilities
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Comprehensive Suite for Smart Campus Engineering
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Every component of GreenVerse is crafted using Liquid Glass styling, responsive performance benchmarks, and intelligent automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((f, idx) => (
              <div 
                key={idx} 
                className="glass-card glass-card-interactive p-7 border border-white/12 flex flex-col gap-4 relative group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          4. GREENBOT AI SHOWCASE SECTION
         ================================================== */}
      <section id="ai" className="py-24 px-6 md:px-12 bg-slate-950/60 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Description */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Brain size={14} /> Intelligent Conversational Copilot
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              Meet GreenBot AI: <br />
              <span className="text-gradient-eco">Your 24/7 Campus Assistant</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              GreenBot processes natural language queries, analyzes defect photographs using computer vision, and provides voice-guided eco-recommendations to students and facility managers alike.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="glass-card p-4 border border-white/15 flex flex-col gap-1">
                <Mic size={18} className="text-emerald-400" />
                <span className="font-display font-bold text-xs text-white">Voice Enabled</span>
                <span className="text-[10px] text-slate-400">Hands-free speech commands</span>
              </div>
              <div className="glass-card p-4 border border-white/15 flex flex-col gap-1">
                <ImageIcon size={18} className="text-sky-400" />
                <span className="font-display font-bold text-xs text-white">Photo Diagnostic</span>
                <span className="text-[10px] text-slate-400">Instant AI defect detection</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Chat Preview */}
          <div className="lg:col-span-7">
            <div className="glass-card border border-white/20 p-6 flex flex-col gap-4 shadow-2xl rounded-3xl backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">GreenBot Copilot v3.2</h4>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Gemini AI Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto p-2">
                {demoMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-600 text-white font-medium self-end rounded-br-none shadow-md' 
                        : 'glass-card border border-white/15 text-slate-200 self-start rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-white/10">
                <input 
                  type="text" 
                  value={demoChatInput}
                  onChange={(e) => setDemoChatInput(e.target.value)}
                  placeholder="Ask GreenBot about campus maintenance or waste status..."
                  className="flex-1 glass-input px-4 py-2.5 text-xs text-white"
                />
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. IOT TELEMETRY SECTION
         ================================================== */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Radio size={14} /> Live Telemetry Matrix
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Real-Time IoT Sensor Infrastructure
            </h2>
            <p className="text-sm text-slate-300 font-medium">
              Over 50+ deployed micro-sensors continuously stream environmental health parameters directly into our analytics engine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 border border-emerald-500/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">SOLAR GRID</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h4 className="font-display font-extrabold text-3xl text-white">185.4 kW</h4>
              <p className="text-xs text-slate-400">250kW Solar PV Array • Active Generation</p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>

            <div className="glass-card p-6 border border-sky-500/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400">WATER PRESSURE</span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              </div>
              <h4 className="font-display font-extrabold text-3xl text-white">34.2 PSI</h4>
              <p className="text-xs text-slate-400">Overhead Tank Complex • Pressure Stable</p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="glass-card p-6 border border-amber-500/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">SMART BIN</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <h4 className="font-display font-extrabold text-3xl text-white">94% Full</h4>
              <p className="text-xs text-slate-400">CSE Yard Bin • High Capacity Warning</p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div className="glass-card p-6 border border-lime-500/30 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-lime-400">AIR QUALITY</span>
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
              </div>
              <h4 className="font-display font-extrabold text-3xl text-white">42 PM2.5</h4>
              <p className="text-xs text-slate-400">Main Gate AQI • Optimal Healthy Range</p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-lime-400 h-1.5 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          6. GIS CAMPUS MAP SECTION
         ================================================== */}
      <section className="py-24 px-6 md:px-12 bg-emerald-950/10 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Map size={14} /> Spatial GIS Intelligence
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-2">
                Interactive Campus Smart Radar Map
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-medium">
              Explore live facility locations across Shri Phanishwar Nath Renu Engineering College (SPNREC), Araria.
            </p>
          </div>

          <div className="h-[460px] w-full rounded-3xl overflow-hidden glass-card border border-white/20 shadow-2xl">
            <GisMap />
          </div>

        </div>
      </section>

      {/* ==================================================
          7. ECO CAMPUS BEFORE / AFTER GALLERY & PHOTOGRAPHS
         ================================================== */}
      <section className="py-24 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Sparkles size={14} /> Visual Transformation
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Before & After Environmental Impact
            </h2>
            <p className="text-sm text-slate-300 font-medium">
              Slide to observe how GreenVerse's IoT & Maintenance deployment restored cleanliness across SPNREC campus yards.
            </p>
          </div>

          {/* Interactive Before & After Slider */}
          <div className="max-w-3xl mx-auto w-full aspect-video rounded-3xl overflow-hidden relative glass-card border border-white/20 shadow-2xl select-none">
            {/* After Image */}
            <img 
              src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000" 
              alt="Restored Green Campus"
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white shadow">
              AFTER: Restored Green Yard
            </div>

            {/* Before Image Clip */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden" 
              style={{ width: `${beforeAfterPos}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1000" 
                alt="Overflowing Waste"
                className="w-full h-full object-cover max-w-none" 
                style={{ width: '768px' }}
              />
              <div className="absolute top-4 left-4 bg-amber-600/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white shadow">
                BEFORE: Overflowing Waste Bin
              </div>
            </div>

            {/* Slider Handle Bar */}
            <div 
              className="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-2xl flex items-center justify-center"
              style={{ left: `${beforeAfterPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white">
                ↔
              </div>
            </div>

            {/* Hidden Input Controller */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={beforeAfterPos}
              onChange={(e) => setBeforeAfterPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
          </div>

        </div>
      </section>

      {/* ==================================================
          8. CONTACT & NEWSLETTER SECTION
         ================================================== */}
      <section className="py-24 px-6 md:px-12 bg-slate-950/80 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Send size={14} /> Enterprise Deployment
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
              Ready to Transform Your Campus Sustainability?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Schedule a live platform demonstration for your college director, registrar, or facility department.
            </p>

            <div className="flex flex-col gap-3 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> Instant deployment across college infrastructure</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> Role-Based Access Control for Students & Staff</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> Full Microsoft ESG Compliance audit outputs</div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-card p-8 border border-white/20 flex flex-col gap-6 rounded-3xl shadow-2xl">
              <h3 className="font-display font-bold text-xl text-white">Request Campus Demonstration</h3>
              
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Institutional Email</label>
                  <input 
                    type="email" 
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="director@yourcollege.ac.in" 
                    className="glass-input px-4 py-3 text-xs text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-display font-bold text-xs py-4 rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>Request Live Consultation</span>
                </button>

                {newsletterSubscribed && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center animate-slide-up">
                    ✅ Thank you! Our sustainability team will contact your institution within 24 hours.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </section>


    </div>
  );
};
export default Home;
