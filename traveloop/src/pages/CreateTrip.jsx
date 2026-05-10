import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import SidebarLayout from '../components/SidebarLayout.jsx';
import { Map, Loader2, Save } from 'lucide-react';

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_public: false,
    budget: '',
    country: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return addToast('Trip name is required', 'error');

    setLoading(true);
    try {
      const trip = await createTrip(user.id, formData);
      addToast('Travel record created successfully', 'success');
      navigate(`/trips/${trip.id}/build`);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout title="New Travel Record" subtitle="Initialize a new operational itinerary in the system.">
      <div className="max-w-3xl mx-auto mt-6">
        <form onSubmit={handleSubmit} className="erp-card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-700">
               <Map className="w-4 h-4" />
             </div>
             <div>
                <h2 className="text-base font-semibold text-slate-900 leading-tight">Configuration Profile</h2>
                <p className="text-xs text-slate-500">Define the core parameters and metadata for this record.</p>
             </div>
          </div>
          
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="erp-label">Record Title / Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Japan Q3 Expansion"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="erp-input"
                />
              </div>

              <div>
                <label className="erp-label">Target Primary Country</label>
                <input
                  type="text"
                  placeholder="e.g., Japan"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="erp-input"
                />
              </div>

              <div>
                <label className="erp-label">Budget Allocation (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={e => setFormData({ ...formData, budget: e.target.value })}
                    className="erp-input pl-7"
                  />
                </div>
              </div>

              <div>
                <label className="erp-label">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  className="erp-input"
                />
              </div>

              <div>
                <label className="erp-label">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  className="erp-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="erp-label">Operational Briefing / Description</label>
                <textarea
                  rows={3}
                  placeholder="Additional context or initial planning notes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="erp-input resize-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={e => setFormData({ ...formData, is_public: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="is_public" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Public Record Classification
                  <p className="text-xs text-slate-500 font-normal">Allows the itinerary to be viewed by anyone with the link.</p>
                </label>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
             <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="erp-button-secondary"
             >
                Cancel
             </button>
             <button
                type="submit"
                disabled={loading}
                className="erp-button"
             >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Committing...' : 'Commit Record'}
             </button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
