import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Bell, ChevronDown, LogOut, Moon, Settings, User, Sun, Menu, X, MapPin } from 'lucide-react'
import InlineSearch from './InlineSearch'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 980)
  const location = useLocation()
  const navigate = useNavigate()

  const isNgo = user?.role === 'NGO'
  const prefix = isNgo ? '/ngo' : '/citizen'

  const menuLinks = isNgo
    ? [
        { label: 'Dashboard', href: '/ngo/dashboard' },
        { label: 'Workflow', href: '/ngo/workflow' },
        { label: 'Profile', href: '/ngo/profile' },
        { label: 'Notifications', href: '/ngo/notifications' },
        { label: 'Settings', href: '/ngo/settings' },
      ]
    : [
        { label: 'Dashboard', href: '/citizen/dashboard' },
        { label: 'Report', href: '/citizen/report' },
        { label: 'Profile', href: '/citizen/profile' },
        { label: 'Notifications', href: '/citizen/notifications' },
        { label: 'Settings', href: '/citizen/settings' },
      ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 980) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (window.innerWidth <= 980) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  const themeLabel = theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'

  return (
    <div className={`dashboard-shell ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      
      {isSidebarOpen && window.innerWidth <= 980 && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      <aside className={`sidebar-card ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header-mobile">
          <button className="icon-button" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="sidebar-profile">
          <img
            src={user?.profileImage || '/avatar-placeholder.svg'}
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
              className={`sidebar-link ${location.pathname.startsWith(link.href) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-actions">
          <div className="theme-chip">
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Theme</span>
            <button
              className="theme-toggle-button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              type="button"
            >
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              {themeLabel}
            </button>
          </div>
          <button className="sidebar-link" type="button" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LogOut size={18} />
            <span style={{ fontWeight: 600 }}>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-title-row">
            <button 
              className="icon-button hamburger-btn" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              type="button"
            >
              <Menu size={24} />
            </button>
            <div className="welcome-block">
              <p className="section-meta">{isNgo ? 'NGO workspace' : 'Citizen workspace'}</p>
              <h1 className="welcome-title">
                Welcome back, <span className="highlight-name">{user?.name || 'Guardian'}</span> 👋
              </h1>
              <div className="location-badge">
                <MapPin size={16} />
                <span>{user?.city || 'Unknown city'}</span>
              </div>
            </div>
          </div>

          <InlineSearch isNgo={isNgo} />

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-button" 
                type="button" 
                onClick={() => { setNotifsOpen(!notifsOpen); setMenuOpen(false); }}
                style={{ position: 'relative', width: 44, height: 44, background: 'var(--surface-strong)', borderRadius: '50%' }}
              >
                <Bell size={20} />
                <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></span>
              </button>
              {notifsOpen && (
                <div className="header-dropdown">
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                    Notifications
                  </div>
                  <div className="dropdown-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>Report Approved</p>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.8rem' }}>Your stray cat report was approved.</p>
                  </div>
                  <div className="dropdown-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem' }}>Volunteer Assigned</p>
                    <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.8rem' }}>A rescue team is on the way.</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button className="button button-secondary header-menu" type="button" onClick={() => { setMenuOpen(!menuOpen); setNotifsOpen(false); }}>
                <img src={user?.profileImage || '/avatar-placeholder.svg'} alt="Avatar" className="avatar-small" />
                <span>{user?.name || 'Guest'}</span>
                <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className="header-dropdown">
                  <Link to={`${prefix}/profile`} className="dropdown-item">
                    <User size={16} /> Profile
                  </Link>
                  <Link to={`${prefix}/settings`} className="dropdown-item">
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
          </div>
        </header>

        <div className="dashboard-scroll-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
