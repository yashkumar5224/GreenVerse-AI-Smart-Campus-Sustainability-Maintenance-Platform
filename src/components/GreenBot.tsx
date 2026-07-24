import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useStore } from '../hooks/useStore';
import { Send, MessageSquare, X, Bot, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const GreenBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I am GreenBot, your SPNREC Sustainability Assistant. How can I help you optimize energy, check sensor data, or track maintenance tickets today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { complaints, sensors, user, sustainability } = useStore();

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle local fallback conversational replies based on workspace state
  const getMockResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('status') || q.includes('complaint') || q.includes('ticket')) {
      const active = complaints.filter(c => c.status !== 'RESOLVED');
      if (active.length === 0) {
        return "All reported maintenance issues are resolved! The campus is running at 100% structural health.";
      }
      const list = active.map(c => `• [${c.category} - ${c.priority}] ${c.title} (${c.status})`).join('\n');
      return `There are currently ${active.length} active complaints at SPNREC:\n${list}\n\nStaff Ramesh Prasad is on duty.`;
    }
    
    if (q.includes('solar') || q.includes('energy') || q.includes('electricity') || q.includes('power')) {
      const solarSensor = sensors.find(s => s.type === 'SOLAR_PANEL');
      const kw = solarSensor ? solarSensor.last_reading : 180;
      return `Our SPNREC 250kW Solar Plant is currently generating **${kw} kW**. Today we saved **${sustainability.energy_saved.toFixed(1)} kWh** of electricity, resulting in an offset of **${sustainability.carbon_offset.toFixed(3)} tons of CO2**!`;
    }
    
    if (q.includes('water') || q.includes('leak') || q.includes('pump')) {
      const tank = sensors.find(s => s.type === 'WATER_TANK');
      const leaks = complaints.filter(c => c.category === 'PLUMBING' && c.status !== 'RESOLVED');
      return `Main Overhead Water Tank is at **${tank ? tank.last_reading : 82}%** level. ${leaks.length > 0 ? `⚠️ **ALERT**: There is an active plumbing leakage reported in the ${leaks[0].location}.` : "No active water leaks are reported. System is operating normally."}`;
    }
    
    if (q.includes('rewards') || q.includes('point') || q.includes('badge') || q.includes('leaderboard')) {
      return `In the GreenVerse challenges, students earn points by reporting verified faults, recycling, and conserving water. You currently have **${user?.points || 0} Eco-points** (Tier: ${user?.badge || 'Eco Novice'}). Aarav Singh is leading the campus leaderboard with **420 points**!`;
    }
    
    if (q.includes('dustbin') || q.includes('garbage') || q.includes('waste')) {
      const warningBins = sensors.filter(s => s.type === 'SMART_BIN' && s.status !== 'HEALTHY');
      if (warningBins.length > 0) {
        return `⚠️ **Alert**: The smart dustbin at **${warningBins[0].location}** is at **${warningBins[0].last_reading}%** capacity and requires emptying.`;
      }
      return "All smart campus waste bins are under 80% capacity. Recycling rates are at 68% today.";
    }

    if (q.includes('aqi') || q.includes('air') || q.includes('pollution')) {
      const aqi = sensors.find(s => s.type === 'AQI')?.last_reading || 65;
      return `The current SPNREC Campus Air Quality Index (AQI) is **${aqi}** (Good/Moderate). Temperature is 31°C with 62% humidity.`;
    }

    // Default general advice
    const tips = [
      "Water saving tip: Turn off the tap while brushing or washing hands in hostels. Reporting minor leaks early saves up to 500 liters a day!",
      "Energy saving tip: Turn off laboratory computers and overhead fans when leaving CSE Labs. Idle power draws account for 12% of college energy costs.",
      "Waste reduction tip: Segregate paper and plastic cups in the canteen smart bins to assist municipal recycling.",
      "GreenVerse tip: Did you know? Scanning the QR code on any campus HVAC or electrical panel shows its service logs instantly."
    ];
    return `I am here to assist with campus telemetry. Here is a sustainability tip:\n\n${tips[Math.floor(Math.random() * tips.length)]}`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]);
    setInput('');
    setLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        // Initialize Gemini model
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const systemPrompt = `You are GreenBot, a helpful AI Sustainability and Facility Management Assistant for Shri Phanishwar Nath Renu Engineering College (SPNREC), Araria, Bihar. 
        You have access to live campus status:
        - Active complaints: ${JSON.stringify(complaints.filter(c => c.status !== 'RESOLVED'))}
        - Sensor telemetry: ${JSON.stringify(sensors)}
        - Energy offset: ${sustainability.energy_saved} kWh, CO2 Saved: ${sustainability.carbon_offset} tons.
        - User points: ${user?.points || 0}, badge: ${user?.badge || 'Eco Novice'}.
        
        Keep your answers concise, structured, and focus heavily on green tips, engineering optimization, and reporting faults. Use Markdown.`;

        const result = await model.generateContent([systemPrompt, userMessage]);
        const responseText = result.response.text();
        
        setMessages(prev => [...prev, { role: 'model', content: responseText, timestamp: new Date().toISOString() }]);
      } catch (err: any) {
        console.error("Gemini API Error, falling back to local simulation:", err);
        const reply = getMockResponse(userMessage);
        setMessages(prev => [...prev, { role: 'model', content: reply, timestamp: new Date().toISOString() }]);
      } finally {
        setLoading(false);
      }
    } else {
      // Simulate network lag
      setTimeout(() => {
        const reply = getMockResponse(userMessage);
        setMessages(prev => [...prev, { role: 'model', content: reply, timestamp: new Date().toISOString() }]);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer animate-bounce"
        title="Chat with GreenBot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-40 rounded-2xl overflow-hidden glass-panel border border-brand-border flex flex-col shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 px-4 py-3 flex items-center justify-between border-b border-brand-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                <Bot className="text-emerald-400" size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-1">
                  GreenBot <Sparkles size={12} className="text-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">SPNREC AI Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600/40 flex items-center justify-center flex-shrink-0 text-[10px] text-emerald-400">
                    GB
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-slate-900 border border-brand-border text-slate-200 rounded-bl-none shadow-md'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-[10px] text-slate-300">
                    <User size={12} />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600/40 flex items-center justify-center flex-shrink-0 text-[10px] text-emerald-400 animate-pulse">
                  GB
                </div>
                <div className="bg-slate-900 border border-brand-border rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5 shadow-md">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-brand-border bg-slate-950/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about solar energy, leaks, AQI..."
              className="flex-1 bg-slate-900/60 border border-brand-border rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition duration-200 disabled:opacity-50 disabled:hover:bg-emerald-600 flex items-center justify-center cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default GreenBot;
