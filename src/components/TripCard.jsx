import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Share2, Trash2, MapPin, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export default function TripCard({ trip, onEdit, onShare, onDelete, onClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const startDate = trip.start_date ? dayjs(trip.start_date) : null;
  const endDate = trip.end_date ? dayjs(trip.end_date) : null;
  const days = startDate && endDate ? endDate.diff(startDate, 'day') + 1 : null;
  const budget = trip.budget ? `₹ ${Number(trip.budget).toLocaleString('en-IN')}` : null;

  return (
    <div
      className="group bg-white rounded-2xl shadow-card border border-sand-100 overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5"
      onClick={() => onClick?.(trip)}
    >
      {/* Cover image */}
      <div className="relative h-44 bg-sand-100 overflow-hidden">
        {trip.cover_url ? (
          <img
            src={trip.cover_url}
            alt={trip.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ocean-400/20 to-sunset-400/20 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-ink-200" />
          </div>
        )}

        {/* 3-dot menu */}
        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 bg-white/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <MoreVertical className="w-4 h-4 text-ink-700" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-card border border-sand-200 py-1 animate-scale-in z-10">
              <button onClick={(e) => { e.stopPropagation(); onEdit?.(trip); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-sand-50">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onShare?.(trip); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-sand-50">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <hr className="border-sand-100 my-1" />
              <button onClick={(e) => { e.stopPropagation(); onDelete?.(trip); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sunset-600 hover:bg-sunset-500/5">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Budget badge */}
        {budget && (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-lg text-forest-600">
            {budget}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-family-heading)] font-semibold text-ink-900 text-lg leading-tight mb-1 truncate">
          {trip.name || 'Untitled Trip'}
        </h3>
        <div className="flex items-center gap-2 text-xs text-ink-400">
          {days && (
            <span className="flex items-center gap-1 bg-sand-100 px-2 py-0.5 rounded-full">
              <Calendar className="w-3 h-3" /> {days} day{days !== 1 ? 's' : ''}
            </span>
          )}
          {startDate && (
            <span>{startDate.format('ddd, DD MMM YYYY')}</span>
          )}
        </div>
        {trip.description && (
          <p className="text-sm text-ink-400 mt-2 line-clamp-2">{trip.description}</p>
        )}
      </div>
    </div>
  );
}
