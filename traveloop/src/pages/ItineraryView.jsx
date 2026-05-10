import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Printer, MapPin, Calendar as CalendarIcon, List, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { useTrip } from '../hooks/useTrip.js';
import { updateTrip } from '../lib/api.js';
import { useToast } from '../hooks/useToast.jsx';
import dayjs from 'dayjs';

export default function ItineraryView() {
  const { id } = useParams();
  const { trip, stops, activities, loading, setTrip } = useTrip(id);
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('timeline');

  const handleShare = async () => {
    try {
      if (!trip.is_public) {
        const updated = await updateTrip(id, { is_public: true });
        setTrip(updated);
      }
      const url = `${window.location.origin}/trip/${id}`;
      await navigator.clipboard.writeText(url);
      addToast('Public link copied to clipboard!', 'success');
    } catch (err) {
      addToast('Failed to share trip', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !trip) {
    return <div className="p-8 text-center text-[var(--text-muted)]">Loading Itinerary...</div>;
  }

  const renderTimeline = () => (
    <div className="max-w-3xl mx-auto py-8 relative">
      <div className="absolute top-10 bottom-10 left-[35px] w-0.5 bg-gradient-to-b from-[var(--accent)] to-[var(--pink)] opacity-30 no-print" />
      
      {stops.map((stop, idx) => {
        const stopActs = activities[stop.id] || [];
        return (
          <div key={stop.id} className="mb-12 relative print-break">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border-2 border-[var(--border)] flex items-center justify-center text-3xl shadow-lg relative z-10">
                {stop.flag}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{stop.city_name}</h2>
                <p className="text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                  <CalendarIcon size={14} /> 
                  {dayjs(stop.arrival_date).format('MMM D')} - {dayjs(stop.departure_date).format('MMM D, YYYY')}
                </p>
              </div>
            </div>

            <div className="pl-[70px] space-y-4">
              {stopActs.length > 0 ? (
                stopActs.map((act) => (
                  <div key={act.id} className="glass-card p-4 flex gap-4 hover:border-[var(--accent-border)] transition-colors relative">
                    <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg-base)] border-2 border-[var(--accent)] z-10 no-print" />
                    
                    <div className="w-20 pt-1 text-sm font-semibold text-[var(--text-secondary)] flex flex-col gap-1">
                      <span className="flex items-center gap-1"><Clock size={12} /> {act.time_slot}</span>
                      <span className={`text-[10px] uppercase tracking-wider py-0.5 px-2 rounded-full w-fit mt-1 badge-${act.type.toLowerCase()}`}>
                        {act.type}
                      </span>
                    </div>
                    
                    <div className="flex-1 border-l border-[var(--border-subtle)] pl-4">
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">{act.name}</h4>
                      {act.description && <p className="text-[var(--text-muted)] text-sm mt-1 mb-2">{act.description}</p>}
                      <div className="flex gap-4 text-xs font-medium text-[var(--text-secondary)] mt-3">
                        <span className="flex items-center gap-1 bg-[var(--bg-elevated)] px-2 py-1 rounded">
                          <DollarSign size={12} className="text-[var(--text-muted)]" /> 
                          {act.cost > 0 ? act.cost : 'Free'}
                        </span>
                        {act.duration && (
                          <span className="flex items-center gap-1 bg-[var(--bg-elevated)] px-2 py-1 rounded">
                            <Clock size={12} className="text-[var(--text-muted)]" /> {act.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[var(--text-muted)] italic py-2">No activities planned yet.</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCalendar = () => (
    <div className="max-w-5xl mx-auto py-8">
      {/* Calendar view logic would go here. Using a placeholder for now to keep size reasonable */}
      <div className="glass-card p-12 text-center text-[var(--text-muted)] flex flex-col items-center">
        <CalendarIcon size={48} className="mb-4 opacity-20" />
        <p className="text-lg">Calendar view feature coming soon.</p>
        <p className="text-sm">Use Timeline or List view to see your itinerary.</p>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {stops.map(stop => (
        <div key={stop.id} className="glass-card overflow-hidden print-break">
          <div className="bg-[var(--bg-elevated)] p-4 border-b border-[var(--border)] flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="text-2xl">{stop.flag}</span> {stop.city_name}
            </h3>
            <span className="text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-base)] px-3 py-1 rounded-full border border-[var(--border)]">
              {dayjs(stop.arrival_date).format('MMM D')} - {dayjs(stop.departure_date).format('MMM D')}
            </span>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-base)] text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 font-medium">Activity</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {(activities[stop.id] || []).map(act => (
                  <tr key={act.id} className="hover:bg-[var(--bg-base)] transition-colors">
                    <td className="p-3 text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">{act.time_slot}</td>
                    <td className="p-3 text-[var(--text-primary)] font-medium">{act.name}</td>
                    <td className="p-3">
                      <span className={`text-[10px] uppercase tracking-wider py-0.5 px-2 rounded-full badge-${act.type.toLowerCase()}`}>
                        {act.type}
                      </span>
                    </td>
                    <td className="p-3 text-right text-sm font-medium text-[var(--text-secondary)]">${act.cost}</td>
                  </tr>
                ))}
                {(!activities[stop.id] || activities[stop.id].length === 0) && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-[var(--text-muted)] italic">No activities planned</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-base)] pb-20">
      {/* Header controls */}
      <div className="sticky top-0 z-30 bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border)] px-8 py-4 flex items-center justify-between no-print shadow-sm">
        <div className="flex bg-[var(--bg-base)] p-1 rounded-lg border border-[var(--border)]">
          {[
            { id: 'timeline', icon: Clock, label: 'Timeline' },
            { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
            { id: 'list', icon: List, label: 'List' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-[var(--bg-elevated)] text-[var(--accent)] shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
          >
            <Printer size={16} /> Print
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shadow-lg shadow-[var(--accent-glow)] font-medium"
          >
            {trip.is_public ? <ExternalLink size={16} /> : <Share2 size={16} />}
            {trip.is_public ? 'Copy Public Link' : 'Share Trip'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'timeline' && renderTimeline()}
        {activeTab === 'calendar' && renderCalendar()}
        {activeTab === 'list' && renderList()}
      </div>
    </div>
  );
}
