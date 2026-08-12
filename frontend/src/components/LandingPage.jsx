import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PawPrint,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  Sparkles,
  Layers,
} from 'lucide-react'

const features = [
  {
    icon: PawPrint,
    title: 'Fast Animal Reporting',
    description: 'Submit rescue requests with photos, condition, severity, and location in a few taps.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted NGO Network',
    description: 'Authorized rescue teams can review requests, assign volunteers, and manage treatment.',
  },
  {
    icon: MapPin,
    title: 'Location Aware',
    description: 'Use live geolocation or manual pin selection to share exact animal locations.',
  },
  {
    icon: HeartHandshake,
    title: 'Track Every Rescue',
    description: 'Citizens track request progress, rescue status, and view saved rescue history.',
  },
]

const stats = [
  { value: '1.2K+', label: 'Rescue reports' },
  { value: '98%', label: 'Response rate' },
  { value: '450+', label: 'Active volunteers' },
]

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="landing-badge">Animal Welfare | Rescue Management</span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Animal Guardian: Rescue aid for every injured and endangered animal.
          </motion.h1>
          <motion.p
            className="hero-text"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Report emergencies quickly, connect rescue teams, and monitor every step from
            submission to recovery. Designed for citizens, NGOs, volunteers, and authorities.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Link to="/login" className="button button-primary">
              Get Started
            </Link>
            <a href="#" className="button button-secondary">
              Learn More
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="panel-top">
            <div>
              <p className="panel-label">Live rescue status</p>
              <h2>AG-2026-0001</h2>
            </div>
            <span className="status-pill">SUBMITTED</span>
          </div>
          <div className="status-timeline">
            <div className="timeline-step active">Submitted</div>
            <div className="timeline-step">Under review</div>
            <div className="timeline-step">Accepted</div>
            <div className="timeline-step">On the way</div>
          </div>
          <div className="panel-details">
            <div>
              <p className="label">Animal</p>
              <p>Stray dog with injury</p>
            </div>
            <div>
              <p className="label">Location</p>
              <p>Greenwood Park, Sector 5</p>
            </div>
            <div>
              <p className="label">Severity</p>
              <p>High</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="feature-section">
        <div className="section-header">
          <p className="section-meta">Built for citizen safety and rescue coordination</p>
          <h2>Everything needed to save animals faster.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                className="feature-card"
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-card">
          <div>
            <p className="section-meta">Impact numbers</p>
            <h2>Trusted by rescue teams and citizens alike.</h2>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div>
          <h2>Ready to protect animals in your community?</h2>
          <p>
            Start your first rescue report and keep track of every update from assigned volunteers,
            treatment, and completion.
          </p>
        </div>
        <Link to="/login" className="button button-primary cta-button">
          Report an Animal
        </Link>
      </section>
    </main>
  )
}
