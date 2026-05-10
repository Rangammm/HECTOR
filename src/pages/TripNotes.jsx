import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getNotes, createNote, deleteNote, getTripById } from '../lib/api.js';
import Navbar from '../components/Navbar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Modal from '../components/Modal.jsx';
import { Plus, Trash2, BookOpen, X } from 'lucide-react';
import dayjs from 'dayjs';

export default function TripNotes() {
  const { id: tripId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [trip, setTrip] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [t, n] = await Promise.all([
          getTripById(tripId),
          getNotes(tripId),
        ]);
        setTrip(t);
        setNotes(n || []);
      } catch { /* */ }
      finally { setLoading(false); }
    })();
  }, [tripId]);

  const handleAdd = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const note = await createNote({ trip_id: tripId, content: content.trim(), user_id: user.id });
      setNotes(prev => [note, ...prev]);
      setContent('');
      setShowForm(false);
      addToast('Note added');
    } catch { addToast('Failed to add note', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNote(deleteTarget);
      setNotes(prev => prev.filter(n => n.id !== deleteTarget));
      addToast('Note deleted');
    } catch { addToast('Failed to delete', 'error'); }
    finally { setDeleteTarget(null); }
  };

  if (loading) return (<div className="min-h-screen bg-sand-50"><Navbar /><LoadingSpinner /></div>);

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-in-up">
        <div className="mb-8">
          <p className="text-sm text-ink-400 mb-1">{trip?.name || 'Trip'}</p>
          <h1 className="font-[family-name:var(--font-family-heading)] text-3xl font-bold text-ink-900">Notes & Journal</h1>
        </div>

        {/* Add note form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-card border border-sand-100 p-5 mb-6 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-ink-900 text-sm">New Note</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-sand-100 transition-colors">
                <X className="w-4 h-4 text-ink-400" />
              </button>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Write your thoughts, tips, memories…"
              className="w-full px-4 py-3 rounded-xl border border-sand-200 text-sm text-ink-900 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all resize-none mb-3" />
            <div className="flex justify-end">
              <button onClick={handleAdd} disabled={saving || !content.trim()}
                className="px-5 py-2 bg-sunset-500 text-white text-sm font-semibold rounded-xl hover:bg-sunset-600 disabled:opacity-50 transition-colors duration-200">
                {saving ? 'Saving…' : 'Add Note'}
              </button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {notes.length === 0 ? (
          <EmptyState title="No notes yet" message="Capture your thoughts, tips, and memories for this trip." actionLabel="Add Note" onAction={() => setShowForm(true)} icon={BookOpen} />
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-2xl shadow-card border border-sand-100 p-5 group animate-slide-in-right">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    <p className="text-xs text-ink-200 mt-3">
                      {dayjs(note.created_at).format('ddd DD MMM, h:mma')}
                    </p>
                  </div>
                  <button onClick={() => setDeleteTarget(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-sunset-500/5 transition-all duration-200">
                    <Trash2 className="w-4 h-4 text-sunset-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAB */}
        <button onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-sunset-500 text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-sunset-600 hover:shadow-xl transition-all duration-200 ease-out hover:scale-105">
          <Plus className="w-6 h-6" />
        </button>

        {/* Delete modal */}
        <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Note">
          <p className="text-sm text-ink-400 mb-6">Are you sure you want to delete this note?</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-ink-700 bg-sand-100 rounded-xl hover:bg-sand-200 transition-colors">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-sunset-500 rounded-xl hover:bg-sunset-600 transition-colors">Delete</button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
