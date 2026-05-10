import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Map, Compass, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/trips', label: 'My Trips' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Traveler';
  const avatarUrl = profile?.avatar_url;

  return (
    <nav className="sticky top-0 z-40 bg-sand-50/90 backdrop-blur-sm border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-sunset-500 rounded-lg flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-[family-name:var(--font-family-heading)] text-xl font-semibold text-ink-900 tracking-tight">
            Traveloop
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                  active
                    ? 'bg-sunset-500/10 text-sunset-600'
                    : 'text-ink-400 hover:text-ink-900 hover:bg-sand-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right — avatar + dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-sand-100 transition-colors duration-200 ease-out"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-ocean-500 flex items-center justify-center text-white text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium text-ink-700 max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown className={`w-4 h-4 text-ink-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-card border border-sand-200 py-1 animate-scale-in">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50 transition-colors"
              >
                <User className="w-4 h-4" /> Profile & Settings
              </Link>
              <Link
                to="/trips"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50 transition-colors md:hidden"
              >
                <Map className="w-4 h-4" /> My Trips
              </Link>
              <hr className="border-sand-100 my-1" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-sunset-600 hover:bg-sunset-500/5 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
