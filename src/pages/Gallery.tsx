import React from 'react';
import { Camera } from 'lucide-react';

export const Gallery: React.FC = () => {
  const images = [
    { title: "250kW Solar Array Grid", category: "Solar Power", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500" },
    { title: "SPNREC Computer Science Labs", category: "Academic Infrastructure", url: "https://images.unsplash.com/photo-1562774053-701939374585?w=500" },
    { title: "Central Library Reading Room", category: "Facilities", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500" },
    { title: "Water Treatment Tank", category: "Water Conservation", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500" },
    { title: "Campus Central Gardens", category: "Green Initiatives", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500" },
    { title: "Smart Waste Recycling Hub", category: "Waste Management", url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500" }
  ];

  return (
    <div className="w-full min-h-screen bg-brand-dark pt-24 pb-16 px-6 md:px-12 max-w-5xl mx-auto flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col gap-3 text-center md:text-left">
        <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
          <Camera size={10} /> Campus Album
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          SPNREC Green Campus Gallery
        </h1>
        <p className="text-xs text-slate-400 max-w-md">
          Explore photographs detailing our clean infrastructure and sustainability implementations at Araria.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="glass-panel overflow-hidden rounded-2xl border border-brand-border group transition duration-300 hover:border-emerald-500/30">
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-900/50 px-2 py-0.5 rounded">
                  {img.category}
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-col gap-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{img.category}</span>
              <h4 className="font-display font-bold text-xs text-white group-hover:text-emerald-400 transition">
                {img.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Gallery;
