import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LearnMorePage from './pages/LearnMorePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CitizenDashboard from './pages/CitizenDashboard'
import CitizenHistory from './pages/CitizenHistory'
import NotificationsPage from './pages/NotificationsPage'
import NGODashboard from './pages/NGODashboard'
import RescueWorkflow from './pages/RescueWorkflow'
import AnimalReport from './pages/AnimalReport'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'
import './styles/profile.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          element={
            <ProtectedRoute allowedRoles={[ 'Citizen' ]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
          <Route path="/citizen/history" element={<CitizenHistory />} />
          <Route path="/citizen/report" element={<AnimalReport />} />
          <Route path="/citizen/profile" element={<ProfilePage />} />
          <Route path="/citizen/notifications" element={<NotificationsPage />} />
          <Route path="/citizen/settings" element={<SettingsPage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={[ 'NGO' ]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/ngo/dashboard" element={<NGODashboard />} />
          <Route path="/ngo/workflow" element={<RescueWorkflow />} />
          <Route path="/ngo/profile" element={<ProfilePage />} />
          <Route path="/ngo/notifications" element={<NotificationsPage />} />
          <Route path="/ngo/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
