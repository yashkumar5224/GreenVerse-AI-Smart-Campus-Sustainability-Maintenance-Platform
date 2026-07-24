import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Compass, Menu, X, Cpu, Globe, ShieldCheck } from 'lucide-react';
import { useStore } from '../hooks/useStore';

export const Navbar: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePortalRedirect = () => {
    if (!user) {
      navigate('/login');
    } else {
      if (user.role === 'STUDENT') navigate('/dashboard/student');
      else if (user.role === 'MAINTENANCE') navigate('/dashboard/maintenance');
      else navigate('/dashboard/admin');
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Features', path: '/features' },
    { label: 'Our Developers', path: '/developers' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-4 inset-x-4 md:inset-x-8 max-w-7xl mx-auto z-50 transition-all duration-300">
      <div className="glass-nav rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-2xl border border-white/15">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-10 px-2 py-1 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-emerald-950/40 backdrop-blur-md">
            <img src="/logo.png" alt="GreenVerse AI Logo" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Green<span className="text-gradient-eco">Verse</span> <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono">AI</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-400/80 uppercase tracking-widest -mt-1 font-bold">
              Smart Campus Platform
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`transition-colors duration-200 py-1 relative ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-full" />
                )}
              </Link>
            );
          })}
          
          <button 
            onClick={handlePortalRedirect}
            className="text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            {user ? 'Dashboard' : 'Login'}
          </button>
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePortalRedirect}
            className="relative group overflow-hidden rounded-xl p-px font-display font-bold text-xs cursor-pointer shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 group-hover:opacity-100 opacity-90 transition-opacity" />
            <span className="relative block px-4 py-2.5 rounded-[11px] bg-slate-950/90 text-white group-hover:bg-transparent transition-colors duration-300 flex items-center gap-2">
              {user ? (
                <>
                  <Compass size={14} className="animate-spin-slow text-emerald-400" />
                  <span>Launch Portal</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-lime-400" />
                  <span>Get Started</span>
                </>
              )}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 glass-nav rounded-2xl p-6 border border-white/15 flex flex-col gap-4 shadow-2xl animate-slide-up">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-200 hover:text-emerald-400 transition py-1 border-b border-white/5 flex items-center justify-between"
            >
              <span>{item.label}</span>
              <Globe size={14} className="text-slate-500" />
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handlePortalRedirect();
            }}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Cpu size={14} />
            {user ? 'Enter Campus Portal' : 'Student & Staff Login'}
          </button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
