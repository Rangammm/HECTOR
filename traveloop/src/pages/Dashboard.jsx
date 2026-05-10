import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { getTrips, searchCities } from '../lib/api.js';
import SidebarLayout from '../components/SidebarLayout.jsx';
import TripCard from '../components/TripCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { Plus, Map, Globe, Calendar, Wallet, ChevronRight, TrendingUp } from 'lucide-react';
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
        setCities((c || []).slice(0, 5));
      } catch { /* graceful */ } finally { setLoading(false); }
    })();
  }, [user]);

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';

  const totalTrips = trips.length;
  const totalDays = trips.reduce((s, t) => {
    if (t.start_date && t.end_date) return s + dayjs(t.end_date).diff(dayjs(t.start_date), 'day') + 1;
    return s;
  }, 0);
  const totalBudget = trips.reduce((s, t) => s + (Number(t.budget) || 0), 0);
  const countries = new Set(trips.map(t => t.country).filter(Boolean)).size;

  const stats = [
    { label: 'Total Trips Managed', value: totalTrips, icon: Map, trend: '+2 this month' },
    { label: 'Unique Countries', value: countries, icon: Globe, trend: 'Global scope' },
    { label: 'Duration Tracked (Days)', value: totalDays, icon: Calendar, trend: 'Across all trips' },
    { label: 'Projected Spend', value: `$${totalBudget.toLocaleString()}`, icon: Wallet, trend: 'Estimated' },
  ];

  return (
    <SidebarLayout title={`Welcome, ${displayName}`} subtitle="Overview of your current travel operations.">
      
      {/* Metric Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="erp-card p-5 hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
              <s.icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-semibold text-slate-900 mb-1">{s.value}</div>
            <div className="flex items-center text-xs text-slate-500 font-medium">
              <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900">Active Itineraries</h2>
        <button onClick={() => navigate('/trips/new')} className="erp-button py-1.5 px-3 text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" /> New Trip
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : trips.length === 0 ? (
        <div className="erp-card p-12 flex flex-col items-center justify-center text-center mb-8">
          <Map className="w-10 h-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 mb-1">No Active Itineraries</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm">There are currently no active trips in the system. Create a new trip to begin tracking operations.</p>
          <button onClick={() => navigate('/trips/new')} className="erp-button">
            New Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {trips.slice(0, 4).map(trip => (
            <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}/notes`)} />
          ))}
        </div>
      )}

      {/* Structured data table for popular destinations */}
      {cities.length > 0 && (
        <div className="erp-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">Popular Destinations Database</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Destination</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Region</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Cost Index</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cities.map(city => (
                  <tr key={city.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <span className="text-lg">{city.flag_emoji || '🌍'}</span>
                      <span className="text-sm font-medium text-slate-900">{city.name}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{city.country || city.region}</td>
                    <td className="px-5 py-3">
                      <span className={`erp-badge ${city.cost_index <= 1 ? 'bg-emerald-100 text-emerald-700' : city.cost_index <= 2 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {city.cost_index <= 1 ? '$' : city.cost_index <= 2 ? '$$' : '$$$'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Explore &rarr;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
