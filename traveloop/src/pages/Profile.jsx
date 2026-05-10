import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../hooks/useToast.jsx';
import SidebarLayout from '../components/SidebarLayout.jsx';
import { User, Loader2, Save, ShieldAlert, Key } from 'lucide-react';

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setProfile({ name: formData.name, bio: formData.bio });
      addToast('Profile updated successfully', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout title="User Preferences" subtitle="Manage your account profile and system preferences.">
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="erp-card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Identity Information</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="erp-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="erp-input max-w-md"
                  placeholder="Operational Handle"
                />
              </div>

              <div>
                <label className="erp-label">Biography / Title</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="erp-input resize-none max-w-full"
                  placeholder="Department, Role, or Context..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button disabled={loading} className="erp-button">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Security (Placeholder) */}
          <div className="erp-card overflow-hidden opacity-75">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
              <Key className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Security Diagnostics</h2>
            </div>
            <div className="p-6">
               <p className="text-sm text-slate-500">Security configurations and MFA are currently managed externally via the SSO provider.</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="space-y-6">
           <div className="erp-card p-6 border-indigo-200 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
             <div className="w-16 h-16 rounded shadow-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">{(formData.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
             </div>
             <h3 className="text-center font-bold text-slate-900 text-lg">{formData.name || 'Anonymous User'}</h3>
             <p className="text-center text-sm text-slate-500 mb-6">{user?.email}</p>

             <div className="space-y-3 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">System ID</span>
                 <span className="font-mono text-xs text-slate-900 bg-slate-100 px-1 py-0.5 rounded">{user?.id.substring(0, 8)}...</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Privilege Level</span>
                 <span className={`erp-badge ${profile?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                   {profile?.role === 'admin' ? 'Administrator' : 'Standard User'}
                 </span>
               </div>
             </div>
           </div>

           {profile?.role === 'admin' && (
             <div className="erp-card p-4 bg-amber-50 border-amber-200 flex gap-3 items-start">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                   <h4 className="text-sm font-semibold text-amber-900 mb-1">Elevated Privileges Active</h4>
                   <p className="text-xs text-amber-700/80 leading-relaxed">You hold administrative permissions. Be cautious when exercising system-wide modifications.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </SidebarLayout>
  );
}
