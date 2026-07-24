import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08120D] border-t border-white/10 pt-16 pb-12 px-6 md:px-12 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        
        {/* Col 1: Brand & Overview */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 px-2 py-1 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <img src="/logo.png" alt="GreenVerse AI Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="font-display font-extrabold text-xl text-white tracking-tight">GreenVerse <span className="text-xs text-emerald-400 font-mono">AI</span></span>
          </Link>
          <p className="text-xs leading-relaxed text-slate-400 font-medium">
            AI Smart Campus Sustainability & Maintenance Platform deployed at Shri Phanishwar Nath Renu Engineering College (SPNREC), Araria, Bihar.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Navigation</h4>
          <Link to="/" className="text-xs hover:text-emerald-400 transition font-medium">Home</Link>
          <Link to="/about" className="text-xs hover:text-emerald-400 transition font-medium">About GreenVerse</Link>
          <Link to="/features" className="text-xs hover:text-emerald-400 transition font-medium">Platform Features</Link>
          <Link to="/developers" className="text-xs hover:text-emerald-400 transition font-medium">Our Developers</Link>
          <Link to="/gallery" className="text-xs hover:text-emerald-400 transition font-medium">Campus Gallery</Link>
          <Link to="/contact" className="text-xs hover:text-emerald-400 transition font-medium">Contact Us</Link>
        </div>

        {/* Col 3: Portals & Security */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Access Portals</h4>
          <Link to="/login" className="text-xs hover:text-emerald-400 transition font-medium">Student Reporting Portal</Link>
          <Link to="/login" className="text-xs hover:text-emerald-400 transition font-medium">Facilities Staff Queue</Link>
          <Link to="/login" className="text-xs hover:text-emerald-400 transition font-medium">Admin Control Center</Link>
          <Link to="/features" className="text-xs hover:text-emerald-400 transition font-medium">Green Leaderboards</Link>
        </div>

        {/* Col 4: Contact */}
        <div className="flex flex-col gap-3 text-xs font-medium">
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">SPNREC Contact</h4>
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-slate-400">Simraha, Araria, Bihar - 854318, India</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone size={14} className="text-emerald-400 flex-shrink-0" />
            <span className="text-slate-400">+91 6202 245388</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail size={14} className="text-emerald-400 flex-shrink-0" />
            <span className="text-slate-400">info@spnrec.ac.in</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
        <div>
          © {new Date().getFullYear()} GreenVerse Platform • Shri Phanishwar Nath Renu Engineering College
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400">1M1B Applied AI Initiative</span>
          <span>•</span>
          <span>Microsoft ESG Alignment</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
