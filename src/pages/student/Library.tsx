import React, { useState } from 'react';
import { BookOpen, Search, BookmarkCheck, Users, QrCode, Bookmark, CheckCircle2 } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  department: string;
  status: 'AVAILABLE' | 'RESERVED' | 'LOANED';
  shelf: string;
}

export const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const [reservedBookId, setReservedBookId] = useState<string | null>(null);
  
  // Reading Room Live Sensors State (Simulated)
  const readingRoomOccupancy = 42;
  const readingRoomCapacity = 60;
  const noiseLevel = 45; // dB (quiet)

  const [books, setBooks] = useState<Book[]>([
    { id: 'b-lib-01', title: 'Introduction to Algorithms, 3rd Edition', author: 'Cormen, Leiserson, Rivest', department: 'CSE', status: 'AVAILABLE', shelf: 'Row A-1' },
    { id: 'b-lib-02', title: 'Power System Engineering', author: 'Kothari, Nagrath', department: 'EE', status: 'AVAILABLE', shelf: 'Row E-3' },
    { id: 'b-lib-03', title: 'Fundamentals of Fluid Mechanics', author: 'Munson, Young, Okiishi', department: 'MECH', status: 'LOANED', shelf: 'Row M-2' },
    { id: 'b-lib-04', title: 'Surveying and Levelling', author: 'Subramanian', department: 'CIVIL', status: 'AVAILABLE', shelf: 'Row C-1' },
    { id: 'b-lib-05', title: 'Design of Digital Systems', author: 'Mano, Ciletti', department: 'ECE', status: 'RESERVED', shelf: 'Row D-4' }
  ]);

  const handleReserve = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status: 'RESERVED' } : b));
    setReservedBookId(id);
    
    // Auto-clear notification details
    setTimeout(() => {
      setReservedBookId(null);
    }, 4000);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-white">Smart Library Portal</h2>
        <p className="text-xs text-slate-400">Search academic databases, check live occupancy levels, and reserve volumes instantly via QR checkout codes.</p>
      </div>

      {/* Occupancy HUD Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-4 rounded-2xl border border-brand-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Reading Room Occupancy</span>
            <h4 className="text-lg font-bold text-white mt-1">
              {readingRoomOccupancy} / {readingRoomCapacity} seats
            </h4>
            <span className="text-[9px] text-emerald-400 font-mono">Status: Moderate Seating</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Users size={18} />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-brand-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Ambient Noise Level</span>
            <h4 className="text-lg font-bold text-white mt-1">
              {noiseLevel} dB
            </h4>
            <span className="text-[9px] text-emerald-400 font-mono">Status: Quiet (Productive)</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <BookOpen size={18} />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-brand-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Borrow Limits</span>
            <h4 className="text-lg font-bold text-white mt-1">
              1 Active Reservation
            </h4>
            <span className="text-[9px] text-slate-500">Max limit: 3 active books</span>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl text-slate-400">
            <BookmarkCheck size={18} />
          </div>
        </div>
      </div>

      {/* Main Catalog Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Book list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-slate-900 border border-brand-border rounded-xl px-3.5 py-2.5">
            <Search className="text-slate-500" size={16} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search CSE, MECH textbooks or authors..."
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="glass-panel rounded-2xl border border-brand-border divide-y divide-brand-border overflow-hidden">
            {filteredBooks.map(book => (
              <div key={book.id} className="p-4 flex items-center justify-between gap-4 transition hover:bg-slate-900/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-900/50 px-1.5 py-0.5 rounded">
                      {book.department}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">Shelf: {book.shelf}</span>
                  </div>
                  <h4 className="font-display font-bold text-xs text-slate-200 mt-2">{book.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Author: {book.author}</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                    book.status === 'AVAILABLE' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900' :
                    book.status === 'RESERVED' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-900' :
                    'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {book.status}
                  </span>
                  
                  {book.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleReserve(book.id)}
                      className="bg-slate-900 hover:bg-emerald-950/30 hover:border-emerald-900 border border-brand-border text-slate-300 hover:text-emerald-400 font-bold text-[10px] px-3 py-1 rounded transition cursor-pointer"
                    >
                      Reserve Book
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Checkout Details Drawer */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-base text-white">Active Reserve QR Code</h3>
          
          <div className="glass-panel p-5 rounded-2xl border border-brand-border flex flex-col items-center justify-center text-center gap-4">
            {reservedBookId ? (
              <>
                <CheckCircle2 className="text-emerald-400 animate-bounce" size={32} />
                <div>
                  <h4 className="font-display font-bold text-xs text-white">Book Reserved Successfully</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Scan this QR code at the SPNREC library front counter within 24 hours to checkout the volume.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-200">
                  <QrCode size={120} className="text-slate-950" />
                </div>
                <div className="bg-slate-900 border border-brand-border p-3.5 rounded-lg text-left w-full text-[10px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Reserve ID:</span>
                    <span className="text-white">RES-{reservedBookId.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Expiry Time:</span>
                    <span className="text-white">Tomorrow, {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center gap-3 text-slate-500">
                <Bookmark size={36} className="opacity-35" />
                <p className="text-xs">No active reserved books. Select a book from the directory to generate a checkout QR tag.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Library;
