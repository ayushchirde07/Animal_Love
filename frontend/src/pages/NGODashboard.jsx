import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  ClipboardList,
  HeartHandshake,
  Users,
  CheckSquare,
  MapPin,
  BellRing,
  Clock3,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchReports } from '../services/reportService'
import Notifications from '../components/Notifications'
import { fetchAnalyticsSummary } from '../services/analyticsService'

const MapView = lazy(() => import('../components/MapView'))

const staticRecentActions = [
  { label: 'Report approvals', value: '8' },
  { label: 'Volunteer assignments', value: '4' },
  { label: 'Pending transports', value: '3' },
]

export default function NGODashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analytics, setAnalytics] = useState({})

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchReports()
        setReports(data.reports || [])
      } catch (err) {
        console.error('NGODashboard fetchReports failed:', err)
        setError('Unable to load real-time reports. Showing summary data.')
      } finally {
        setLoading(false)
      }
    }

    loadReports()
    const loadAnalytics = async () => {
      try {
        const res = await fetchAnalyticsSummary()
        setAnalytics(res.summary || {})
      } catch (e) {
        console.error('Failed to load analytics', e)
      }
    }
    loadAnalytics()
  }, [])

  const stats = useMemo(() => {
    const activeCount = reports.length
    const assignedCount = reports.filter((report) => report.status === 'ON_THE_WAY').length
    const reviewCount = reports.filter((report) => report.status === 'UNDER_REVIEW').length
    const completedCount = reports.filter((report) => report.status === 'RECOVERED').length

    return [
      { label: 'New rescue requests', value: activeCount.toString(), icon: ClipboardList },
      { label: 'Assigned teams', value: assignedCount.toString(), icon: Users },
      { label: 'Under review', value: reviewCount.toString(), icon: BellRing },
      { label: 'Completed responses', value: completedCount.toString(), icon: CheckSquare },
    ]
  }, [reports])

  const alerts = useMemo(() => {
    if (reports.length === 0) {
      return [
        {
          id: 'NGO-2026-0012',
          title: 'Urgent: injured elephant reported',
          location: 'Hillside Reserve',
          status: 'High priority',
        },
        {
          id: 'NGO-2026-0011',
          title: 'Stray dog pack needs triage',
          location: 'Riverbend Junction',
          status: 'Review needed',
        },
        {
          id: 'NGO-2026-0010',
          title: 'Rescue volunteer requested',
          location: 'Downtown Garden',
          status: 'Volunteer call',
        },
      ]
    }

    return reports.slice(0, 3).map((report) => ({
      id: report.reportId || report._id,
      title: report.animalType ? `${report.animalType} rescue request` : 'Rescue request',
      location: report.location?.note || 'Unknown location',
      status: report.status || 'Submitted',
    }))
  }, [reports])

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero dashboard-hero-ngo">
        <div>
          <p className="section-meta">NGO command center</p>
          <h1>NGO rescue operations</h1>
          <p className="dashboard-copy">
            Monitor incoming animal rescue requests, assign responders, and coordinate treatment from one place.
          </p>
        </div>
        <div className="dashboard-actions">
          <Link to="/ngo/workflow" className="button button-primary">
            Review requests
          </Link>
          <button className="button button-secondary">Manage volunteers</button>
        </div>
      </section>

      <section className="dashboard-stats analytics-stats">
        <motion.article className="stat-card">
          <div className="stat-icon">
            <ShieldCheck size={20} />
          </div>
          <p className="stat-value">{analytics.report_created || 0}</p>
          <p className="stat-label">Reports created</p>
        </motion.article>

        <motion.article className="stat-card">
          <div className="stat-icon">
            <CheckSquare size={20} />
          </div>
          <p className="stat-value">{analytics.report_status_updated || 0}</p>
          <p className="stat-label">Status updates</p>
        </motion.article>
      </section>

      {loading && <div className="dashboard-loading">Loading reports…</div>}
      {error && <div className="dashboard-error">{error}</div>}

      <section className="dashboard-stats">
        {stats.map((stat) => {
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
        <article className="dashboard-card dashboard-updates">
          <div className="card-header">
            <h2>Recent NGO alerts</h2>
            <span className="badge badge-primary">Active</span>
          </div>
          <div className="updates-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="update-row">
                <div>
                  <p className="update-id">{alert.id}</p>
                  <p className="update-detail">{alert.title} · {alert.location}</p>
                </div>
                <div className="update-meta">
                  <span className="badge badge-secondary">{alert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card dashboard-action-card">
          <div className="card-header">
            <h2>Quick coordination</h2>
            <span className="badge badge-muted">NGO tools</span>
          </div>
          <div className="action-list">
            {staticRecentActions.map((action) => (
              <div key={action.label} className="action-item">
                <div>
                  <p className="action-value">{action.value}</p>
                  <p className="action-label">{action.label}</p>
                </div>
                <HeartHandshake size={18} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-info-grid">
        <article className="dashboard-card dashboard-map-card">
          <div className="card-header">
            <h2>Rescue zone tracker</h2>
            <span className="badge badge-muted">Coverage</span>
          </div>
          <div className="map-placeholder">
            <Suspense fallback={<div>Loading map…</div>}>
              <MapView
                markers={reports
                  .filter((r) => r.location && r.location.latitude && r.location.longitude)
                  .map((r) => ({
                    id: r.reportId || r._id,
                    lat: Number(r.location.latitude),
                    lng: Number(r.location.longitude),
                    title: `${r.animalType} · ${r.reportId}`,
                    description: r.description,
                  }))}
                center={
                  reports.length && reports[0].location && reports[0].location.latitude
                    ? [Number(reports[0].location.latitude || 20), Number(reports[0].location.longitude || 78)]
                    : undefined
                }
                zoom={10}
                height="240px"
              />
            </Suspense>
          </div>
        </article>

        <article className="dashboard-card dashboard-note-card">
          <div className="card-header">
            <h2>Mission status</h2>
            <span className="badge badge-muted">Operations</span>
          </div>
          <div className="note-list">
            <div className="note-item">
              <div>
                <p className="note-title">Supply drop scheduled</p>
                <p className="note-detail">Aid kits will reach Hillcrest by 4:30 PM.</p>
              </div>
              <Clock3 size={18} />
            </div>
            <div className="note-item">
              <div>
                <p className="note-title">Volunteer shift update</p>
                <p className="note-detail">Three new responders are now available for transport.</p>
              </div>
              <Clock3 size={18} />
            </div>
          </div>
        </article>
      </section>
      <aside className="dashboard-card dashboard-notifications">
        <Notifications />
      </aside>
    </main>
  )
}
