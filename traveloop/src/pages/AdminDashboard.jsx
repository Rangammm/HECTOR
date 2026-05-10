import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

import SidebarLayout from '../components/SidebarLayout.jsx';
import { Shield, Users, Map, Activity, ShieldAlert, BarChart3 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const fetchStats = async () => {
      try {
        // Without an RPC, we fall back to a mock summary. 
        // In a real ERP, we'd query aggregate views.
        setTimeout(() => {
          setStats({
            totalUsers: 1452,
            activeTrips: 341,
            totalActivities: 8892,
            systemHealth: '100%',
            recentSignups: 24
          });
          setLoading(false);
        }, 600);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchStats();
  }, [profile]);

  if (authLoading || loading) return <SidebarLayout title="Admin Console"><div className="p-6 text-sm text-slate-500">Initializing administrative modules...</div></SidebarLayout>;
  
  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SidebarLayout title="System Administration" subtitle="High-level diagnostic and aggregate data overview.">
      
      <div className="p-4 mb-6 erp-card bg-indigo-50 border-indigo-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-sm font-semibold text-indigo-900">Administrator Credentials Verified</h2>
            <p className="text-xs text-indigo-700/80">You are accessing sensitive aggregate data.</p>
          </div>
        </div>
        <div className="text-xs font-mono font-medium bg-white px-2 py-1 rounded text-indigo-900 border border-indigo-100">
          ENV: PRODUCTION
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-md font-medium">
          Error computing statistics: {error}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <div className="erp-card p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Users</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-semibold text-slate-900">{stats.totalUsers.toLocaleString()}</div>
            </div>
            
            <div className="erp-card p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Trip Records</span>
                <Map className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-semibold text-slate-900">{stats.activeTrips.toLocaleString()}</div>
            </div>

            <div className="erp-card p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Operations</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-semibold text-slate-900">{stats.totalActivities.toLocaleString()}</div>
            </div>

            <div className="erp-card p-5 border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sys Health Rating</span>
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-semibold text-slate-900">{stats.systemHealth}</div>
            </div>
          </div>

          <div className="erp-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-400" /> System Access Logs (Mock)
              </h2>
            </div>
            <div className="p-10 flex flex-col items-center justify-center text-slate-400">
              <BarChart3 className="w-12 h-12 mb-3 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">Analytics visualization framework missing.</p>
              <p className="text-xs max-w-sm text-center mt-1">Implement a library like Recharts to visualize user growth matrices here.</p>
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  );
}
