import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getTrips, searchCities } from '../lib/api.js';
import Navbar from '../components/Navbar.jsx';
import TripCard from '../components/TripCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { Plus, Map, Globe, Calendar, Wallet, ChevronRight, ArrowRight } from 'lucide-react';
import dayjs from 'dayjs';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [t, c] = await Promise.all([
          getTrips(user.id),
          searchCities().catch(() => []),
        ]);
        setTrips(t || []);
        setCities((c || []).slice(0, 6));
      } catch { /* graceful */ } finally { setLoading(false); }
    })();
  }, [user]);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Traveler';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalTrips = trips.length;
  const totalDays = trips.reduce((s, t) => {
    if (t.start_date && t.end_date) return s + dayjs(t.end_date).diff(dayjs(t.start_date), 'day') + 1;
    return s;
  }, 0);
  const totalBudget = trips.reduce((s, t) => s + (Number(t.budget) || 0), 0);
  const countries = new Set(trips.map(t => t.country).filter(Boolean)).size;

  const stats = [
    { label: 'Total Trips', value: totalTrips, icon: Map, color: 'bg-ocean-500/10 text-ocean-600' },
    { label: 'Countries', value: countries, icon: Globe, color: 'bg-forest-500/10 text-forest-600' },
    { label: 'Days Planned', value: totalDays, icon: Calendar, color: 'bg-sunset-500/10 text-sunset-600' },
    { label: 'Total Budget', value: `₹ ${totalBudget.toLocaleString('en-IN')}`, icon: Wallet, color: 'bg-sand-200 text-ink-700' },
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-family-heading)] text-4xl sm:text-[40px] font-bold text-ink-900 leading-tight">
            {greeting}, {displayName} ✈️
          </h1>
          <p className="text-ink-400 mt-2">Let's plan something amazing today.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-card border border-sand-100 p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-medium">{s.label}</p>
                <p className="font-[family-name:var(--font-family-heading)] font-bold text-ink-900 text-lg">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/trips/new')} className="mb-10 w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-sunset-500 text-white font-semibold rounded-xl text-sm hover:bg-sunset-600 transition-colors duration-200 shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" /> Plan New Trip
        </button>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-[family-name:var(--font-family-heading)] font-semibold text-xl text-ink-900">Recent Trips</h2>
            {trips.length > 3 && (
              <button onClick={() => navigate('/trips')} className="text-sm text-ocean-500 hover:text-ocean-600 font-medium flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card border border-sand-100 p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sand-100 flex items-center justify-center">
                <Map className="w-8 h-8 text-ink-200" />
              </div>
              <h3 className="font-[family-name:var(--font-family-heading)] font-semibold text-ink-900 mb-1">No trips yet</h3>
              <p className="text-sm text-ink-400 mb-4">Start planning your first adventure!</p>
              <button onClick={() => navigate('/trips/new')} className="inline-flex items-center gap-1.5 px-5 py-2 bg-sunset-500 text-white text-sm font-medium rounded-xl hover:bg-sunset-600 transition-colors duration-200">
                <Plus className="w-4 h-4" /> Create Trip
              </button>
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-2 -mx-6 px-6 snap-x">
              {trips.slice(0, 6).map(trip => (
                <div key={trip.id} className="min-w-[300px] snap-start">
                  <TripCard trip={trip} onClick={() => navigate(`/trips/${trip.id}/notes`)} />
                </div>
              ))}
            </div>
          )}
        </section>

        {cities.length > 0 && (
          <section>
            <h2 className="font-[family-name:var(--font-family-heading)] font-semibold text-xl text-ink-900 mb-5">Popular Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map(city => (
                <div key={city.id} className="bg-white rounded-2xl shadow-card border border-sand-100 p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-sand-100 flex items-center justify-center text-2xl shrink-0">
                    {city.flag_emoji || '🌍'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-900 truncate">{city.name}</h3>
                    <p className="text-xs text-ink-400">{city.country || city.region}</p>
                  </div>
                  <span className="text-xs font-[family-name:var(--font-family-mono)] font-medium text-forest-600 bg-forest-500/10 px-2 py-0.5 rounded-full shrink-0">
                    {city.cost_index <= 1 ? '$' : city.cost_index <= 2 ? '$$' : '$$$'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-200 group-hover:text-sunset-500 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
