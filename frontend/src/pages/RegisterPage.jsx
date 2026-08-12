import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [city, setCity] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await register({ fullName, email, mobile, city, password })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <motion.section
        className="auth-panel"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="auth-head">
          <p className="section-meta">Join Animal Guardian</p>
          <h1>Create your account</h1>
          <p className="auth-copy">
            Sign up to report animals, follow rescue progress, and stay notified of every update.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Mobile Number
            <input
              type="tel"
              placeholder="+1 555 123 4567"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              required
            />
          </label>

          <label>
            City
            <input
              type="text"
              placeholder="City name"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              required
            />
          </label>


          <label className="password-field">
            Password
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="password-field">
            Confirm Password
            <div className="password-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((value) => !value)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="checkbox-label checkbox-terms">
            <input type="checkbox" required />
            I agree to the Terms & Conditions
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="button button-primary auth-submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-footer">
            Already registered? <a href="/login">Login</a>
          </p>
        </form>
      </motion.section>
    </main>
  )
}
