import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Plus, Trash2, Zap, RotateCcw, CheckSquare } from 'lucide-react';
import { useTrip } from '../hooks/useTrip.js';
import { getChecklist, addChecklistItem, toggleChecklistItem } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';
import { useToast } from '../hooks/useToast.jsx';

const CATEGORIES = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Other'];

export default function ChecklistPage() {
  const { id } = useParams();
  const { trip } = useTrip(id);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [newItem, setNewItem] = useState({ category: 'Clothing', name: '' });

  useEffect(() => {
    async function load() {
      try {
        const data = await getChecklist(id);
        setItems(data);
      } catch (err) {
        addToast('Failed to load checklist', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, addToast]);

  const handleToggle = async (itemId, isPacked) => {
    // Optimistic UI
    setItems(items.map(i => i.id === itemId ? { ...i, is_packed: isPacked } : i));
    try {
      await toggleChecklistItem(itemId, isPacked);
    } catch (err) {
      // Revert on error
      setItems(items.map(i => i.id === itemId ? { ...i, is_packed: !isPacked } : i));
      addToast('Failed to update item', 'error');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    try {
      const added = await addChecklistItem({
        trip_id: id,
        category: newItem.category,
        name: newItem.name,
        is_packed: false
      });
      setItems([...items, added]);
      setNewItem({ ...newItem, name: '' });
    } catch (err) {
      addToast('Failed to add item', 'error');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await supabase.from('checklist_items').delete().eq('id', itemId);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  const handleSmartSuggest = async () => {
    // A real app might base this on destination/duration. We'll use a static smart list.
    const suggestions = [
      { category: 'Documents', name: 'Passport / ID' },
      { category: 'Documents', name: 'Travel Insurance' },
      { category: 'Clothing', name: 'Underwear & Socks' },
      { category: 'Clothing', name: 'Comfortable Walking Shoes' },
      { category: 'Electronics', name: 'Phone Charger & Adapter' },
      { category: 'Electronics', name: 'Power Bank' },
      { category: 'Toiletries', name: 'Toothbrush & Paste' },
      { category: 'Toiletries', name: 'Deodorant' },
      { category: 'Other', name: 'Sunglasses' },
      { category: 'Other', name: 'Water Bottle' },
    ];

    try {
      // Filter out items that already exist
      const existingNames = new Set(items.map(i => i.name.toLowerCase()));
      const toAdd = suggestions.filter(s => !existingNames.has(s.name.toLowerCase()));
      
      if (toAdd.length === 0) {
        addToast('All suggestions are already in your list!', 'info');
        return;
      }

      const adds = toAdd.map(s => ({ trip_id: id, ...s, is_packed: false }));
      const { data, error } = await supabase.from('checklist_items').insert(adds).select();
      if (error) throw error;
      
      setItems([...items, ...data]);
      addToast(`Added ${data.length} suggested items`, 'success');
    } catch (err) {
      addToast('Failed to add suggestions', 'error');
    }
  };

  const handleReset = async () => {
    if (!confirm('Uncheck all items?')) return;
    try {
      const packedIds = items.filter(i => i.is_packed).map(i => i.id);
      if (packedIds.length === 0) return;
      
      // Opt UI
      setItems(items.map(i => ({ ...i, is_packed: false })));
      
      await supabase.from('checklist_items').update({ is_packed: false }).in('id', packedIds);
      addToast('List reset', 'success');
    } catch (err) {
      addToast('Failed to reset list', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center text-[var(--text-muted)]">Loading checklist...</div>;

  const totalItems = items.length;
  const packedItems = items.filter(i => i.is_packed).length;
  const progressPercent = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-base)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Progress */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--accent)] to-[var(--pink)] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--text-primary)] mb-2 flex items-center gap-3">
                <CheckSquare className="text-[var(--accent)]" /> Packing List
              </h1>
              <p className="text-[var(--text-secondary)]">
                {packedItems} of {totalItems} items packed ({progressPercent}%)
              </p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={handleSmartSuggest} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-white transition-colors font-medium">
                <Zap size={16} /> Smart Suggest
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors font-medium">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[var(--bg-elevated)] h-3 rounded-full overflow-hidden border border-[var(--border-subtle)] relative z-10">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="glass-card p-4">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
            <select 
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
              className="bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] min-w-[160px]"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="What do you need to pack?"
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              className="flex-1 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button 
              type="submit"
              disabled={!newItem.name.trim()}
              className="px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <Plus size={18} /> Add
            </button>
          </form>
        </div>

        {/* Checklist Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map(category => {
            const catItems = items.filter(i => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="glass-card overflow-hidden">
                <div className="p-4 bg-[var(--bg-elevated)] border-b border-[var(--border)] flex justify-between items-center">
                  <h3 className="font-bold text-[var(--text-primary)]">{category}</h3>
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {catItems.filter(i => i.is_packed).length}/{catItems.length}
                  </span>
                </div>
                <div className="p-2 space-y-1">
                  {catItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-3 rounded-lg group transition-colors cursor-pointer ${item.is_packed ? 'bg-[var(--bg-surface)] opacity-60' : 'hover:bg-[var(--bg-elevated)]'}`}
                      onClick={() => handleToggle(item.id, !item.is_packed)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${item.is_packed ? 'bg-[var(--accent)] border-[var(--accent)] text-white check-pop' : 'border-[var(--text-muted)] text-transparent'}`}>
                          <Check size={14} />
                        </div>
                        <span className={`font-medium transition-all ${item.is_packed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                          {item.name}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-1.5 text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
