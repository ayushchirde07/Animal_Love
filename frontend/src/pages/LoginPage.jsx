import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Building2, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const NGO_EMAIL_REGEX = /^[^@\s]+@[a-zA-Z0-9.-]+\.ngo\.in$/

export default function LoginPage() {
  const { role } = useParams()           // 'citizen' | 'ngo'
  const isNGO = role === 'ngo'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    // NGO email format enforcement
    if (isNGO && !NGO_EMAIL_REGEX.test(email)) {
      setError('NGO accounts require an authorised email address ending in .ngo.in  (e.g. name@nagpur.ngo.in)')
      return
    }

    setSubmitting(true)
    try {
      const data = await login({ email, password })
      const destination = data?.user?.role === 'NGO' ? '/ngo/dashboard' : '/citizen/dashboard'
      navigate(destination)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.request
          ? 'Unable to reach backend server. Please start the API backend and try again.'
          : 'Login failed. Check your credentials and try again.')
      setError(message)
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
        <Link to="/select-role" className="auth-back-link">
          <ArrowLeft size={18} /> Choose role
        </Link>

        <div className="auth-head">
          <div className="login-role-badge">
            {isNGO ? <Building2 size={18} /> : <User size={18} />}
            <span>{isNGO ? 'NGO / Rescue Team' : 'Citizen'}</span>
          </div>
          <p className="section-meta">Welcome back to Animal Guardian</p>
          <h1>Login to continue</h1>
          <p className="auth-copy">
            {isNGO
              ? 'Access your NGO rescue management dashboard. Authorised email required.'
              : 'Access your rescue dashboard and submit or review animal reports securely.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              placeholder={isNGO ? 'name@nagpur.ngo.in' : 'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {isNGO && (
              <span className="field-hint">Only authorised <strong>.ngo.in</strong> email addresses are accepted.</span>
            )}
          </label>

          <label className="password-field">
            Password
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <div className="auth-row">
            <label className="checkbox-label">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="link-muted">
              Forgot password?
            </a>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className={`button button-primary auth-submit ${isNGO ? 'ngo-submit' : ''}`}
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>

          {/* Citizen-only: create account link */}
          {!isNGO && (
            <p className="auth-footer">
              Don't have an account? <Link to="/register">Create account</Link>
            </p>
          )}

          {/* NGO: no registration link — informational note instead */}
          {isNGO && (
            <p className="auth-footer auth-footer-muted">
              NGO accounts are provisioned by the Animal Guardian admin team. Contact us to get access.
            </p>
          )}
        </form>
      </motion.section>
    </main>
  )
}
