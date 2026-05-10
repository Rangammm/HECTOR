import { useState } from 'react';
import Modal from './Modal.jsx';
import { createStop } from '../lib/api.js';
import { useToast } from '../hooks/useToast.jsx';

export default function CitySearchModal({ isOpen, onClose, tripId, onStopAdded }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    city_name: '',
    arrival_date: '',
    departure_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.city_name || !formData.arrival_date) {
      return addToast('City name and arrival date are required parameters', 'error');
    }

    setLoading(true);
    try {
      const newStop = await createStop({ ...formData, trip_id: tripId });
      onStopAdded(newStop);
      addToast('Travel node initialized', 'success');
      onClose();
    } catch (err) {
      addToast('Failed to initialize node', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Initialize Travel Node">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="erp-label">Node Identifier (City/Location)</label>
          <input
            type="text"
            required
            autoFocus
            value={formData.city_name}
            onChange={e => setFormData({ ...formData, city_name: e.target.value })}
            placeholder="e.g. Tokyo, JP"
            className="erp-input"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="erp-label">Arrival Date</label>
            <input
              type="date"
              required
              value={formData.arrival_date}
              onChange={e => setFormData({ ...formData, arrival_date: e.target.value })}
              className="erp-input"
            />
          </div>
          <div>
            <label className="erp-label">Departure Date</label>
            <input
              type="date"
              value={formData.departure_date}
              onChange={e => setFormData({ ...formData, departure_date: e.target.value })}
              className="erp-input"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="erp-button-secondary py-1.5 px-4 text-xs">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="erp-button py-1.5 px-4 text-xs">
            {loading ? 'Processing...' : 'Initialize Node'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
