import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, Trash2, Edit2, Check, DollarSign, AlertCircle } from 'lucide-react';
import { useTrip } from '../hooks/useTrip.js';
import { getBudgetItems, createBudgetItem, deleteBudgetItem, updateTrip } from '../lib/api.js';
import { useToast } from '../hooks/useToast.jsx';

const COLORS = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4'];

export default function BudgetPage() {
  const { id } = useParams();
  const { trip, setTrip, activities } = useTrip(id);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState(0);

  const [newItem, setNewItem] = useState({ category: 'Transport', description: '', amount: '' });

  const categories = ['Transport', 'Stay', 'Activities', 'Meals', 'Other'];

  useEffect(() => {
    async function load() {
      try {
        const data = await getBudgetItems(id);
        setItems(data);
        if (trip) setNewTotalBudget(trip.total_budget || 0);
      } catch {
        addToast('Failed to load budget', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, trip, addToast]);

  const handleUpdateTotalBudget = async () => {
    try {
      const updated = await updateTrip(id, { total_budget: Number(newTotalBudget) });
      setTrip(updated);
      setIsEditingBudget(false);
      addToast('Budget updated', 'success');
    } catch {
      addToast('Failed to update budget', 'error');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.description || !newItem.amount) return;
    
    try {
      const added = await createBudgetItem({
        trip_id: id,
        category: newItem.category,
        description: newItem.description,
        amount: Number(newItem.amount)
      });
      setItems([...items, added]);
      setNewItem({ category: 'Transport', description: '', amount: '' });
      addToast('Expense added', 'success');
    } catch {
      addToast('Failed to add expense', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteBudgetItem(itemId);
      setItems(items.filter(i => i.id !== itemId));
      addToast('Expense removed', 'success');
    } catch {
      addToast('Failed to remove expense', 'error');
    }
  };

  if (loading || !trip) return <div className="p-8 text-center text-[var(--text-muted)]">Loading budget...</div>;

  // Calculate totals
  const manualItemsTotal = items.reduce((sum, item) => sum + Number(item.amount), 0);
  
  // Also include activity costs automatically
  const activityCosts = Object.values(activities).flat().reduce((sum, act) => sum + (Number(act.cost) || 0), 0);
  
  const estimatedTotal = manualItemsTotal + activityCosts;
  const isOverBudget = trip.total_budget > 0 && estimatedTotal > trip.total_budget;


  // Prepare Pie Chart Data
  const pieData = categories.map(cat => {
    let value = items.filter(i => i.category === cat).reduce((sum, i) => sum + Number(i.amount), 0);
    if (cat === 'Activities') value += activityCosts;
    return { name: cat, value };
  }).filter(d => d.value > 0);

  // Mock Bar Chart Data (Cost per day)
  const barData = [
    { day: 'Day 1', cost: 120, limit: 150 },
    { day: 'Day 2', cost: 180, limit: 150 },
    { day: 'Day 3', cost: 90, limit: 150 },
    { day: 'Day 4', cost: 210, limit: 150 },
    { day: 'Day 5', cost: 140, limit: 150 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-base)] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Status */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--text-primary)] mb-2">Budget Planning</h1>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${isOverBudget ? 'banner-warning' : 'banner-success'}`}>
              {isOverBudget ? <AlertCircle size={16} /> : <Check size={16} />}
              {isOverBudget ? 'Over Budget' : 'Under Budget'}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="glass-card p-4 min-w-[200px]">
              <div className="text-[var(--text-secondary)] text-sm mb-1">Total Budget</div>
              {isEditingBudget ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-[var(--text-primary)] font-bold">$</span>
                  <input 
                    autoFocus
                    type="number" 
                    value={newTotalBudget} 
                    onChange={e => setNewTotalBudget(e.target.value)}
                    className="bg-[var(--bg-base)] border border-[var(--border)] rounded px-2 py-1 w-24 text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button onClick={handleUpdateTotalBudget} className="p-1.5 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)]">
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">${(trip.total_budget || 0).toLocaleString()}</div>
                  <button onClick={() => setIsEditingBudget(true)} className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="glass-card p-4 min-w-[200px] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <DollarSign size={80} />
              </div>
              <div className="text-[var(--text-secondary)] text-sm mb-1">Estimated Total</div>
              <div className={`text-3xl font-bold ${isOverBudget ? 'text-[var(--sunset)]' : 'gradient-text'}`}>
                ${estimatedTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Cost Breakdown</h3>
            <div className="h-[280px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `$${value}`}
                      contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--text-muted)]">No expenses added yet</div>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Daily Spending</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'var(--bg-elevated)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cost > entry.limit ? 'var(--sunset)' : 'var(--accent)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Itemized Expenses</h3>
          </div>
          
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-base)] text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                  <th className="p-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {/* Fixed Activity Row */}
                <tr className="bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors opacity-80">
                  <td className="p-4">
                    <span className="text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full badge-sight">Activities</span>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">Auto-calculated from itinerary</td>
                  <td className="p-4 text-right font-bold text-[var(--text-primary)]">${activityCosts.toLocaleString()}</td>
                  <td className="p-4 text-center"></td>
                </tr>

                {/* Manual Items */}
                {items.map(item => (
                  <tr key={item.id} className="bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors group">
                    <td className="p-4">
                      <span className={`text-[10px] uppercase tracking-wider py-1 px-2.5 rounded-full badge-${item.category.toLowerCase() === 'stay' ? 'culture' : item.category.toLowerCase() === 'transport' ? 'adventure' : 'other'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-primary)] font-medium">{item.description}</td>
                    <td className="p-4 text-right font-bold text-[var(--text-primary)]">${Number(item.amount).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Add New Row */}
                <tr className="bg-[var(--bg-base)]">
                  <td className="p-4" colSpan="4">
                    <form onSubmit={handleAddItem} className="flex gap-4">
                      <select 
                        value={newItem.category}
                        onChange={e => setNewItem({...newItem, category: e.target.value})}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input 
                        type="text" 
                        placeholder="Expense description..."
                        value={newItem.description}
                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                        className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                      />
                      <div className="relative w-32">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={newItem.amount}
                          onChange={e => setNewItem({...newItem, amount: e.target.value})}
                          className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={!newItem.description || !newItem.amount}
                        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                      >
                        <Plus size={16} /> Add
                      </button>
                    </form>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
