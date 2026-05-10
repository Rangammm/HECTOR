import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getUserProfile, updateProfile, getTrips } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';
import Navbar from '../components/Navbar.jsx';
import Modal from '../components/Modal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Camera, Map, Globe, Activity, Trash2 } from 'lucide-react';

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'];

export default function Profile() {
  const { user, profile, setProfile, signOut } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', bio: '', email: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [lang, setLang] = useState('English');
  const [stats, setStats] = useState({ trips: 0, countries: 0, activities: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [p, trips] = await Promise.all([
          getUserProfile(user.id).catch(() => null),
          getTrips(user.id).catch(() => []),
        ]);
        if (p) {
          setForm({ name: p.name || '', bio: p.bio || '', email: user.email || '' });
          setAvatarPreview(p.avatar_url || null);
        } else {
          setForm(f => ({ ...f, email: user.email || '' }));
        }
        const countries = new Set((trips || []).map(t => t.country).filter(Boolean)).size;
        setStats({ trips: (trips || []).length, countries, activities: 0 });
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await updateProfile(user.id, { avatar_url: publicUrl });
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      addToast('Avatar updated');
    } catch {
      addToast('Failed to upload avatar', 'error');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, { name: form.name, bio: form.bio });
      setProfile(prev => ({ ...prev, ...updated }));
      addToast('Profile saved');
    } catch { addToast('Failed to save', 'error'); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    await signOut();
    addToast('Account sign-out complete');
    setDeleteModal(false);
  };

  if (loading) return (<div className="min-h-screen bg-sand-50"><Navbar /><LoadingSpinner /></div>);

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10 animate-fade-in-up">
        <h1 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold text-ink-900 mb-8">Profile & Settings</h1>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-ocean-500 flex items-center justify-center text-white text-2xl font-bold">
                {(form.name || form.email || 'T').charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-sunset-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sunset-600 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h2 className="font-semibold text-ink-900 text-lg">{form.name || 'Traveler'}</h2>
            <p className="text-sm text-ink-400">{form.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Map, label: 'Trips Created', value: stats.trips },
            { icon: Globe, label: 'Countries', value: stats.countries },
            { icon: Activity, label: 'Activities', value: stats.activities },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-card border border-sand-100 p-4 text-center">
              <s.icon className="w-5 h-5 text-ink-200 mx-auto mb-2" />
              <p className="font-[family-name:var(--font-family-heading)] font-bold text-ink-900 text-lg">{s.value}</p>
              <p className="text-xs text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-card border border-sand-100 p-6 space-y-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <input type="email" value={form.email} disabled
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-400 bg-sand-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-sunset-500 text-white font-semibold rounded-xl text-sm hover:bg-sunset-600 disabled:opacity-50 transition-colors duration-200">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-sunset-400/20 p-6">
          <h3 className="font-semibold text-sunset-600 mb-1">Danger Zone</h3>
          <p className="text-sm text-ink-400 mb-4">Once you delete your account, there is no going back.</p>
          <button onClick={() => setDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sunset-600 border border-sunset-400/30 rounded-xl hover:bg-sunset-500/5 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>

        <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
          <p className="text-sm text-ink-400 mb-6">Are you sure? This action is permanent and all your data will be lost.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteModal(false)} className="px-4 py-2 text-sm font-medium text-ink-700 bg-sand-100 rounded-xl hover:bg-sand-200 transition-colors">Cancel</button>
            <button onClick={handleDeleteAccount} className="px-4 py-2 text-sm font-medium text-white bg-sunset-500 rounded-xl hover:bg-sunset-600 transition-colors">Delete</button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
