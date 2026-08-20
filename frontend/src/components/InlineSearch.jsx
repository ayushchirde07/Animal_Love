import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Clock } from 'lucide-react'
import { fetchReports } from '../services/reportService'

export default function InlineSearch({ isNgo }) {
  const [query, setQuery] = useState('')
  const [reports, setReports] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports()
        setReports(data.reports || [])
      } catch (err) {
        console.error('Search: Failed to fetch reports', err)
      }
    }
    loadReports()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [wrapperRef])

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

  const filteredLinks = query 
    ? navLinks.filter(link => link.label.toLowerCase().includes(lowerQuery))
    : []

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
    setQuery('')
    setIsFocused(false)
  }

  const showDropdown = isFocused && query.length > 0

  return (
    <div className="global-search-container" ref={wrapperRef} style={{ position: 'relative' }}>
      <Search size={18} className="search-icon" />
      <input 
        type="text" 
        placeholder="Search reports, animals, or settings..." 
        className="global-search-input"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {showDropdown && (
        <div className="header-dropdown" style={{ left: 0, right: 'auto', width: '100%', minWidth: '300px', top: '100%', marginTop: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
          
          {filteredLinks.length > 0 && (
            <div style={{ padding: '0.5rem 0' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1rem 0.5rem' }}>Pages</p>
              {filteredLinks.map(link => (
                <div 
                  key={link.href} 
                  className="dropdown-item" 
                  onClick={() => handleNavigate(link.href)}
                  style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
                >
                  <span style={{ fontWeight: 500 }}>{link.label}</span>
                </div>
              ))}
            </div>
          )}

          {filteredReports.length > 0 && (
            <div style={{ padding: '0.5rem 0', borderTop: filteredLinks.length > 0 ? '1px solid var(--border)' : 'none' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', padding: '0 1rem 0.5rem' }}>Reports</p>
              {filteredReports.slice(0, 5).map(report => (
                <div 
                  key={report._id} 
                  className="dropdown-item"
                  onClick={() => handleNavigate(isNgo ? '/ngo/workflow' : '/citizen/history')}
                  style={{ cursor: 'pointer', padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}
                >
                  <span style={{ fontWeight: 600 }}>{report.animalType || 'Animal'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {report.location?.address || 'Unknown'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredLinks.length === 0 && filteredReports.length === 0 && (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--muted)' }}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
