import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { Compass, Map, User, Shield, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: Compass },
  { label: 'My Trips', path: '/trips', icon: Map },
  { label: 'Profile', path: '/profile', icon: User },
]

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-sand-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sunset-500 rounded-lg flex items-center justify-center">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-[family-name:var(--font-family-heading)] text-lg font-semibold text-ink-900">Traveloop</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-sunset-500/10 text-sunset-600' : 'text-ink-400 hover:text-ink-700 hover:bg-sand-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}

          {profile?.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/admin' ? 'bg-sunset-500/10 text-sunset-600' : 'text-ink-400 hover:text-ink-700 hover:bg-sand-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {user && (
            <button onClick={handleSignOut} className="ml-2 p-2 rounded-lg text-ink-300 hover:text-sunset-500 hover:bg-sand-50 transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
