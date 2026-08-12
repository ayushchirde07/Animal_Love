import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { fetchProfileStats } from '../services/userService'
import { ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0, completedReports: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchProfileStats()
        setStats(data)
      } catch (err) {
        console.error('Profile stats error', err)
        setError('Unable to load profile statistics. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div>
          <p className="section-meta">Your profile</p>
          <h1>Profile details</h1>
          <p className="dashboard-copy">
            Review your citizen account information and keep your contact details up to date.
          </p>
        </div>
        <div className="profile-actions">
          <Link to="/citizen/settings" className="button button-secondary">
            Settings
          </Link>
          <Link to="/citizen/settings" className="button button-primary">
            Edit Profile
          </Link>
        </div>
      </section>

      <section className="profile-grid">
        <motion.article
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="profile-badge">
            <img src={user?.profileImage || '/avatar-placeholder.svg'} alt="Profile" />
            <div>
              <h2>{user?.name || 'Citizen'}</h2>
              <p>{user?.role || 'Citizen'}</p>
            </div>
          </div>
          <div className="profile-details">
            <div>
              <p className="label">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="label">Phone</p>
              <p>{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="label">City</p>
              <p>{user?.city || 'Not set'}</p>
            </div>
            <div>
              <p className="label">Joined</p>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </motion.article>

        <motion.article
          className="stats-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="card-header">
            <h2>Report activity</h2>
          </div>
          {loading ? (
            <p className="subtext">Loading report metrics…</p>
          ) : error ? (
            <p className="form-error">{error}</p>
          ) : (
            <div className="profile-stats">
              <div className="stat-card alt">
                <ShieldCheck size={20} />
                <div>
                  <p>Total reports</p>
                  <strong>{stats.totalReports}</strong>
                </div>
              </div>
              <div className="stat-card alt">
                <MapPin size={20} />
                <div>
                  <p>Pending</p>
                  <strong>{stats.pendingReports}</strong>
                </div>
              </div>
              <div className="stat-card alt">
                <CheckCircle2 size={20} />
                <div>
                  <p>Completed</p>
                  <strong>{stats.completedReports}</strong>
                </div>
              </div>
            </div>
          )}
        </motion.article>
      </section>
    </main>
  )
}
