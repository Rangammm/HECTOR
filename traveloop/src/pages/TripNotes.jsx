import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { getTripNotes, updateTripNotes } from '../lib/api.js';
import SidebarLayout from '../components/SidebarLayout.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { Save, Loader2, FileText } from 'lucide-react';

export default function TripNotes() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTripNotes(id);
        if (data) setNotes(data.notes || '');
      } catch (err) {
        addToast('Failed to load operational notes', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, addToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTripNotes(id, notes);
      addToast('Document synchronized successfully', 'success');
    } catch (err) {
      addToast('Failed to synchronize document', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SidebarLayout title="Document Editor"><div className="p-6 text-sm text-slate-500">Loading document...</div></SidebarLayout>;

  return (
    <SidebarLayout title="Operational Notes" subtitle="Main text buffer for ad-hoc instructions, links, and operational details.">
      <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
        
        <div className="erp-card flex flex-col h-full bg-white relative">
           <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                <FileText className="w-4 h-4 text-indigo-500" />
                Raw Text Document
              </div>
              <button 
                onClick={handleSave} 
                disabled={saving} 
                className="erp-button py-1.5 px-4 text-xs"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Syncing...' : 'Synchronize'}
              </button>
           </div>
           
           <div className="flex-1 p-0 relative">
             <textarea
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="# Project Notes\n\n- Add flight confirmation numbers...\n- Important links..."
               className="w-full h-full resize-none p-6 text-sm placeholder:text-slate-300 font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/20"
             />
           </div>
           
           <div className="px-5 py-2 border-t border-slate-200 bg-slate-50 flex justify-between text-xs text-slate-500 font-medium">
             <span>Buffer formatting: Markdown Supported</span>
             <span>Words: {notes.split(/\s+/).filter(w => w.length > 0).length}</span>
           </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
