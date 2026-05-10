import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Map, User, Shield, Compass, ChevronLeft, ChevronRight, LogOut, Search } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: Compass },
  { label: 'My Trips', path: '/trips', icon: Map },
  { label: 'Profile', path: '/profile', icon: User },
];

export default function SidebarLayout({ children, title, subtitle, hideSidebar = false }) {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const activePath = location.pathname;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      {!hideSidebar && (
        <aside className={`flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 ${collapsed ? 'w-16' : 'w-64'} h-full shrink-0 relative`}>
          
          <div className="h-14 flex items-center px-4 shrink-0 border-b border-slate-800 bg-slate-950/50">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shrink-0">
              <Map className="w-4 h-4 text-white" />
            </div>
            {!collapsed && <span className="ml-3 font-semibold text-white tracking-wide truncate">Traveloop ERP</span>}
          </div>

          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <div className="px-3 mb-2">
              {!collapsed && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">Navigation</div>}
              <div className="space-y-1">
                {NAV_ITEMS.map(item => {
                  const active = activePath.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-2 py-2 rounded-md transition-colors ${active ? 'bg-indigo-600/20 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                      title={collapsed ? item.label : ''}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="ml-3 text-sm font-medium truncate">{item.label}</span>}
                      {active && !collapsed && <div className="ml-auto w-1 h-4 bg-indigo-500 rounded-full" />}
                    </Link>
                  );
                })}

                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center px-2 py-2 rounded-md transition-colors ${activePath.startsWith('/admin') ? 'bg-indigo-600/20 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}`}
                    title={collapsed ? 'Admin' : ''}
                  >
                    <Shield className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="ml-3 text-sm font-medium truncate">Admin Console</span>}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-800">
             <button 
                onClick={signOut}
                className="w-full flex items-center px-2 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title={collapsed ? 'Sign Out' : ''}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="ml-3 text-sm font-medium">Sign Out</span>}
             </button>
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div>
               {title && <h1 className="text-lg font-semibold text-slate-900 leading-tight truncate">{title}</h1>}
               {subtitle && <p className="text-xs text-slate-500 leading-tight truncate">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <div className="hidden sm:flex relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input type="text" placeholder="Search..." className="w-48 pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors" />
             </div>
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 shrink-0">
                <span className="text-indigo-700 font-semibold text-sm">{(profile?.name || user?.email || 'T').charAt(0).toUpperCase()}</span>
             </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
