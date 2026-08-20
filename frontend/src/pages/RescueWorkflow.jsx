import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchReports, updateReportStatus } from '../services/reportService'
import { ShieldCheck, Activity, ArrowRight, CheckCircle2, AlertTriangle, Users } from 'lucide-react'
import { io } from 'socket.io-client'

const workflowActions = {
  SUBMITTED: { label: 'Review request', next: 'UNDER_REVIEW' },
  UNDER_REVIEW: { label: 'Approve request', next: 'ACCEPTED' },
  ACCEPTED: { label: 'Assign volunteer', next: 'VOLUNTEER_ASSIGNED' },
  VOLUNTEER_ASSIGNED: { label: 'Dispatch rescue team', next: 'ON_THE_WAY' },
  ON_THE_WAY: { label: 'Mark rescued', next: 'RESCUED' },
  RESCUED: { label: 'Send to vet', next: 'AT_VET' },
  AT_VET: { label: 'Start treatment', next: 'TREATMENT_STARTED' },
  TREATMENT_STARTED: { label: 'Mark recovered', next: 'RECOVERED' },
  RECOVERED: { label: 'Complete rescue', next: 'COMPLETED' },
}

const statusLabels = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  VOLUNTEER_ASSIGNED: 'Volunteer assigned',
  ON_THE_WAY: 'On the way',
  RESCUED: 'Rescued',
  AT_VET: 'At vet',
  TREATMENT_STARTED: 'Treatment started',
  RECOVERED: 'Recovered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export default function RescueWorkflow() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [incomingToast, setIncomingToast] = useState(null)

  const loadReports = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchReports()
      setReports(data.reports || [])
    } catch (err) {
      console.error('RescueWorkflow fetchReports error:', err)
      setError('Unable to load rescue reports. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  useEffect(() => {
    // connect to backend socket for real-time updates
    const socketUrl = (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:5000'
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] })

    socket.on('connect', () => {
      // console.log('workflow socket connected', socket.id)
    })

    socket.on('newReport', (newReport) => {
      // reload reports to reflect new incoming case
      loadReports()
      // show transient toast with basic info
      try {
        const id = newReport.reportId || newReport._id || 'New'
        const title = newReport.animalType ? `${newReport.animalType} reported` : 'New report'
        setIncomingToast({ id, title })
        setTimeout(() => setIncomingToast(null), 5000)
      } catch (e) {
        // ignore toast failures
      }
    })

    socket.on('disconnect', () => {
      // console.log('workflow socket disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [])


  const handleAction = async (reportId, nextStatus) => {
    setSuccessMessage('')
    setUpdating(reportId)
    try {
      await updateReportStatus(reportId, nextStatus)
      setSuccessMessage(`Report ${reportId} moved to ${statusLabels[nextStatus]}.`)
      await loadReports()
    } catch (err) {
      console.error('RescueWorkflow update error:', err)
      setError('Unable to update the rescue workflow. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const activeReports = useMemo(
    () => reports.filter((report) => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(report.status)),
    [reports],
  )

  return (
    <main className="workflow-page">
      <section className="workflow-header">
        <div>
          <p className="section-meta">Rescue workflow</p>
          <h1>Manage rescue requests</h1>
          <p className="dashboard-copy">
            Review incoming cases, assign responders, and move rescue requests through treatment stages.
          </p>
        </div>
        <div className="workflow-actions">
          <Link to="/ngo/dashboard" className="button button-secondary">
            Back to NGO dashboard
          </Link>
        </div>
      </section>

      {error && <div className="workflow-error">{error}</div>}
      {successMessage && <div className="workflow-success">{successMessage}</div>}

      <section className="workflow-summary">
        <motion.article
          className="stat-card"
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        >
          <div className="stat-icon">
            <ShieldCheck size={20} />
          </div>
          <p className="stat-value">{reports.length}</p>
          <p className="stat-label">Total requests</p>
        </motion.article>

        <motion.article
          className="stat-card"
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        >
          <div className="stat-icon">
            <Users size={20} />
          </div>
          <p className="stat-value">{activeReports.length}</p>
          <p className="stat-label">Active workflows</p>
        </motion.article>
      </section>

      <section className="workflow-list">
        <div className="section-header">
          <h2>Open rescue reports</h2>
        </div>

        {loading ? (
          <p>Loading reports…</p>
        ) : (
          <div className="workflow-grid">
            {reports.length === 0 ? (
              <div className="empty-state">
                <p>No reports available yet.</p>
              </div>
            ) : (
              reports.map((report) => {
                const action = workflowActions[report.status]
                return (
                  <motion.article
                    key={report.reportId || report._id}
                    className="workflow-card"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  >
                    <div className="workflow-card-header">
                      <div>
                        <p className="workflow-id">{report.reportId}</p>
                        <p className="workflow-title">{report.animalType} report</p>
                      </div>
                      <span className={`badge badge-status badge-${report.status.toLowerCase()}`}>
                        {statusLabels[report.status] || report.status}
                      </span>
                    </div>
                    <div className="workflow-content">
                      <p>{report.description}</p>
                      <div className="workflow-meta">
                        <span>{report.location?.note || 'Location unknown'}</span>
                        <span>{report.severity} severity</span>
                        <span>Reporter: {report.reporter?.fullName || 'Unknown'}</span>
                      </div>
                      {report.images && report.images.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                          {report.images.map((img, idx) => {
                            const srcUrl = img.startsWith('data:image') || img.startsWith('http') 
                              ? img 
                              : `http://localhost:5000${img.startsWith('/') ? img : '/' + img}`
                            return (
                               <img key={idx} src={srcUrl} alt="Animal" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="workflow-actions-row">
                      {action ? (
                        <button
                          type="button"
                          className="button button-primary"
                          disabled={updating === report.reportId}
                          onClick={() => handleAction(report.reportId, action.next)}
                        >
                          {updating === report.reportId ? 'Updating…' : action.label}
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button type="button" className="button button-secondary" disabled>
                          No action available
                        </button>
                      )}
                    </div>
                  </motion.article>
                )
              })
            )}
          </div>
        )}
      </section>
      {incomingToast && (
        <motion.div
          className="incoming-toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Activity size={20} />
          <div>
            <p className="toast-title">New report</p>
            <p>{incomingToast.title} · {incomingToast.id}</p>
          </div>
        </motion.div>
      )}
    </main>
  )
}
