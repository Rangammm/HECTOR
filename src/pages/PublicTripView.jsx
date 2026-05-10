import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Clock, Share2, Copy, AlertCircle, ExternalLink } from 'lucide-react';
import { getTripById, getStops, getActivities } from '../lib/api.js';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import dayjs from 'dayjs';

export default function PublicTripView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const tripData = await getTripById(id);
        if (!tripData.is_public) {
          setError('This trip is private.');
          setLoading(false);
          return;
        }
        setTrip(tripData);

        const stopsData = await getStops(id);
        setStops(stopsData);

        const acts = {};
        for (const stop of stopsData) {
          acts[stop.id] = await getActivities(stop.id);
        }
        setActivities(acts);
      } catch (err) {
        setError('Trip not found or unavailable.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleCloneTrip = () => {
    // Requires auth context, but for public view we might redirect to signup/login
    alert('Log in or sign up to copy this trip to your account! (Feature coming soon)');
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-base)] pt-20 px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="w-full h-[400px] rounded-3xl" />
        <Skeleton className="w-3/4 h-12" />
        <div className="flex gap-4"><Skeleton className="w-24 h-8" /><Skeleton className="w-32 h-8" /></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center flex-col gap-4 text-center p-8">
      <AlertCircle size={48} className="text-[var(--sunset)]" />
      <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--text-primary)]">Oops!</h1>
      <p className="text-[var(--text-secondary)] text-lg">{error}</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-[var(--accent)] text-white rounded-full font-medium">Go to Homepage</Link>
    </div>
  );

  const startDate = stops[0]?.arrival_date;
  const endDate = stops[stops.length - 1]?.departure_date;
  const totalDays = startDate && endDate ? dayjs(endDate).diff(dayjs(startDate), 'day') : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-8 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/20 border border-[var(--accent)]/50 rounded-full text-[var(--accent)] text-sm font-semibold mb-4 backdrop-blur-md">
            <Globe size={14} /> Public Trip
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-['Outfit'] text-white mb-6 leading-tight drop-shadow-xl">
            {trip.name || `${stops[0]?.city_name} Trip`}
          </h1>
          <div className="flex flex-wrap gap-6 text-[var(--text-secondary)] text-lg font-medium">
            <span className="flex items-center gap-2"><MapPin size={20} className="text-[var(--pink)]" /> {stops.length} Destinations</span>
            <span className="flex items-center gap-2"><Calendar size={20} className="text-[var(--forest)]" /> {totalDays > 0 ? `${totalDays} Days` : 'Dates flexible'}</span>
            {trip.total_budget > 0 && <span className="flex items-center gap-2"><DollarSign size={20} className="text-[var(--amber)]" /> ${trip.total_budget.toLocaleString()}</span>}
          </div>
        </div>

        {/* Top Navbar overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <div className="text-2xl font-bold font-['Outfit'] text-white tracking-wide drop-shadow-md">Traveloop</div>
          <div className="flex gap-3">
            <button onClick={handleCopyLink} className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white rounded-full transition-colors" title="Copy Link">
              <Share2 size={20} />
            </button>
            <button onClick={handleCloneTrip} className="px-5 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
              <Copy size={18} /> Copy Trip
            </button>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-2xl font-bold font-['Outfit'] mb-10 text-[var(--text-primary)] border-b border-[var(--border)] pb-4">Itinerary</h2>
          
          <div className="relative">
            <div className="absolute top-4 bottom-4 left-[23px] w-1 bg-gradient-to-b from-[var(--accent)] to-[var(--pink)] opacity-20 rounded-full" />
            
            {stops.map((stop, sIdx) => {
              const stopActs = activities[stop.id] || [];
              return (
                <div key={stop.id} className="mb-14 relative">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border-4 border-[var(--bg-base)] flex items-center justify-center text-2xl shadow-[0_0_20px_var(--accent-glow)] relative z-10">
                      {stop.flag}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)]">{stop.city_name}</h3>
                      <div className="text-[var(--text-secondary)] text-sm font-medium mt-1">
                        {dayjs(stop.arrival_date).format('MMMM D')} – {dayjs(stop.departure_date).format('MMMM D, YYYY')}
                      </div>
                    </div>
                  </div>

                  <div className="pl-14 space-y-4">
                    {stopActs.map((act) => (
                      <div key={act.id} className="group relative bg-[var(--bg-base)] border border-[var(--border)] p-5 rounded-2xl hover:border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-all">
                        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[var(--accent)] bg-[var(--bg-base)]" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-bold text-[var(--accent)] flex items-center gap-1"><Clock size={14} /> {act.time_slot}</span>
                              <span className={`text-[10px] uppercase tracking-widest font-bold py-1 px-2.5 rounded badge-${act.type.toLowerCase()}`}>
                                {act.type}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-[var(--text-primary)]">{act.name}</h4>
                            {act.description && <p className="text-[var(--text-muted)] text-sm mt-1 max-w-2xl">{act.description}</p>}
                          </div>
                          
                          <div className="flex gap-4 md:flex-col md:gap-2 text-right">
                            {act.cost > 0 && (
                              <div className="text-[var(--text-primary)] font-bold flex items-center gap-1 bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                                <DollarSign size={14} className="text-[var(--text-muted)]" /> {act.cost}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {stopActs.length === 0 && (
                      <div className="text-[var(--text-muted)] italic">Exploring {stop.city_name}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure Globe is imported
import { Globe } from 'lucide-react';
