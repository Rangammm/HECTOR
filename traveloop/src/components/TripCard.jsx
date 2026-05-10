import dayjs from 'dayjs'
import { Calendar, MapPin, MoreHorizontal, Trash2, Pencil, Globe } from 'lucide-react'
import { useState } from 'react'

export default function TripCard({ trip, onClick, onDelete, onEdit }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="erp-card overflow-hidden hover:border-slate-400 cursor-pointer group flex flex-col h-full transition-colors"
      onClick={onClick}
    >
      {/* Cover Region */}
      <div className="h-28 bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-200">
        {trip.cover_url ? (
          <img src={trip.cover_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <MapPin className="w-8 h-8 text-slate-300" />
          </div>
        )}
        {trip.is_public && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-slate-900/70 backdrop-blur rounded text-[10px] font-medium text-white tracking-wide uppercase">
            <Globe className="w-3 h-3" /> Public
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate flex-1 mr-2 title-font">
            {trip.name}
          </h3>
          {(onDelete || onEdit) && (
            <div className="relative shrink-0">
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-6 bg-white rounded-md shadow-sm border border-slate-200 py-1 z-20 min-w-[120px]" onMouseLeave={() => setMenuOpen(false)}>
                  {onEdit && (
                    <button onClick={e => { e.stopPropagation(); setMenuOpen(false); onEdit(trip) }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                      <Pencil className="w-3.5 h-3.5 text-slate-400" /> Edit Record
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={e => { e.stopPropagation(); setMenuOpen(false); onDelete(trip) }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Record
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {trip.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed flex-1">{trip.description}</p>
        )}
        <div className="h-px bg-slate-100 w-full my-3" />
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          {trip.start_date && (
            <span className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2 py-1 rounded">
              <Calendar className="w-3 h-3 text-slate-400" />
              {dayjs(trip.start_date).format('MMM D, YYYY')} {trip.end_date ? `— ${dayjs(trip.end_date).format('MMM D, YYYY')}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
