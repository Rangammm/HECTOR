import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createTrip } from '../lib/api.js';
import Navbar from '../components/Navbar.jsx';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function CreateTrip() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', description: '', start_date: '', end_date: '', is_public: false });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const update = (key, val) => { setForm(f => ({ ...f, [key]: val })); setDirty(true); };

  // Unsaved changes warning
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setDirty(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { addToast('Trip name is required', 'error'); return; }
    setSaving(true);
    try {
      const trip = { ...form, user_id: user.id, budget: 0 };
      // Cover upload could go to Supabase storage — skipped for now
      if (coverPreview) trip.cover_url = coverPreview;
      await createTrip(trip);
      setDirty(false);
      addToast('Trip created!');
      navigate('/trips');
    } catch (err) {
      addToast(err.message || 'Failed to create trip', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="max-w-[640px] mx-auto px-6 py-10 animate-fade-in-up">
        <h1 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold text-ink-900 mb-8">Create New Trip</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover photo */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-2">Cover Photo</label>
            {coverPreview ? (
              <div className="relative rounded-2xl overflow-hidden h-48">
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                  <X className="w-4 h-4 text-ink-700" />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('cover-input').click()}
                className="h-48 border-2 border-dashed border-sand-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-sunset-400 hover:bg-sunset-500/5 transition-all duration-200"
              >
                <Upload className="w-8 h-8 text-ink-200" />
                <p className="text-sm text-ink-400">Drag & drop or click to upload</p>
                <p className="text-xs text-ink-200">JPG, PNG up to 5MB</p>
              </div>
            )}
            <input id="cover-input" type="file" accept="image/*" className="hidden" onChange={handleDrop} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Trip Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Summer in Goa" maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="A relaxing beach trip with friends…" rows={4} maxLength={500}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all resize-none" />
            <p className="text-xs text-ink-200 text-right mt-1">{form.description.length}/500</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Start Date</label>
              <input type="date" value={form.start_date} onChange={e => update('start_date', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">End Date</label>
              <input type="date" value={form.end_date} onChange={e => update('end_date', e.target.value)} min={form.start_date}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all" />
            </div>
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-sand-100 shadow-card p-4">
            <div>
              <p className="text-sm font-medium text-ink-900">Public Trip</p>
              <p className="text-xs text-ink-400">Anyone with the link can view</p>
            </div>
            <button type="button" onClick={() => update('is_public', !form.is_public)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${form.is_public ? 'bg-sunset-500' : 'bg-sand-200'}`}>
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${form.is_public ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving}
            className="w-full py-3 bg-sunset-500 text-white font-semibold rounded-xl text-sm hover:bg-sunset-600 disabled:opacity-50 transition-colors duration-200 shadow-md">
            {saving ? 'Creating…' : 'Create Trip'}
          </button>
        </form>
      </main>
    </div>
  );
}
