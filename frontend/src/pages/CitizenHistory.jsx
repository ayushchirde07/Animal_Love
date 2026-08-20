import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchReports } from '../services/reportService'
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CitizenHistory() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports()
        setReports(data.reports || [])
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  return (
    <main className="workflow-page">
      <section className="workflow-header">
        <div>
          <p className="section-meta">Report history</p>
          <h1>Your submitted reports</h1>
          <p className="dashboard-copy">
            Review all the rescue requests you've submitted and track their live progress.
          </p>
        </div>
        <div className="workflow-actions">
          <Link to="/citizen/dashboard" className="button button-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <ArrowLeft size={16} style={{ marginRight: 6 }} /> Back
          </Link>
        </div>
      </section>

      <section className="workflow-list">
        {loading ? (
          <p>Loading history…</p>
        ) : (
          <div className="workflow-grid">
            {reports.length === 0 ? (
              <div className="empty-state">
                <p>You haven't submitted any reports yet.</p>
              </div>
            ) : (
              reports.map((report) => (
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
                    <span className="badge badge-primary">
                      {report.status || 'SUBMITTED'}
                    </span>
                  </div>
                  <div className="workflow-content">
                    <p><strong>Condition:</strong> {report.condition} (Severity: {report.severity})</p>
                    <p><strong>Description:</strong> {report.description}</p>
                    <div className="workflow-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <MapPin size={14} /> <span>{report.location?.note || 'Location unknown'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <Calendar size={14} /> 
                        <span>
                          {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Just now'}
                        </span>
                      </div>
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
                </motion.article>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  )
}
