import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, MapPin, Calendar, Clock, DollarSign, Activity } from 'lucide-react';
import { useTrip } from '../hooks/useTrip.js';
import { reorderStops, deleteStop, deleteActivity } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';
import CitySearchModal from '../components/CitySearchModal.jsx';
import ActivityDrawer from '../components/ActivityDrawer.jsx';
import { SkeletonCard } from '../components/ui/Skeleton.jsx';
import dayjs from 'dayjs';

function SortableStopCard({ stop, isActive, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center p-3 mb-3 rounded-xl border cursor-pointer transition-all ${
        isDragging ? 'drag-overlay bg-[var(--bg-card)] border-[var(--accent)]' :
        isActive ? 'bg-[var(--accent-bg)] border-[var(--accent-border)]' : 'bg-[var(--bg-base)] border-[var(--border)] hover:border-[var(--text-muted)]'
      }`}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-grab active:cursor-grabbing">
        <GripVertical size={18} />
      </div>
      <div className="flex-1 ml-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-xl">{stop.flag}</span> {stop.city_name}
          </h3>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1"><Calendar size={12} /> {dayjs(stop.arrival_date).format('MMM D')}</span>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(stop.id); }}
        className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-red-400 transition-opacity"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function ItineraryBuilder() {
  const { id } = useParams();
  const { trip, stops, setStops, activities, setActivities, loading } = useTrip(id);
  const { addToast } = useToast();
  
  const [activeStopId, setActiveStopId] = useState(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (stops.length > 0 && !activeStopId) {
      setActiveStopId(stops[0].id);
    }
  }, [stops, activeStopId]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex(s => s.id === active.id);
    const newIndex = stops.findIndex(s => s.id === over.id);
    const newStops = arrayMove(stops, oldIndex, newIndex);
    
    setStops(newStops);
    
    try {
      await reorderStops(id, newStops.map(s => s.id));
    } catch (err) {
      addToast('Failed to save new order', 'error');
      // Revert if needed, but keeping optimistic for now
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!confirm('Are you sure you want to delete this stop and all its activities?')) return;
    try {
      await deleteStop(stopId);
      setStops(stops.filter(s => s.id !== stopId));
      if (activeStopId === stopId) setActiveStopId(stops[0]?.id || null);
      addToast('Stop deleted', 'success');
    } catch (err) {
      addToast('Failed to delete stop', 'error');
    }
  };

  const handleUpdateActivityCost = async (activityId, newCost) => {
    try {
      const { error } = await supabase.from('activities').update({ cost: newCost }).eq('id', activityId);
      if (error) throw error;
      setActivities(prev => {
        const updated = { ...prev };
        updated[activeStopId] = updated[activeStopId].map(a => a.id === activityId ? { ...a, cost: newCost } : a);
        return updated;
      });
    } catch (err) {
      addToast('Failed to update cost', 'error');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(activityId);
      setActivities(prev => {
        const updated = { ...prev };
        updated[activeStopId] = updated[activeStopId].filter(a => a.id !== activityId);
        return updated;
      });
      addToast('Activity removed', 'success');
    } catch (err) {
      addToast('Failed to remove activity', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-73px)] p-6 gap-6">
        <div className="w-[360px] flex flex-col gap-4"><SkeletonCard /><SkeletonCard /></div>
        <div className="flex-1 glass-card p-6"><SkeletonCard lines={6} /></div>
      </div>
    );
  }

  const activeStop = stops.find(s => s.id === activeStopId);
  const activeActivities = activeStop ? (activities[activeStop.id] || []) : [];
  const stopTotalCost = activeActivities.reduce((sum, act) => sum + (Number(act.cost) || 0), 0);

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* LEFT PANEL: STOPS */}
      <div className="w-[360px] border-r border-[var(--border)] bg-[var(--bg-surface)] flex flex-col z-10 shadow-lg">
        <div className="p-5 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MapPin className="text-[var(--accent)]" /> Itinerary Stops
          </h2>
          <button 
            onClick={() => setIsCityModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            <Plus size={18} /> Add Stop
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {stops.map(stop => (
                <SortableStopCard 
                  key={stop.id} 
                  stop={stop} 
                  isActive={activeStopId === stop.id} 
                  onClick={() => setActiveStopId(stop.id)}
                  onDelete={handleDeleteStop}
                />
              ))}
            </SortableContext>
          </DndContext>
          {stops.length === 0 && (
            <div className="text-center py-10 text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-xl">
              No stops yet. Add a city to begin!
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: EDITOR */}
      <div className="flex-1 flex flex-col bg-[var(--bg-base)]">
        {activeStop ? (
          <>
            <div className="px-8 py-6 border-b border-[var(--border)] bg-[var(--bg-surface)] flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                  <span className="text-4xl">{activeStop.flag}</span> {activeStop.city_name}
                </h1>
                <p className="text-[var(--text-secondary)] mt-2 flex items-center gap-2">
                  <Calendar size={16} /> 
                  {dayjs(activeStop.arrival_date).format('ddd, D MMM YYYY')} 
                  <span className="mx-2 text-[var(--border)]">|</span>
                  {activeActivities.length} Activities planned
                </p>
              </div>
              <button 
                onClick={() => setIsActivityDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm"
              >
                <Plus size={18} /> Add Activity
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-4">
                {activeActivities.length > 0 ? (
                  activeActivities.map(act => (
                    <div key={act.id} className="flex items-center gap-4 p-4 rounded-xl glass-card group hover:border-[var(--accent-border)] transition-colors">
                      <div className="w-24 text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1">
                        <Clock size={14} /> {act.time_slot}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--text-primary)] text-lg mb-1">{act.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider badge-${act.type.toLowerCase()}`}>
                          {act.type}
                        </span>
                      </div>
                      <div className="w-32 flex items-center gap-2">
                        <div className="relative flex-1">
                          <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                          <input 
                            type="number" 
                            defaultValue={act.cost}
                            onBlur={(e) => {
                              if (Number(e.target.value) !== act.cost) {
                                handleUpdateActivityCost(act.id, Number(e.target.value));
                              }
                            }}
                            className="w-full bg-[var(--bg-base)] border border-[var(--border)] rounded px-2 py-1.5 pl-6 text-[var(--text-primary)] text-sm focus:border-[var(--accent)] focus:outline-none"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteActivity(act.id)}
                        className="p-2 text-[var(--border)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] border-dashed">
                    <Activity size={48} className="mx-auto mb-4 text-[var(--border)]" />
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No activities yet</h3>
                    <p className="text-[var(--text-muted)] max-w-md mx-auto">Start planning your days in {activeStop.city_name} by adding places to visit, restaurants, and experiences.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-surface)]">
              <div className="max-w-4xl mx-auto flex justify-between items-center bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)] font-medium">Estimated Stop Cost</span>
                <span className="text-2xl font-bold gradient-text">${stopTotalCost.toLocaleString()}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] flex-col gap-4">
            <MapPin size={48} className="opacity-20" />
            <p>Select a stop from the left panel to edit its itinerary.</p>
          </div>
        )}
      </div>

      <CitySearchModal 
        isOpen={isCityModalOpen} 
        onClose={() => setIsCityModalOpen(false)} 
        tripId={id} 
        onStopAdded={(newStop) => {
          setStops([...stops, newStop]);
          setActiveStopId(newStop.id);
        }} 
      />

      {activeStop && (
        <ActivityDrawer 
          isOpen={isActivityDrawerOpen} 
          onClose={() => setIsActivityDrawerOpen(false)} 
          stopId={activeStop.id} 
          onActivityAdded={(newAct) => {
            setActivities(prev => {
              const updated = { ...prev };
              if (!updated[activeStop.id]) updated[activeStop.id] = [];
              updated[activeStop.id] = [...updated[activeStop.id], newAct];
              return updated;
            });
          }}
        />
      )}
    </div>
  );
}
