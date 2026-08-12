import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { updateProfile, changePassword } from '../services/userService'
import Toast from '../components/Toast'

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const { theme, setTheme, themes } = useTheme()
  const [profile, setProfile] = useState({ name: user?.name || '', city: user?.city || '', phone: user?.phone || '' })
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || '')
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [removePhoto, setRemovePhoto] = useState(false)

  const navigate = useNavigate()

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be smaller than 2 MB.')
      return
    }
    setProfileImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setRemovePhoto(false)
    setError('')
  }

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.append('fullName', profile.name)
    formData.append('city', profile.city)
    formData.append('phone', profile.phone)
    if (profileImage) {
      formData.append('profileImage', profileImage)
    }
    if (removePhoto) {
      formData.append('removeProfileImage', 'true')
    }

    try {
      const data = await updateProfile(formData)
      updateUser(data.user)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Profile update failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New password and confirmation must match.')
      return
    }
    if (!passwordRules.test(passwords.newPassword)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, and a number.')
      return
    }

    setSaving(true)
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      setPasswordMessage('Password updated successfully.')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Unable to update password. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <main className="settings-page">
      <section className="profile-header">
        <div>
          <p className="section-meta">Settings</p>
          <h1>Account & appearance</h1>
          <p className="dashboard-copy">Manage your profile, update your password, and choose the theme that fits your workflow.</p>
        </div>
      </section>

      <section className="settings-grid">
        <motion.article className="settings-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-header">
            <h2>Account</h2>
            <p>Update your profile details and account settings.</p>
          </div>
          <form className="settings-form" onSubmit={handleProfileSubmit}>
            <div className="form-row">
              <label>
                Full Name
                <input name="name" value={profile.name} onChange={handleProfileChange} required />
              </label>
              <label>
                City
                <input name="city" value={profile.city} onChange={handleProfileChange} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Phone
                <input name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="+91 98765 43210" />
              </label>
              <label>
                Email
                <input value={user?.email || ''} readOnly />
              </label>
            </div>
            <div className="profile-photo-row">
              <div className="photo-preview">
                <img src={previewUrl || '/avatar-placeholder.png'} alt="Profile preview" />
              </div>
              <div className="photo-actions">
                <label className="button button-secondary">
                  Upload photo
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} hidden />
                </label>
                <button type="button" className="button button-secondary" onClick={() => { setPreviewUrl(''); setProfileImage(null); setRemovePhoto(true) }}>
                  Remove photo
                </button>
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}
            <div className="settings-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="button button-secondary" onClick={() => setProfile({ name: user?.name || '', city: user?.city || '', phone: user?.phone || '' })}>
                Cancel
              </button>
            </div>
          </form>
        </motion.article>

        <motion.article className="settings-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="card-header">
            <h2>Appearance</h2>
            <p>Choose light, dark, or system theme preference.</p>
          </div>
          <div className="appearance-options">
            {themes.map((option) => (
              <label key={option} className={`theme-option ${theme === option ? 'active' : ''}`}>
                <input type="radio" name="theme" value={option} checked={theme === option} onChange={() => setTheme(option)} />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </motion.article>

        <motion.article className="settings-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-header">
            <h2>Security</h2>
            <p>Update your password or sign out from this device.</p>
          </div>
          <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <label>
              Current Password
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={(event) => setPasswords((cur) => ({ ...cur, currentPassword: event.target.value }))}
                required
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={(event) => setPasswords((cur) => ({ ...cur, newPassword: event.target.value }))}
                required
              />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={(event) => setPasswords((cur) => ({ ...cur, confirmPassword: event.target.value }))}
                required
              />
            </label>
            {passwordError && <p className="form-error">{passwordError}</p>}
            {passwordMessage && <p className="form-success">{passwordMessage}</p>}
            <div className="settings-actions">
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Change Password'}
              </button>
              <button type="button" className="button button-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </form>
        </motion.article>
      </section>
      <Toast message={message || passwordMessage} type={error || passwordError ? 'error' : 'success'} onClose={() => { setMessage(''); setPasswordMessage(''); setError(''); setPasswordError('') }} />
    </main>
  )
}
