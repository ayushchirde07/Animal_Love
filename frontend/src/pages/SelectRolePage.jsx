import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Building2, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function SelectRolePage() {
  return (
    <main className="auth-page select-role-page">
      <motion.section
        className="select-role-wrapper"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Link to="/" className="auth-back-link">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="auth-head">
          <p className="section-meta">Animal Guardian</p>
          <h1>Who are you?</h1>
          <p className="auth-copy">
            Select your role to continue. Each role has a dedicated login experience.
          </p>
        </div>

        <div className="role-select-grid">
          {/* Citizen Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <Link to="/login/citizen" className="role-select-card citizen-card">
              <div className="role-select-icon citizen-icon">
                <User size={32} />
              </div>
              <div className="role-select-body">
                <h2>Citizen</h2>
                <p>Report injured or endangered animals, track rescue progress, and stay updated at every step.</p>
                <ul className="role-select-perks">
                  <li><HeartHandshake size={14} /> Submit animal rescue reports</li>
                  <li><HeartHandshake size={14} /> Track real-time rescue status</li>
                  <li><HeartHandshake size={14} /> View your rescue history</li>
                </ul>
              </div>
              <span className="role-select-action">
                Login as Citizen <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>

          {/* NGO Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <Link to="/login/ngo" className="role-select-card ngo-card">
              <div className="role-select-icon ngo-icon">
                <Building2 size={32} />
              </div>
              <div className="role-select-body">
                <h2>NGO / Rescue Team</h2>
                <p>Manage incoming rescue requests, coordinate volunteers, and update rescue statuses in real-time.</p>
                <ul className="role-select-perks">
                  <li><ShieldCheck size={14} /> Accept &amp; manage rescue cases</li>
                  <li><ShieldCheck size={14} /> Assign volunteers to reports</li>
                  <li><ShieldCheck size={14} /> Access full rescue dashboard</li>
                </ul>
              </div>
              <span className="role-select-action">
                Login as NGO <ArrowRight size={16} />
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
