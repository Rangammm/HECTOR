import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { MapPin, Calendar, Clock, Lock, Globe, Flag, Map } from 'lucide-react';
import dayjs from 'dayjs';
import SkeletonCard from '../components/SkeletonCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function PublicTripView() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [stops, setStops] = useState([]);
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: tData, error: tErr } = await supabase
          .from('trips')
          .select('*, profiles(name)')
          .eq('id', id)
          .single();

        if (tErr) throw tErr;
        if (!tData.is_public) throw new Error('This record is restricted to private operational access.');

        setTrip(tData);

        const { data: sData } = await supabase.from('stops').select('*').eq('trip_id', id).order('order_idx');
        setStops(sData || []);

        if (sData) {
          const { data: aData } = await supabase.from('activities').select('*').in('stop_id', sData.map(s => s.id));
          if (aData) {
            const acc = {};
            aData.forEach(a => {
              if (!acc[a.stop_id]) acc[a.stop_id] = [];
              acc[a.stop_id].push(a);
            });
            Object.keys(acc).forEach(k => {
              acc[k] = acc[k].sort((a, b) => a.time_slot.localeCompare(b.time_slot));
            });
            setActivities(acc);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
         <div className="w-full max-w-lg">
           <SkeletonCard lines={4} />
         </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-stripe-pattern">
        <div className="max-w-md w-full">
          <div className="erp-card p-10 flex flex-col items-center text-center">
            <Lock className="w-12 h-12 text-slate-300 mb-4" />
            <h1 className="text-lg font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-sm text-slate-500 mb-6">{error || 'Record unresolvable.'}</p>
            <Link to="/" className="erp-button">Return to Main Entry</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* HEADER TRAY */}
      <header className="bg-slate-900 text-white border-b border-indigo-500 min-h-[64px] flex items-center px-6">
        <div className="max-w-4xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center">
               <Globe className="w-5 h-5 text-indigo-100" />
             </div>
             <div>
               <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Public Operation Dossier</div>
               <h1 className="text-xl font-semibold leading-tight">{trip.name}</h1>
             </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300 bg-slate-800 px-3 py-1.5 rounded-md self-start sm:self-center">
            {trip.start_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dayjs(trip.start_date).format('MMM D, YYYY')} {trip.end_date ? `— ${dayjs(trip.end_date).format('MMM D, YYYY')}` : ''}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {/* AUTHOR & BRIEFING */}
        <div className="erp-card p-6 mb-8 border-l-4 border-l-indigo-500">
           <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
             <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Mission Briefing</h3>
                <p className="text-xs text-slate-500 mt-1">Lead Operator: <span className="font-semibold text-slate-700">{trip.profiles?.name || 'Unknown'}</span></p>
             </div>
             <span className="erp-badge bg-emerald-100 text-emerald-700">Cleared for Public</span>
           </div>
           {trip.description ? (
             <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{trip.description}</p>
           ) : (
             <p className="text-sm text-slate-400 italic">No briefing summary provided.</p>
           )}
        </div>

        {/* NODES */}
        {stops.length === 0 ? (
          <EmptyState 
            title="No Logistics Logged" 
            message="This operational wrapper contains no active location nodes or activities." 
            icon={Map}
          />
        ) : (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" /> Authorized Route Log
            </h3>
            
            {stops.map((stop, sIdx) => {
              const stopActs = activities[stop.id] || [];
              return (
                <div key={stop.id} className="erp-card overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                          {String(sIdx + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                             <span className="text-xl">{stop.flag || <Flag className="w-4 h-4 text-indigo-400" />}</span>
                             {stop.city_name}
                          </h4>
                          {stop.arrival_date && (
                             <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3 h-3" /> {dayjs(stop.arrival_date).format('ddd, MMM D')}
                             </p>
                          )}
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-white">
                    {stopActs.length === 0 ? (
                      <div className="px-6 py-5 text-sm text-slate-400 italic bg-white flex items-center justify-center border-t border-slate-100">
                        No operations logged for this node.
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                          {stopActs.map((act) => (
                            <tr key={act.id} className="hover:bg-slate-50">
                              <td className="pl-6 pr-4 py-4 align-top w-24">
                                 <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded inline-flex">
                                   <Clock className="w-3 h-3 text-slate-400" /> {act.time_slot || '--:--'}
                                 </span>
                              </td>
                              <td className="px-4 py-4 align-top border-l border-slate-100">
                                 <div className="flex items-center justify-between mb-1">
                                   <div className="font-semibold text-sm text-slate-900">{act.name}</div>
                                   <span className="erp-badge bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] ml-2 shrink-0">
                                     {act.type}
                                   </span>
                                 </div>
                                 {act.description && (
                                   <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">{act.description}</p>
                                 )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
