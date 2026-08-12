import { useEffect, useState } from 'react'
import { fetchNotifications, markNotificationRead } from '../services/notificationService'
import { Bell } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchNotifications()
      setNotifications(data.notifications || [])
    } catch (e) {
      console.error('Failed to load notifications', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleMark = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications((cur) => cur.map((n) => (n._id === id ? { ...n, read: true } : n)))
    } catch (e) {
      console.error('Failed to mark read', e)
    }
  }

  return (
    <div className="notifications-widget">
      <div className="notif-header">
        <Bell size={18} />
        <h4>Notifications</h4>
      </div>
      {loading && <p>Loading…</p>}
      <ul>
        {notifications.map((n) => (
          <li key={n._id} className={`notif-item ${n.read ? 'read' : ''}`}>
            <div>
              <p className="notif-title">{n.title}</p>
              <p className="notif-body">{n.body}</p>
            </div>
            {!n.read && (
              <button className="button button-small" onClick={() => handleMark(n._id)}>
                Mark
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
