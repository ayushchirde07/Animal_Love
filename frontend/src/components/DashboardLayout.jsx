import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ChevronDown, LogOut, Moon, Settings, User, Sun } from 'lucide-react'

const menuLinks = [
  { label: 'Dashboard', href: '/citizen/dashboard' },
  { label: 'Report', href: '/citizen/report' },
  { label: 'Profile', href: '/citizen/profile' },
  { label: 'Settings', href: '/citizen/settings' },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const themeLabel = theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'

  return (
    <div className="dashboard-shell">
      <aside className="sidebar-card">
        <div className="sidebar-profile">
          <img
            src={user?.profileImage || '/avatar-placeholder.png'}
            alt={user?.name || 'Profile'}
            className="avatar-large"
          />
          <div>
            <p className="sidebar-name">{user?.name || 'Guardian'}</p>
            <p className="sidebar-subtitle">📍 {user?.city || 'Unknown city'}</p>
            <p className="sidebar-role">{user?.role || 'Citizen'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`sidebar-link ${location.pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-actions">
          <button type="button" className="button button-secondary" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
          <div className="theme-chip">
            <button type="button" className="theme-toggle-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <span className="theme-current">{themeLabel}</span>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="section-meta">Citizen workspace</p>
            <h1>Welcome back, {user?.name || 'Guardian'} 👋</h1>
            <p className="dashboard-copy">📍 {user?.city || 'Unknown city'}</p>
          </div>

          <div className="header-actions">
            <button className="button button-secondary header-menu" type="button" onClick={() => setMenuOpen((value) => !value)}>
              <img src={user?.profileImage || '/avatar-placeholder.png'} alt="Avatar" className="avatar-small" />
              <span>{user?.name || 'Guest'}</span>
              <ChevronDown size={16} />
            </button>
            {menuOpen && (
              <div className="header-dropdown">
                <Link to="/citizen/profile" className="dropdown-item">
                  <User size={16} /> Profile
                </Link>
                <Link to="/citizen/settings" className="dropdown-item">
                  <Settings size={16} /> Settings
                </Link>
                <button className="dropdown-item" type="button" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
                <div className="dropdown-item theme-row">
                  <button type="button" className="theme-toggle-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="page-welcome">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
