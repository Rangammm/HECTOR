import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import CreateTrip from './pages/CreateTrip'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import BudgetPage from './pages/BudgetPage'
import ChecklistPage from './pages/ChecklistPage'
import TripNotes from './pages/TripNotes'
import Profile from './pages/Profile'
import PublicTripView from './pages/PublicTripView'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/trips/new" element={<CreateTrip />} />
        <Route path="/trips/:id/build" element={<ItineraryBuilder />} />
        <Route path="/trips/:id/view" element={<ItineraryView />} />
        <Route path="/trips/:id/budget" element={<BudgetPage />} />
        <Route path="/trips/:id/checklist" element={<ChecklistPage />} />
        <Route path="/trips/:id/notes" element={<TripNotes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trip/:id" element={<PublicTripView />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App