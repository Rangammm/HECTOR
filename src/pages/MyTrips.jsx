import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getTrips, deleteTrip } from '../lib/api.js';
import Navbar from '../components/Navbar.jsx';
import TripCard from '../components/TripCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import { Plus, SlidersHorizontal, Map } from 'lucide-react';
import dayjs from 'dayjs';

const FILTERS = ['All', 'Upcoming', 'Past', 'Shared'];
const SORTS = [
  { label: 'Date', value: 'date' },
  { label: 'Name', value: 'name' },
  { label: 'Budget', value: 'budget' },
];

export default function MyTrips() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('date');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrips = async () => {
    if (!user) return;
    try {
      const data = await getTrips(user.id);
      setTrips(data || []);
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, [user]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTrip(deleteTarget.id);
      setTrips(prev => prev.filter(t => t.id !== deleteTarget.id));
      addToast('Trip deleted');
    } catch { addToast('Failed to delete trip', 'error'); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const now = dayjs();
  const filtered = trips.filter(t => {
    if (filter === 'Upcoming') return t.start_date && dayjs(t.start_date).isAfter(now);
    if (filter === 'Past') return t.end_date && dayjs(t.end_date).isBefore(now);
    if (filter === 'Shared') return t.is_public;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sort === 'budget') return (Number(b.budget) || 0) - (Number(a.budget) || 0);
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold text-ink-900">My Trips</h1>
          <button onClick={() => navigate('/trips/new')} className="flex items-center gap-2 px-5 py-2.5 bg-sunset-500 text-white font-semibold rounded-xl text-sm hover:bg-sunset-600 transition-colors duration-200">
            <Plus className="w-4 h-4" /> New Trip
          </button>
        </div>

        {/* Filters + Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-1 p-1 bg-sand-100 rounded-xl">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${filter === f ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-700'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <SlidersHorizontal className="w-4 h-4 text-ink-400" />
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm bg-white border border-sand-200 rounded-lg px-3 py-1.5 text-ink-700 focus:outline-none focus:ring-2 focus:ring-sunset-500/20">
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState title="No trips found" message="Create your first trip and start planning your adventure." actionLabel="Create Trip" onAction={() => navigate('/trips/new')} icon={Map} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sorted.map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}/notes`)} onDelete={setDeleteTarget} onEdit={() => navigate(`/trips/new?edit=${trip.id}`)} />
            ))}
          </div>
        )}

        {/* Delete modal */}
        <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Trip">
          <p className="text-sm text-ink-400 mb-6">
            Are you sure you want to delete <strong className="text-ink-900">{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-ink-700 bg-sand-100 rounded-xl hover:bg-sand-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-sunset-500 rounded-xl hover:bg-sunset-600 disabled:opacity-50 transition-colors">
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
