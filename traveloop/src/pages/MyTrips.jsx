import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { getTrips, deleteTrip } from '../lib/api.js';
import SidebarLayout from '../components/SidebarLayout.jsx';
import TripCard from '../components/TripCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import { Map, Plus } from 'lucide-react';

export default function MyTrips() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTrips = async () => {
    try {
      if (user) {
        const data = await getTrips(user.id);
        setTrips(data || []);
      }
    } catch { /* graceful */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, [user]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTrip(deleteTarget.id);
      setTrips(trips.filter(t => t.id !== deleteTarget.id));
      addToast('Trip deleted successfully');
    } catch {
      addToast('Failed to delete trip', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <SidebarLayout title="My Trips" subtitle="Manage all your active and historic travel records.">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-900">{trips.length}</span> records
        </div>
        <button onClick={() => navigate('/trips/new')} className="erp-button py-1.5 px-3">
          <Plus className="w-4 h-4 mr-1.5" /> New Trip
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState 
          icon={Map}
          title="No Trips Found"
          message="Your travel records are empty. Create a new trip to begin tracking."
          actionLabel="Create Trip"
          onAction={() => navigate('/trips/new')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onClick={() => navigate(`/trips/${trip.id}/notes`)}
              onDelete={t => setDeleteTarget(t)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Trip Record">
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to permanently delete the travel record <span className="font-semibold text-slate-900">"{deleteTarget?.name}"</span>? 
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          <button onClick={() => setDeleteTarget(null)} className="erp-button-secondary">Cancel</button>
          <button onClick={handleDelete} className="erp-button bg-rose-600 hover:bg-rose-700 focus:ring-rose-500">Confirm Deletion</button>
        </div>
      </Modal>
    </SidebarLayout>
  );
}
