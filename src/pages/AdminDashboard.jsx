import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Map, Globe, Activity, Ban } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const [stats, setStats] = useState({ users: 0, trips: 0, publicTrips: 0, activities: 0 });
  const [recentTrips, setRecentTrips] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') return;

    async function fetchAdminData() {
      setDataLoading(true);
      try {
        // In a real app, you'd use a secure admin endpoint or RPC.
        // Here we simulate fetching full stats if RLS permits.
        
        // Mocking some stats for demo since we might not have RLS setup for full admin yet
        setStats({
          users: 124,
          trips: 342,
          publicTrips: 89,
          activities: 1543
        });

        // Mock recent trips
        setRecentTrips([
          { id: '1', name: 'Euro Trip 2026', user: 'darshil@example.com', date: '2026-05-10', is_public: true },
          { id: '2', name: 'Japan Explorer', user: 'alice@example.com', date: '2026-05-09', is_public: false },
          { id: '3', name: 'NYC Weekend', user: 'bob@example.com', date: '2026-05-08', is_public: true },
        ]);

        // Mock users list
        setUsers([
          { id: '1', email: 'darshil@example.com', name: 'Darshil', joined: '2026-01-15', trips: 5 },
          { id: '2', email: 'alice@example.com', name: 'Alice M', joined: '2026-03-22', trips: 2 },
          { id: '3', email: 'bob@example.com', name: 'Bob Smith', joined: '2026-04-10', trips: 1 },
        ]);

      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    }
    fetchAdminData();
  }, [profile]);

  if (loading) return <div className="p-8 text-center">Loading auth...</div>;
  if (!user || profile?.role !== 'admin') return <Navigate to="/dashboard" replace />; // Redirect non-admins

  // Mock chart data
  const chartData = [
    { name: 'Mon', trips: 12 }, { name: 'Tue', trips: 19 }, { name: 'Wed', trips: 15 },
    { name: 'Thu', trips: 22 }, { name: 'Fri', trips: 30 }, { name: 'Sat', trips: 28 }, { name: 'Sun', trips: 18 }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-base)] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-['Outfit'] text-[var(--text-primary)]">Admin Dashboard</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Total Users" value={stats.users} color="var(--accent)" />
          <StatCard icon={Map} label="Total Trips" value={stats.trips} color="var(--pink)" />
          <StatCard icon={Globe} label="Public Trips" value={stats.publicTrips} color="var(--forest)" />
          <StatCard icon={Activity} label="Activities Added" value={stats.activities} color="var(--amber)" />
        </div>

        {/* Chart & Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Trips Created (Last 7 Days)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <Line type="monotone" dataKey="trips" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-base)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Trips Feed */}
          <div className="glass-card overflow-hidden flex flex-col">
            <div className="p-4 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
              <h3 className="font-bold text-[var(--text-primary)]">Recent Trips</h3>
            </div>
            <div className="p-0 overflow-y-auto flex-1 h-[300px]">
              {recentTrips.map((trip, i) => (
                <div key={i} className="p-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-[var(--text-primary)]">{trip.name}</span>
                    {trip.is_public && <span className="text-[10px] bg-[var(--forest-glow)] text-[var(--forest)] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border border-[var(--forest)]/30">Public</span>}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">{trip.user}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{trip.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="lg:col-span-3 glass-card overflow-hidden">
            <div className="p-4 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
              <h3 className="font-bold text-[var(--text-primary)]">Manage Users</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-base)] text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">Trips</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {users.map(u => (
                  <tr key={u.id} className="bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-[var(--text-primary)]">{u.name}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{u.email}</div>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">{u.joined}</td>
                    <td className="p-4 text-sm font-medium text-[var(--text-primary)]">{u.trips}</td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-[var(--sunset)] hover:bg-[var(--sunset-glow)] rounded transition-colors" title="Ban User">
                        <Ban size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-6 relative overflow-hidden group hover:border-[var(--border-subtle)] transition-colors">
      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <Icon size={120} />
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color }}>
          <Icon size={24} />
        </div>
        <div>
          <div className="text-[var(--text-secondary)] text-sm font-medium mb-1">{label}</div>
          <div className="text-3xl font-bold text-[var(--text-primary)] font-['Outfit']">{value.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
