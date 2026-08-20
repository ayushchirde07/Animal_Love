import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  ClipboardList,
  MapPin,
  BellRing,
  Users,
  Clock3,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchReports } from '../services/reportService'

const staticRecentReports = [
  {
    id: 'AG-2026-0004',
    type: 'Injured Dog',
    status: 'ON_THE_WAY',
    location: 'Elm Street Park',
    updated: '12 min ago',
  },
  {
    id: 'AG-2026-0003',
    type: 'Stray Cat',
    status: 'UNDER_REVIEW',
    location: 'Riverside Avenue',
    updated: '38 min ago',
  },
  {
    id: 'AG-2026-0002',
    type: 'Bird Injury',
    status: 'ACCEPTED',
    location: 'Westfield Plaza',
    updated: '1 hr ago',
  },
]

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(false)
  const [reportError, setReportError] = useState('')

  useEffect(() => {
    const loadReports = async () => {
      setLoadingReports(true)
      setReportError('')
      try {
        const data = await fetchReports()
        setReports(data.reports || [])
      } catch (error) {
        setReportError('Unable to load reports. Showing recent activity instead.')
        console.error('CitizenDashboard fetchReports failed:', error)
      } finally {
        setLoadingReports(false)
      }
    }

    loadReports()
  }, [])

  const recentReports = useMemo(() => {
    if (!reports.length) {
      return staticRecentReports
    }

    return reports.slice(0, 3).map((report) => ({
      id: report.reportId || report._id,
      type: report.animalType || 'Animal report',
      status: report.status || 'SUBMITTED',
      location: report.location?.note || report.location?.name || 'Unknown location',
      updated: report.updatedAt
        ? new Date(report.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now',
    }))
  }, [reports])

  const dashboardStats = [
    { label: 'Active Reports', value: reports.length.toString(), icon: ClipboardList },
    { label: 'Volunteers Assigned', value: '8', icon: Users },
    { label: 'Pending Updates', value: '4', icon: BellRing },
    { label: 'Nearby NGOs', value: '3', icon: ShieldCheck },
  ]

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="section-meta">Citizen dashboard</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/citizen/report" className="button button-secondary">
            New Report
          </Link>
          <Link to="/citizen/history" className="button button-primary">
            View history
          </Link>
        </div>
      </section>

      <section className="dashboard-stats">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.article
              key={stat.label}
              className="stat-card"
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            >
              <div className="stat-icon">
                <Icon size={20} />
              </div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </motion.article>
          )
        })}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-header">
            <h2>Live rescue progress</h2>
            <span className="badge badge-primary">Overview</span>
          </div>
          <div className="progress-list">
            <div className="progress-item">
              <span>SUBMITTED</span>
              <span>4</span>
            </div>
            <div className="progress-item">
              <span>UNDER REVIEW</span>
              <span>3</span>
            </div>
            <div className="progress-item">
              <span>ON THE WAY</span>
              <span>2</span>
            </div>
            <div className="progress-item">
              <span>RECOVERED</span>
              <span>1</span>
            </div>
          </div>
        </article>

        <article className="dashboard-card dashboard-updates">
          <div className="card-header">
            <h2>Recent updates</h2>
            <span className="badge badge-muted">Latest</span>
          </div>
          {loadingReports && (
            <div className="dashboard-loading">Loading latest reports...</div>
          )}
          {reportError && <div className="dashboard-error">{reportError}</div>}
          <div className="updates-list">
            {recentReports.map((report) => (
              <div key={report.id} className="update-row">
                <div>
                  <p className="update-id">{report.id}</p>
                  <p className="update-detail">{report.type} · {report.location}</p>
                </div>
                <div className="update-meta">
                  <span className="badge badge-secondary">{report.status}</span>
                  <p>{report.updated}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-info-grid">
        <article className="dashboard-card dashboard-map-card">
          <div className="card-header">
            <h2>Nearby rescue partners</h2>
            <span className="badge badge-muted">NGOs</span>
          </div>
          <div className="map-placeholder">
            <MapPin size={28} />
            <p>Live map coming soon</p>
          </div>
        </article>

        <article className="dashboard-card dashboard-note-card">
          <div className="card-header">
            <h2>Latest notifications</h2>
            <span className="badge badge-muted">Alerts</span>
          </div>
          <div className="note-list">
            <div className="note-item">
              <div>
                <p className="note-title">Volunteer assigned</p>
                <p className="note-detail">A rescue team is on the way for report AG-2026-0004.</p>
              </div>
              <Clock3 size={18} />
            </div>
            <div className="note-item">
              <div>
                <p className="note-title">Report approved</p>
                <p className="note-detail">Your recent stray cat report has been approved.</p>
              </div>
              <Clock3 size={18} />
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
