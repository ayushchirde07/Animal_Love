import { useState } from 'react'
import { Bell, BellOff, MessageSquare, ShieldCheck, Mail } from 'lucide-react'

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState({
    push: true,
    email: false,
    sms: false,
    updates: true,
    marketing: false
  })

  const togglePref = (key) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="section-meta">Notification Handling</p>
          <h1>Manage Notifications</h1>
          <p className="dashboard-copy">
            Control how and when you receive alerts about your rescue reports.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-header">
            <h2>Preferences</h2>
            <span className="badge badge-muted">Settings</span>
          </div>
          
          <div className="form-group" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={prefs.push} 
                onChange={() => togglePref('push')}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bell size={18} /> Push Notifications (In-App)
              </span>
            </label>

            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={prefs.email} 
                onChange={() => togglePref('email')}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={18} /> Email Alerts
              </span>
            </label>

            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={prefs.sms} 
                onChange={() => togglePref('sms')}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageSquare size={18} /> SMS Updates (For urgent rescues)
              </span>
            </label>
          </div>
          
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button className="button button-primary" onClick={() => alert('Preferences saved!')}>
              Save Preferences
            </button>
          </div>
        </article>

        <article className="dashboard-card">
          <div className="card-header">
            <h2>Recent Notifications</h2>
            <span className="badge badge-primary">Inbox</span>
          </div>
          <div className="updates-list" style={{ marginTop: '1.5rem' }}>
            <div className="update-row">
              <div>
                <p className="update-title" style={{ fontWeight: 600 }}>Report Approved</p>
                <p className="update-detail">Your stray cat report was approved.</p>
              </div>
              <span className="badge badge-secondary">2 hrs ago</span>
            </div>
            <div className="update-row">
              <div>
                <p className="update-title" style={{ fontWeight: 600 }}>Volunteer Assigned</p>
                <p className="update-detail">A rescue team is on the way.</p>
              </div>
              <span className="badge badge-secondary">1 day ago</span>
            </div>
            <div className="update-row">
              <div>
                <p className="update-title" style={{ fontWeight: 600 }}>Welcome!</p>
                <p className="update-detail">Thanks for joining Animal Guardian.</p>
              </div>
              <span className="badge badge-muted">3 days ago</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}
