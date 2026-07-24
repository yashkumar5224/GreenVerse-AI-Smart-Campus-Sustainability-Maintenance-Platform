import React from 'react';
import { 
  Users, Code, Brain, Cpu, Map, CheckCircle2, 
  Sparkles, Layers, Terminal, Server, Award, Globe, Rocket
} from 'lucide-react';

export const Developers: React.FC = () => {
  const teamMembers = [
    {
      name: "Yash Kumar",
      title: "Team Leader • Full-Stack Developer • AI & Cloud Integration",
      role: "Lead Architect",
      desc: "Yash Kumar led the design, architecture, and development of the GreenVerse platform. He managed frontend and backend development, integrated AI-powered features, cloud services, GIS mapping, and IoT technologies, ensuring a scalable and user-friendly solution.",
      image: "/developer_yash_kumar.jpg",
      responsibilities: [
        "Project Planning & Architecture",
        "React & Vite Development",
        "Supabase Database Integration",
        "Gemini AI Integration",
        "GIS & Leaflet Maps",
        "Authentication & Security",
        "API Development",
        "Deployment & Performance Optimization"
      ],
      skills: ["React", "JavaScript", "Node.js", "Supabase", "Tailwind CSS", "Leaflet", "Firebase", "AI Integration", "UI/UX Design"]
    },
    {
      name: "Neha Kumari",
      title: "Research & Sustainability Analyst",
      role: "Sustainability Researcher",
      desc: "Neha conducted sustainability research, analyzed campus environmental challenges, aligned the project with the United Nations Sustainable Development Goals (SDGs), and prepared technical documentation.",
      image: "/developer_neha_kumari.jpg",
      responsibilities: [
        "Sustainability Research",
        "SDG Mapping",
        "Environmental Analysis",
        "Documentation",
        "User Research",
        "Report Preparation"
      ],
      skills: ["Sustainability Research", "UN SDGs", "Environmental Science", "Technical Docs", "User Research", "Data Analytics"]
    },
    {
      name: "Suraj Kumar",
      title: "Quality Assurance & Testing Engineer",
      role: "QA & Testing Engineer",
      desc: "Suraj was responsible for validating the GreenVerse platform through functional testing, usability testing, and system verification to ensure reliability and performance.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      responsibilities: [
        "Functional Testing",
        "Bug Reporting",
        "Performance Testing",
        "User Acceptance Testing",
        "Quality Assurance",
        "Documentation"
      ],
      skills: ["Functional Testing", "Bug Tracking", "Performance Benchmark", "UAT Verification", "QA Systems", "Regression Tests"]
    },
    {
      name: "Utkarsh Raj",
      title: "UI/UX Designer & Frontend Developer",
      role: "UI/UX & Frontend Specialist",
      desc: "Utkarsh designed intuitive user interfaces and responsive layouts, focusing on accessibility, usability, and a modern glassmorphism-inspired design.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      responsibilities: [
        "UI/UX Design",
        "Responsive Layouts",
        "Dashboard Design",
        "Design System",
        "User Experience",
        "Visual Prototyping"
      ],
      skills: ["UI/UX Design", "Figma", "Glassmorphism", "Responsive Web", "Visual Systems", "Prototyping"]
    }
  ];

  const technologies = [
    { name: "Artificial Intelligence", desc: "Gemini AI for automated defect analysis & GreenBot copilot", icon: <Brain className="text-emerald-400" size={24} /> },
    { name: "Internet of Things", desc: "Multi-node telemetry for water, solar, and smart waste bins", icon: <Cpu className="text-lime-400" size={24} /> },
    { name: "GIS Mapping", desc: "Interactive spatial Leaflet radar overlays for campus buildings", icon: <Map className="text-cyan-400" size={24} /> },
    { name: "React & Vite", desc: "Modern component architecture & lightning fast HMR builds", icon: <Code className="text-teal-400" size={24} /> },
    { name: "Supabase Database", desc: "PostgreSQL relational data store with realtime subscriptions", icon: <Server className="text-emerald-400" size={24} /> },
    { name: "Tailwind CSS", desc: "Eco-Futuristic Liquid Glass styling & design primitives", icon: <Layers className="text-amber-400" size={24} /> },
    { name: "Cloud Computing", desc: "Distributed edge functions & resilient local fallback cache", icon: <Globe className="text-sky-400" size={24} /> },
    { name: "REST & Realtime APIs", desc: "Structured data contracts with end-to-end type safety", icon: <Terminal className="text-emerald-400" size={24} /> }
  ];

  const missionPoints = [
    "Build innovative AI-powered campus solutions.",
    "Promote sustainable development through technology.",
    "Reduce energy, water, and waste consumption.",
    "Improve maintenance efficiency using predictive analytics.",
    "Foster a culture of environmental responsibility."
  ];

  return (
    <div className="w-full min-h-screen bg-[#08120D] text-[#F8FAFC] pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-20 font-sans">
      
      {/* ==================================================
          PAGE HEADER
         ================================================== */}
      <div className="text-center max-w-4xl mx-auto flex flex-col gap-4">
        <div className="inline-flex self-center items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono uppercase tracking-widest shadow-lg">
          <Users size={14} className="text-lime-400" />
          <span>Sustainability Green Warriors</span>
          <Sparkles size={12} className="text-emerald-400 animate-pulse" />
        </div>
        
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          Our Developers
        </h1>
        
        <p className="text-base sm:text-lg text-emerald-300 font-display font-bold">
          Building a Smarter, Greener Future Together
        </p>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium max-w-3xl mx-auto mt-2">
          The <strong>GreenVerse</strong> development team is committed to transforming campuses through <strong>Artificial Intelligence (AI), Internet of Things (IoT), GIS Mapping, Cloud Computing, and Sustainable Innovation</strong>. Our mission is to create intelligent digital solutions that improve campus operations, enhance sustainability, and contribute to a cleaner, greener future.
        </p>
      </div>

      {/* ==================================================
          DEVELOPERS SHOWCASE (CARD GRID)
         ================================================== */}
      <div className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Core Development Team
          </h2>
          <span className="text-xs text-slate-400 font-medium">Engineers & Analysts behind GreenVerse</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx} 
              className="glass-card glass-card-interactive p-8 border border-white/15 flex flex-col gap-6 rounded-3xl relative overflow-hidden bg-gradient-to-b from-white/10 to-white/5 shadow-2xl"
            >
              {/* Top Header Row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-white/10 pb-6">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl flex-shrink-0">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-emerald-950/80 px-2 py-0.5 rounded text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                    {member.role}
                  </div>
                </div>

                <div className="flex flex-col text-center sm:text-left gap-1">
                  <h3 className="font-display font-extrabold text-2xl text-white flex items-center justify-center sm:justify-start gap-2">
                    {member.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {member.title}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-2">
                    {member.desc}
                  </p>
                </div>
              </div>

              {/* Responsibilities List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" /> Key Responsibilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
                  {member.responsibilities.map((resp, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Badges */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          VISION & MISSION SECTION
         ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Vision Card */}
        <div className="glass-card p-8 border border-white/15 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-teal-950/20">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Globe size={24} />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">Our Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            To empower educational institutions with intelligent, AI-driven sustainability solutions that create <strong>smart, efficient, and environmentally responsible campuses</strong>.
          </p>
        </div>

        {/* Mission Card */}
        <div className="glass-card p-8 border border-white/15 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-lime-950/30 to-emerald-950/20">
          <div className="w-12 h-12 rounded-2xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400">
            <Rocket size={24} />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">Our Mission</h3>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-semibold">
            {missionPoints.map((pt, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 size={16} className="text-lime-400 flex-shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ==================================================
          TECHNOLOGIES WE USE
         ================================================== */}
      <div className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Layers size={14} /> Technology Ecosystem
          </span>
          <h2 className="font-display font-extrabold text-3xl text-white">Technologies We Use</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, idx) => (
            <div key={idx} className="glass-card glass-card-interactive p-6 border border-white/15 flex flex-col gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit">
                {tech.icon}
              </div>
              <h4 className="font-display font-bold text-base text-white">{tech.name}</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          PROJECT INFORMATION BANNER
         ================================================== */}
      <div className="glass-card p-8 border border-white/20 rounded-3xl flex flex-col gap-6 bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Award className="text-lime-400" size={24} />
          <div>
            <h3 className="font-display font-extrabold text-xl text-white">Project & Internship Credentials</h3>
            <span className="text-xs text-emerald-400 font-mono">1M1B Applied AI & Green Skills Initiative</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-medium text-slate-300">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Project Name</span>
            <span className="font-bold text-white text-sm">GreenVerse Platform</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Institution</span>
            <span className="font-bold text-white text-sm">SPNREC College, Araria (Bihar)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Internship Sponsor</span>
            <span className="font-bold text-white text-sm">1M1B & Microsoft Supported</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Engineering Team</span>
            <span className="font-bold text-emerald-400 text-sm">Sustainability Green Warriors</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-slate-300 font-medium italic mt-2">
          "Together, we are building smarter, greener, and more sustainable campuses through innovation and technology." 🌱
        </div>
      </div>

    </div>
  );
};
export default Developers;
