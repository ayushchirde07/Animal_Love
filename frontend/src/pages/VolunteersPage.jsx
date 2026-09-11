import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  X,
  Eye,
  EyeOff,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchVolunteers, addVolunteer, removeVolunteer } from '../services/volunteerService'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' },
  }),
}

const EMPTY_FORM = {
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  password: '',
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null) // volunteer object
  const [deleting, setDeleting] = useState(false)

  const loadVolunteers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchVolunteers()
      setVolunteers(data.volunteers || [])
    } catch (err) {
      setError('Unable to load volunteers. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVolunteers()
  }, [])

  const filtered = volunteers.filter(
    (v) =>
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      (v.city || '').toLowerCase().includes(search.toLowerCase()),
  )

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddVolunteer = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const data = await addVolunteer(form)
      setSuccessMsg(`Volunteer "${data.volunteer.fullName}" added successfully!`)
      setVolunteers((prev) => [data.volunteer, ...prev])
      setForm(EMPTY_FORM)
      setTimeout(() => {
        setShowModal(false)
        setSuccessMsg('')
      }, 1800)
    } catch (err) {
      setFormError(
        err?.response?.data?.message || 'Failed to add volunteer. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await removeVolunteer(confirmDelete.id)
      setVolunteers((prev) => prev.filter((v) => v.id !== confirmDelete.id))
      setConfirmDelete(null)
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to remove volunteer.')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <main className="dashboard-page volunteers-page">
      {/* Header */}
      <section className="volunteers-header">
        <div className="volunteers-title-row">
          <div>
            <p className="section-meta">NGO Management</p>
            <h1>Manage Volunteers</h1>
            <p className="dashboard-copy">
              View, search, and onboard volunteers to your rescue operations team.
            </p>
          </div>
          <button
            className="button button-primary volunteers-add-btn"
            onClick={() => {
              setShowModal(true)
              setFormError('')
              setSuccessMsg('')
              setForm(EMPTY_FORM)
            }}
          >
            <UserPlus size={18} />
            Add Volunteer
          </button>
        </div>

        {/* Search bar */}
        <div className="volunteers-search-wrap">
          <Search size={17} className="volunteers-search-icon" />
          <input
            className="volunteers-search"
            type="text"
            placeholder="Search by name, email or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Stats strip */}
      <section className="volunteers-stats">
        <motion.div className="vol-stat" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Users size={20} />
          <div>
            <p className="vol-stat-value">{volunteers.length}</p>
            <p className="vol-stat-label">Total volunteers</p>
          </div>
        </motion.div>
        <motion.div className="vol-stat" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <MapPin size={20} />
          <div>
            <p className="vol-stat-value">
              {[...new Set(volunteers.map((v) => v.city).filter(Boolean))].length}
            </p>
            <p className="vol-stat-label">Cities covered</p>
          </div>
        </motion.div>
      </section>

      {/* Table / content */}
      {loading && <div className="dashboard-loading">Loading volunteers…</div>}
      {error && <div className="dashboard-error">{error}</div>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <div className="volunteers-empty">
              <Users size={48} strokeWidth={1.2} />
              <p>{search ? 'No volunteers match your search.' : 'No volunteers added yet. Click "Add Volunteer" to get started.'}</p>
            </div>
          ) : (
            <section className="volunteers-table-wrap">
              <table className="volunteers-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <motion.tr
                      key={v.id}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      custom={i * 0.04}
                    >
                      <td className="vol-num">{i + 1}</td>
                      <td className="vol-name">
                        <div className="vol-avatar">{v.fullName?.[0]?.toUpperCase()}</div>
                        {v.fullName}
                      </td>
                      <td>
                        <a href={`mailto:${v.email}`} className="vol-email-link">
                          {v.email}
                        </a>
                      </td>
                      <td>{v.mobile || <span className="vol-muted">—</span>}</td>
                      <td>{v.city || <span className="vol-muted">—</span>}</td>
                      <td>{formatDate(v.createdAt)}</td>
                      <td>
                        <button
                          className="vol-delete-btn"
                          onClick={() => setConfirmDelete(v)}
                          aria-label={`Remove ${v.fullName}`}
                          title="Remove volunteer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </>
      )}

      {/* Add Volunteer Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="vol-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              className="vol-modal"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="vol-modal-header">
                <h2>Add New Volunteer</h2>
                <button
                  className="vol-modal-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {successMsg ? (
                <div className="vol-success">
                  <CheckCircle2 size={36} />
                  <p>{successMsg}</p>
                </div>
              ) : (
                <form className="auth-form vol-modal-form" onSubmit={handleAddVolunteer}>
                  <label>
                    Full Name *
                    <input
                      name="fullName"
                      type="text"
                      placeholder="Volunteer's full name"
                      value={form.fullName}
                      onChange={handleFormChange}
                      required
                    />
                  </label>

                  <label>
                    Email *
                    <input
                      name="email"
                      type="email"
                      placeholder="name@nagpur.ngo.in"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                    />
                  </label>

                  <div className="vol-form-row">
                    <label>
                      Mobile
                      <input
                        name="mobile"
                        type="tel"
                        placeholder="+91 99999 00000"
                        value={form.mobile}
                        onChange={handleFormChange}
                      />
                    </label>
                    <label>
                      City
                      <input
                        name="city"
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={handleFormChange}
                      />
                    </label>
                  </div>

                  <label className="password-field">
                    Password *
                    <div className="password-input-wrap">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Set a temporary password"
                        value={form.password}
                        onChange={handleFormChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </label>

                  {formError && <p className="form-error">{formError}</p>}

                  <div className="vol-modal-actions">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="button button-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Adding…' : 'Add Volunteer'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="vol-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}
          >
            <motion.div
              className="vol-modal vol-confirm-modal"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="vol-confirm-icon">
                <Trash2 size={28} />
              </div>
              <h2>Remove Volunteer?</h2>
              <p>
                Are you sure you want to remove <strong>{confirmDelete.fullName}</strong>?
                This action cannot be undone.
              </p>
              <div className="vol-modal-actions">
                <button
                  className="button button-secondary"
                  onClick={() => setConfirmDelete(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="button vol-confirm-delete-btn"
                  onClick={handleDeleteConfirmed}
                  disabled={deleting}
                >
                  {deleting ? 'Removing…' : 'Yes, Remove'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
