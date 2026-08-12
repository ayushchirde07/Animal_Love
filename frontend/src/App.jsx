import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CitizenDashboard from './pages/CitizenDashboard'
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
          <Route path="/citizen/report" element={<AnimalReport />} />
          <Route path="/citizen/profile" element={<ProfilePage />} />
          <Route path="/citizen/settings" element={<SettingsPage />} />
        </Route>
        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ 'NGO' ]}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/workflow"
          element={
            <ProtectedRoute allowedRoles={[ 'NGO' ]}>
              <RescueWorkflow />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
