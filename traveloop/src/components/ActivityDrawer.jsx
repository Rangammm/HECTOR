import { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../hooks/useToast.jsx';
import { createActivity } from '../lib/api.js';

export default function ActivityDrawer({ isOpen, onClose, stopId, onActivityAdded }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'misc',
    time_slot: '10:00',
    cost: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const act = await createActivity({
        ...formData,
        stop_id: stopId,
        cost: formData.cost ? Number(formData.cost) : 0
      });
      onActivityAdded(act);
      addToast('Operation scheduled successfully', 'success');
      onClose();
    } catch {
      addToast('Failed to schedule operation', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Schedule Operation</h2>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          <div>
            <label className="erp-label">Operation Identifier *</label>
            <input
              type="text"
              required
              autoFocus
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="erp-input"
              placeholder="e.g. Stakeholder Meeting / Transit"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="erp-label">Category</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="erp-input"
              >
                <option value="lodging">Lodging</option>
                <option value="flight">Flight</option>
                <option value="transit">Transit</option>
                <option value="dining">Dining</option>
                <option value="activity">Activity</option>
                <option value="misc">Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="erp-label">Time Window</label>
              <input
                type="time"
                value={formData.time_slot}
                onChange={e => setFormData({ ...formData, time_slot: e.target.value })}
                className="erp-input"
              />
            </div>
          </div>

          <div>
            <label className="erp-label">Allocated Cost (USD)</label>
            <input
              type="number"
              value={formData.cost}
              onChange={e => setFormData({ ...formData, cost: e.target.value })}
              className="erp-input"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="erp-label">Operational Briefing (Optional)</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="erp-input resize-none"
              placeholder="Addresses, contact info, specific instructions..."
            />
          </div>

        </form>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="erp-button-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="erp-button w-full sm:w-auto">
            {loading ? 'Committing...' : 'Schedule Operation'}
          </button>
        </div>
      </div>
    </>
  );
}
