import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { useNavigate } from 'react-router-dom';
import GisMap from '../../components/GisMap';
import { 
  Mic, MapPin, Brain, Sparkles, CheckCircle, 
  Upload, AudioLines, LocateFixed
} from 'lucide-react';

export const ReportIssue: React.FC = () => {
  const { user, createComplaint } = useStore();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'WASTE' | 'OTHER' | 'INFRASTRUCTURE'>('OTHER');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(26.1989);
  const [longitude, setLongitude] = useState(87.3216);
  const [imageUrl, setImageUrl] = useState('');
  
  // Simulation states
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [aiReport, setAiReport] = useState<{
    category: string;
    priority: string;
    department: string;
    confidence: number;
    cost: number;
  } | null>(null);

  const [recordingVoice, setRecordingVoice] = useState(false);
  const [showCoordsTip, setShowCoordsTip] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const getRealLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationName('Live GPS Location');
        setGettingLocation(false);
        setShowCoordsTip(true);
        setTimeout(() => setShowCoordsTip(false), 3000);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your browser permissions.');
        setGettingLocation(false);
      }
    );
  };

  // Real Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    setAiReport(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);

      // Simulate AI Vision Analysis after 2 seconds
      setTimeout(() => {
        setAnalyzingImage(false);
        const fileName = file.name.toLowerCase();
        let cat: typeof category = 'OTHER';
        let pri: typeof priority = 'MEDIUM';
        let dept = 'General Facilities';
        let cost = 800;

        if (fileName.includes('leak') || fileName.includes('water') || fileName.includes('plumb') || fileName.includes('pipe') || fileName.includes('washbasin')) {
          cat = 'PLUMBING';
          pri = 'HIGH';
          dept = 'Plumbing & Water Operations';
          cost = 2400;
        } else if (fileName.includes('spark') || fileName.includes('wire') || fileName.includes('light') || fileName.includes('elect') || fileName.includes('short')) {
          cat = 'ELECTRICAL';
          pri = 'CRITICAL';
          dept = 'High Voltage Systems';
          cost = 7500;
        } else if (fileName.includes('bin') || fileName.includes('garbage') || fileName.includes('trash') || fileName.includes('waste') || fileName.includes('overflow')) {
          cat = 'WASTE';
          pri = 'MEDIUM';
          dept = 'Sanitation & Recycling';
          cost = 500;
        } else if (fileName.includes('ac') || fileName.includes('cool') || fileName.includes('hvac')) {
          cat = 'HVAC';
          pri = 'HIGH';
          dept = 'HVAC Climate Controls';
          cost = 3200;
        }

        setCategory(cat);
        setPriority(pri);
        setAiReport({
          category: cat,
          priority: pri,
          department: dept,
          confidence: 96,
          cost
        });
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  // AI Image Recognition simulation targets
  const handleSimulatedImageUpload = (fileType: string) => {
    setAnalyzingImage(true);
    setAiReport(null);

    // Simulate model analysis lag
    setTimeout(() => {
      setAnalyzingImage(false);
      let report = { category: 'OTHER', priority: 'LOW', department: 'General Facilities', confidence: 91, cost: 800 };
      let mockUrl = '';

      if (fileType === 'plumbing') {
        report = { category: 'PLUMBING', priority: 'HIGH', department: 'Plumbing & Water Operations', confidence: 98, cost: 2400 };
        mockUrl = 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400';
        setTitle('Broken water pipe leaking under washbasin sink');
        setDescription('Heavy continuous flow of drinking water observed under the basin unit. Flooding risk.');
        setCategory('PLUMBING');
        setPriority('HIGH');
      } else if (fileType === 'waste') {
        report = { category: 'WASTE', priority: 'MEDIUM', department: 'Sanitation & Recycling', confidence: 97, cost: 500 };
        mockUrl = 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400';
        setTitle('Smart waste dustbin overflowing');
        setDescription('Ultrasound reports bin is at 98% filled, plastics and waste spilling out.');
        setCategory('WASTE');
        setPriority('MEDIUM');
      } else if (fileType === 'electrical') {
        report = { category: 'ELECTRICAL', priority: 'CRITICAL', department: 'High Voltage Systems', confidence: 99, cost: 7500 };
        mockUrl = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400';
        setTitle('Short circuit and sparks from AC capacitor panel');
        setDescription('Sparks and smoke observed from the wall-mounted air conditioner distribution box. Fire hazard.');
        setCategory('ELECTRICAL');
        setPriority('CRITICAL');
      }

      setAiReport(report);
      setImageUrl(mockUrl);
    }, 2000);
  };

  // Real Web Speech API voice capture
  const startLiveSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setRecordingVoice(true);

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setDescription(speechToText);
      
      // Auto AI analysis of transcribed text
      const text = speechToText.toLowerCase();
      let cat: typeof category = 'OTHER';
      let pri: typeof priority = 'MEDIUM';
      let dept = 'General Facilities';
      let cost = 800;
      let detectedTitle = 'Voice Reported Incident';
      
      if (text.includes('water') || text.includes('leak') || text.includes('plumb') || text.includes('pipe') || text.includes('dripping')) {
        cat = 'PLUMBING';
        pri = 'HIGH';
        dept = 'Plumbing & Water Operations';
        cost = 2400;
        detectedTitle = 'Plumbing Pipe Leakage';
      } else if (text.includes('spark') || text.includes('wire') || text.includes('light') || text.includes('elect') || text.includes('circuit') || text.includes('power')) {
        cat = 'ELECTRICAL';
        pri = 'CRITICAL';
        dept = 'High Voltage Systems';
        cost = 7500;
        detectedTitle = 'Electrical Power Malfunction';
      } else if (text.includes('ac') || text.includes('cool') || text.includes('hvac') || text.includes('heat') || text.includes('fan')) {
        cat = 'HVAC';
        pri = 'HIGH';
        dept = 'HVAC Climate Controls';
        cost = 3200;
        detectedTitle = 'HVAC Climate Breakdown';
      } else if (text.includes('bin') || text.includes('garbage') || text.includes('waste') || text.includes('overflow')) {
        cat = 'WASTE';
        pri = 'MEDIUM';
        dept = 'Sanitation & Recycling';
        cost = 500;
        detectedTitle = 'Smart Waste Overflow Alert';
      }

      setTitle(detectedTitle);
      setCategory(cat);
      setPriority(pri);
      setAiReport({
        category: cat,
        priority: pri,
        department: dept,
        confidence: 95,
        cost
      });
    };

    recognition.onerror = (e: any) => {
      console.error("Speech Recognition Error:", e);
      setRecordingVoice(false);
    };

    recognition.onend = () => {
      setRecordingVoice(false);
    };

    recognition.start();
  };

  // AI Voice Command presets
  const handleVoiceCommand = (command: string) => {
    setRecordingVoice(true);
    setTimeout(() => {
      setRecordingVoice(false);
      if (command === 'plumbing') {
        setTitle('Urgent: Water tank valve leak reported');
        setDescription('Valve pipe is loose, water is dripping continuously at 2 liters per min.');
        setCategory('PLUMBING');
        setPriority('HIGH');
        setLocationName('Main Water Tank Complex');
        setLatitude(26.2000);
        setLongitude(87.3199);
      } else if (command === 'bin') {
        setTitle('Smart bin full inside CSE laboratory yard');
        setDescription('Ultrasonic reports bin filled. Plastics overflowing.');
        setCategory('WASTE');
        setPriority('MEDIUM');
        setLocationName('Computer Science Department Yard');
        setLatitude(26.1996);
        setLongitude(87.3207);
      } else if (command === 'ac') {
        setTitle('HVAC ventilation breakdown in Library reading room');
        setDescription('AC unit #3 is not powering on, room temperature is climbing to 34°C.');
        setCategory('HVAC');
        setPriority('HIGH');
        setLocationName('Central Library Ground Floor');
        setLatitude(26.1992);
        setLongitude(87.3215);
      }
    }, 1500);
  };

  const handleCoordinatesSelected = (coords: { lat: number; lng: number; locationName: string }) => {
    setLatitude(coords.lat);
    setLongitude(coords.lng);
    setLocationName(coords.locationName);
    setShowCoordsTip(true);
    setTimeout(() => setShowCoordsTip(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) return;

    const payload = {
      title,
      description,
      category,
      priority,
      location: locationName,
      latitude,
      longitude,
      reporter_id: user?.id || 'u-student',
      reporter_name: user?.name || 'Aarav Singh',
      image_url: imageUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400', // default fallback
    };

    const added = await createComplaint(payload);
    if (added) {
      navigate('/dashboard/student');
    }
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-white">Report Sustainability Incident</h2>
        <p className="text-xs text-slate-400">File a facilities complaint with GPS coordination, AI photo diagnostics, and voice presets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-border flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Complaint Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Water leak or electrical fault name..."
                required
                className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Problem Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of wastage, location remarks..."
                className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input resize-none"
              />
            </div>

            {/* Category and Priority Double row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input"
                >
                  <option value="PLUMBING">Plumbing</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="HVAC">HVAC Maintenance</option>
                  <option value="WASTE">Waste Management</option>
                  <option value="INFRASTRUCTURE">Infrastructure</option>
                  <option value="OTHER">Other Issue</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input"
                >
                  <option value="LOW">Low priority</option>
                  <option value="MEDIUM">Medium priority</option>
                  <option value="HIGH">High priority</option>
                  <option value="CRITICAL">Critical Alert</option>
                </select>
              </div>
            </div>

            {/* Coordinates HUD Info */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GPS Coordinates</label>
                <button
                  type="button"
                  onClick={getRealLocation}
                  disabled={gettingLocation}
                  className="flex items-center gap-1 text-[10px] bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-900/50 px-2 py-1 rounded transition disabled:opacity-50 cursor-pointer"
                >
                  <LocateFixed size={12} className={gettingLocation ? "animate-spin" : ""} />
                  {gettingLocation ? 'Locating...' : 'Use My GPS Location'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-brand-border relative">
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500">Latitude:</span>
                  <span>{latitude.toFixed(6)}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500">Longitude:</span>
                  <span>{longitude.toFixed(6)}</span>
                </div>
                {showCoordsTip && (
                  <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center text-emerald-400 font-semibold rounded-xl text-center px-4">
                    GPS Coordinates Updated!
                  </div>
                )}
              </div>
            </div>

            {/* Location Name */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location Name</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={14} />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Drop a pin on SPNREC map or write location..."
                  required
                  className="w-full bg-slate-900 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white glass-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3.5 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/20"
            >
              <CheckCircle size={14} />
              Submit Incident Ticket
            </button>
          </form>
        </div>

        {/* Right Column: AI Simulations & Maps Picker */}
        <div className="flex flex-col gap-6">
          {/* AI Helper Tools */}
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col gap-4">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
              <Brain size={16} className="text-emerald-400" /> AI Diagnostic Assistant
            </h4>

            {/* Image Recognition Simulator */}
            <div className="flex flex-col gap-2.5 border-b border-brand-border pb-4">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Upload size={10} /> Image Diagnostics
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulatedImageUpload('plumbing')}
                  disabled={analyzingImage}
                  className="bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-semibold cursor-pointer transition"
                >
                  📸 Water Leak
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatedImageUpload('waste')}
                  disabled={analyzingImage}
                  className="bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-semibold cursor-pointer transition"
                >
                  📸 Bin Overflow
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatedImageUpload('electrical')}
                  disabled={analyzingImage}
                  className="bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-semibold cursor-pointer transition"
                >
                  📸 Sparks / Wiring
                </button>
              </div>

              {/* Real Uploader */}
              <div className="flex flex-col gap-1.5 border-t border-brand-border/40 pt-2.5">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Or Upload Your Own Photo</span>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="image-file-picker"
                  />
                  <label
                    htmlFor="image-file-picker"
                    className="bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-xl px-4 py-2 text-xs text-slate-300 font-semibold cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Upload size={12} className="text-emerald-400" />
                    Select Image File
                  </label>
                  {imageUrl && (
                    <div className="relative w-10 h-10 rounded-lg border border-brand-border overflow-hidden">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {analyzingImage && (
                <div className="bg-slate-950 p-3 rounded-lg border border-brand-border flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-400 animate-pulse">Running computer vision model...</span>
                  <div className="w-16 h-1 bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-emerald-400 w-full animate-ping"></div>
                  </div>
                </div>
              )}

              {aiReport && (
                <div className="bg-slate-950 p-3.5 rounded-lg border border-brand-border flex flex-col gap-2 font-mono text-[10px] text-slate-300">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>AI Classifier Result:</span>
                    <span className="flex items-center gap-0.5"><Sparkles size={10} /> {aiReport.confidence}% Conf.</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>Category: <span className="text-white font-semibold">{aiReport.category}</span></div>
                    <div>Priority: <span className="text-white font-semibold">{aiReport.priority}</span></div>
                    <div>Routing: <span className="text-white font-semibold">{aiReport.department}</span></div>
                    <div>Repair Cost: <span className="text-white font-semibold">INR {aiReport.cost}</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Assistant Simulator */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Mic size={10} /> Voice Incident Reporter
              </span>
              <div className="flex flex-col gap-2">
                {/* Real Voice Capture */}
                <button
                  type="button"
                  onClick={startLiveSpeechRecognition}
                  className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    recordingVoice
                      ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse shadow-md shadow-red-950/20'
                      : 'bg-slate-900 border border-brand-border text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Mic size={14} className={recordingVoice ? 'animate-bounce' : ''} />
                  {recordingVoice ? 'Listening... Speak Now' : '🎤 Start Live Voice Transcription'}
                </button>
                
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block mt-1">Or Try Simulated Presets</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleVoiceCommand('plumbing')}
                    disabled={recordingVoice}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg p-2 text-[10px] text-slate-400 hover:text-white cursor-pointer transition text-left"
                  >
                    🎤 "Water valve leak"
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVoiceCommand('bin')}
                    disabled={recordingVoice}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg p-2 text-[10px] text-slate-400 hover:text-white cursor-pointer transition text-left"
                  >
                    🎤 "Canteen bin full"
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVoiceCommand('ac')}
                    disabled={recordingVoice}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 border border-brand-border rounded-lg p-2 text-[10px] text-slate-400 hover:text-white cursor-pointer transition text-left"
                  >
                    🎤 "AC not cooling library"
                  </button>
                </div>

                {recordingVoice && (
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-brand-border flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <AudioLines size={12} className="animate-pulse" />
                      Listening for voice preset...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inline Maps Picker */}
          <div className="flex-1 h-[280px]">
            <GisMap onSelectCoordinates={handleCoordinatesSelected} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportIssue;
