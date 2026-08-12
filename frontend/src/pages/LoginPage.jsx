import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await login({ email, password })
      const destination = data?.user?.role === 'NGO' ? '/ngo/dashboard' : '/citizen/dashboard'
      navigate(destination)
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.request ? 'Unable to reach backend server. Please start the API backend and try again.' : 'Login failed. Check your credentials and try again.')
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
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={18} /> Back to home
        </Link>
        <div className="auth-head">
          <p className="section-meta">Welcome back to Animal Guardian</p>
          <h1>Login to continue</h1>
          <p className="auth-copy">
            Access your rescue dashboard and submit or review animal reports securely.
          </p>
          {location.state?.message && <p className="form-success">{location.state.message}</p>}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <label className="password-field">
            Password
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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

          <button type="submit" className="button button-primary auth-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>

          <p className="auth-footer">
            Don’t have an account? <a href="/register">Create account</a>
          </p>
        </form>
      </motion.section>
    </main>
  )
}
