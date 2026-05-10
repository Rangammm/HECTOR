import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, MapPin, Calendar, Clock, DollarSign, Activity } from 'lucide-react';
import { useTrip } from '../hooks/useTrip.js';
import { useToast } from '../hooks/useToast.jsx';
import { reorderStops, deleteStop, deleteActivity } from '../lib/api.js';
import { supabase } from '../lib/supabase.js';
import SidebarLayout from '../components/SidebarLayout.jsx';
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
      className={`group relative flex items-center p-3 mb-2 rounded border cursor-pointer transition-all ${
        isDragging ? 'shadow-lg bg-white border-indigo-500' :
        isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 ml-2 min-w-0">
        <h3 className="font-medium text-sm text-slate-900 flex items-center gap-2 truncate">
          <span className="text-lg">{stop.flag}</span> {stop.city_name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
          <Calendar size={10} /> {dayjs(stop.arrival_date).format('MMM D')}
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(stop.id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"
        title="Delete Stop"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!confirm('Are you sure you want to delete this stop and all its activities?')) return;
    try {
      await deleteStop(stopId);
      setStops(stops.filter(s => s.id !== stopId));
      if (activeStopId === stopId) setActiveStopId(stops[0]?.id || null);
      addToast('Stop record removed', 'success');
    } catch (err) {
      addToast('Failed to remove stop', 'error');
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
      addToast('Activity record removed', 'success');
    } catch (err) {
      addToast('Failed to remove activity', 'error');
    }
  };

  if (loading) {
    return (
      <SidebarLayout title="Itinerary Builder">
        <div className="flex h-[calc(100vh-140px)] gap-4">
          <div className="w-80 flex flex-col gap-3"><SkeletonCard /><SkeletonCard /></div>
          <div className="flex-1 erp-card p-6 border-slate-200 bg-white"><SkeletonCard lines={6} /></div>
        </div>
      </SidebarLayout>
    );
  }

  const activeStop = stops.find(s => s.id === activeStopId);
  const activeActivities = activeStop ? (activities[activeStop.id] || []) : [];
  const stopTotalCost = activeActivities.reduce((sum, act) => sum + (Number(act.cost) || 0), 0);

  return (
    <SidebarLayout 
      title={trip?.name || 'Itinerary Builder'} 
      subtitle="Structurally define travel nodes and activity pipelines."
    >
      <div className="flex h-[calc(100vh-140px)] gap-6">
        
        {/* LEFT PANEL: STOPS */}
        <div className="w-80 flex items-stretch">
          <div className="erp-card flex flex-col w-full h-full shadow-sm bg-white">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center rounded-t-md">
              <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Travel Nodes
              </h2>
              <button 
                onClick={() => setIsCityModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-800 p-1"
                title="Add New Stop"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 bg-slate-50 custom-scrollbar">
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
                <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-300 rounded bg-white">
                  No nodes configured.<br />Add a city to initialize routing.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: EDITOR */}
        <div className="flex-1 flex items-stretch">
          <div className="erp-card flex flex-col w-full h-full shadow-sm bg-white">
            {activeStop ? (
              <>
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-md">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                       {activeStop.flag} {activeStop.city_name}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                      <Calendar size={13} /> 
                      {dayjs(activeStop.arrival_date).format('ddd, MMM D, YYYY')} 
                      <span className="text-slate-300 mx-1">|</span>
                      {activeActivities.length} Operations Pending
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsActivityDrawerOpen(true)}
                    className="erp-button text-xs py-1.5"
                  >
                    <Plus size={14} className="mr-1" /> New Operation
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-white">
                  {/* Data Table Approach for Activities */}
                  {activeActivities.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-24">Time</th>
                          <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Operation Name</th>
                          <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                          <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-32">Allocated Cost</th>
                          <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeActivities.map(act => (
                          <tr key={act.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-5 py-3 text-xs text-slate-500 font-medium whitespace-nowrap flex items-center gap-1.5">
                              <Clock size={12} className="text-slate-400" /> {act.time_slot}
                            </td>
                            <td className="px-5 py-3">
                              <div className="text-sm font-semibold text-slate-900">{act.name}</div>
                              {act.description && <div className="text-xs text-slate-500 mt-0.5 truncate max-w-sm">{act.description}</div>}
                            </td>
                            <td className="px-5 py-3">
                              <span className="erp-badge bg-slate-100 text-slate-600 border border-slate-200">
                                {act.type}
                              </span>
                            </td>
                            <td className="px-5 py-2">
                              <div className="relative">
                                <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                  type="number" 
                                  defaultValue={act.cost}
                                  onBlur={(e) => {
                                    if (Number(e.target.value) !== act.cost) {
                                      handleUpdateActivityCost(act.id, Number(e.target.value));
                                    }
                                  }}
                                  className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded px-2 py-1.5 pl-7 text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                />
                              </div>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button 
                                onClick={() => handleDeleteActivity(act.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Operation"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full text-slate-400">
                      <Activity size={32} className="mb-3 text-slate-300" />
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">No Operations Scheduled</h3>
                      <p className="text-xs max-w-sm">Begin defining activities, locations, and costs for {activeStop.city_name}.</p>
                    </div>
                  )}
                </div>
                
                {/* Footer Summation */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-md flex justify-end">
                   <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Node Cost Estimate</span>
                      <span className="text-lg font-bold text-slate-900">${stopTotalCost.toLocaleString()}</span>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3">
                <MapPin size={32} className="text-slate-200" />
                <p className="text-sm font-medium">Select a travel node from the index to configure.</p>
              </div>
            )}
          </div>
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
    </SidebarLayout>
  );
}
