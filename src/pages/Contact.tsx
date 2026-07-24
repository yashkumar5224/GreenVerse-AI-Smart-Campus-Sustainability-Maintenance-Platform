import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => {
      setName('');
      setEmail('');
      setMsg('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen bg-[#08120D] pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto flex flex-col gap-16 font-sans">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <MessageSquare size={14} /> Connect With Us
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
          Contact SPNREC Campus Administration
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-medium">
          Reach out directly to Shri Phanishwar Nath Renu Engineering College administration or GreenVerse sustainability researchers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="glass-card p-8 border border-white/15 flex flex-col gap-6">
          <h3 className="font-display font-bold text-xl text-white">Contact Information</h3>
          
          <div className="flex flex-col gap-5 text-xs text-slate-300">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-white">SPNREC Campus Address</h5>
                <p className="text-slate-400 leading-relaxed font-medium mt-0.5">
                  Shri Phanishwar Nath Renu Engineering College,<br />
                  Simraha, Araria, Bihar, Pin - 854318, India
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-white">Administration Phone Lines</h5>
                <p className="text-slate-400 font-medium mt-0.5">+91 6202 245388 / +91 9546 543122</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h5 className="font-display font-bold text-sm text-white">Official Emails</h5>
                <p className="text-slate-400 font-medium mt-0.5">info@spnrec.ac.in / principal@spnrec.ac.in</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
            Operating Hours: Monday – Saturday | 10:00 AM – 05:00 PM IST
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card p-8 border border-white/15">
          {submitted ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center gap-4">
              <CheckCircle className="text-emerald-400 animate-bounce" size={48} />
              <h4 className="font-display font-extrabold text-xl text-white">Inquiry Transmitted</h4>
              <p className="text-xs text-slate-300 max-w-[240px] font-medium">
                Your message has been routed to SPNREC administrative officers.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h3 className="font-display font-bold text-xl text-white">Send Direct Message</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Your Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Yash Kumar"
                  required
                  className="glass-input px-4 py-3 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Institutional Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yashkumar2278012@gmail.com"
                  required
                  className="glass-input px-4 py-3 text-xs text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-semibold uppercase">Message Details</label>
                <textarea 
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Describe your institutional query or demo request..."
                  required
                  className="glass-input px-4 py-3 text-xs text-white resize-none"
                />
              </div>

              <button 
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-display font-bold text-xs py-4 rounded-xl transition duration-300 cursor-pointer shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2"
              >
                <Send size={14} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};
export default Contact;
