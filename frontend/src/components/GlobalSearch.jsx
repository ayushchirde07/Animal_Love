import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, MapPin, PawPrint, Clock } from 'lucide-react'
import { fetchReports } from '../services/reportService'

export default function GlobalSearch({ isOpen, onClose, prefix, isNgo }) {
  const [query, setQuery] = useState('')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
      loadReports()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await fetchReports()
      setReports(data.reports || [])
    } catch (err) {
      console.error('Search: Failed to fetch reports', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Build searchable navigation links
  const navLinks = isNgo
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
        { label: 'History', href: '/citizen/history' },
        { label: 'Profile', href: '/citizen/profile' },
        { label: 'Notifications', href: '/citizen/notifications' },
        { label: 'Settings', href: '/citizen/settings' },
      ]

  const lowerQuery = query.toLowerCase()

  // Filter links
  const filteredLinks = query 
    ? navLinks.filter(link => link.label.toLowerCase().includes(lowerQuery))
    : []

  // Filter reports
  const filteredReports = query
    ? reports.filter(r => 
        r.animalType?.toLowerCase().includes(lowerQuery) ||
        r.location?.address?.toLowerCase().includes(lowerQuery) ||
        r.status?.toLowerCase().includes(lowerQuery) ||
        r.description?.toLowerCase().includes(lowerQuery)
      )
    : []

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-modal" onClick={e => e.stopPropagation()}>
        <div className="global-search-header">
          <Search size={20} className="search-icon-modal" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search reports, animals, or pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="global-search-input-modal"
          />
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="global-search-results">
          {query === '' ? (
            <div className="search-empty-state">
              <p>Type to search across the platform...</p>
            </div>
          ) : (
            <>
              {filteredLinks.length > 0 && (
                <div className="search-section">
                  <p className="search-section-title">Pages</p>
                  {filteredLinks.map(link => (
                    <div 
                      key={link.href} 
                      className="search-result-item"
                      onClick={() => handleNavigate(link.href)}
                    >
                      <span className="search-result-label">{link.label}</span>
                      <span className="search-result-type">Page</span>
                    </div>
                  ))}
                </div>
              )}

              {loading && <p style={{ padding: '1rem', color: 'var(--muted)' }}>Searching reports...</p>}

              {!loading && filteredReports.length > 0 && (
                <div className="search-section">
                  <p className="search-section-title">Reports</p>
                  {filteredReports.map(report => (
                    <div 
                      key={report._id} 
                      className="search-result-item report-result"
                      onClick={() => handleNavigate(isNgo ? '/ngo/workflow' : '/citizen/history')}
                    >
                      <div className="report-result-info">
                        <span className="report-result-title">{report.animalType || 'Animal'}</span>
                        <div className="report-result-meta">
                          <span><MapPin size={12} /> {report.location?.address || 'Unknown'}</span>
                          <span><Clock size={12} /> {report.status || 'Pending'}</span>
                        </div>
                      </div>
                      <span className={`badge ${report.status === 'Resolved' ? 'badge-primary' : 'badge-secondary'}`}>
                        {report.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredLinks.length === 0 && filteredReports.length === 0 && (
                <div className="search-empty-state">
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
