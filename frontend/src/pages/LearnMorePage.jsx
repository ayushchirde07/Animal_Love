import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    PawPrint,
    ShieldCheck,
    MapPin,
    HeartHandshake,
    Bell,
    ClipboardList,
    Users,
    Building2,
    CheckCircle2,
    ArrowLeft,
    Phone,
    Camera,
    Navigation,
    Clock,
    Star,
    Globe,
} from 'lucide-react'

const howItWorks = [
    {
        step: '01',
        icon: Camera,
        title: 'Spot & Report',
        description:
            'A citizen spots an injured or endangered animal. They open Animal Guardian, take a photo, describe the condition, select severity, and submit the report in under a minute.',
    },
    {
        step: '02',
        icon: Bell,
        title: 'NGO Notified Instantly',
        description:
            'The nearest registered NGO or rescue team is notified in real-time. They review the report details, animal condition, and geo-location before accepting the case.',
    },
    {
        step: '03',
        icon: Navigation,
        title: 'Volunteer Dispatched',
        description:
            'An NGO volunteer is assigned and dispatched to the location. The citizen receives live status updates as the rescue progresses through each stage.',
    },
    {
        step: '04',
        icon: CheckCircle2,
        title: 'Rescue Complete',
        description:
            'Once the animal is rescued and treated, the case is marked complete. The full rescue history is saved for the citizen and the NGO for future reference.',
    },
]

const features = [
    {
        icon: PawPrint,
        title: 'Smart Animal Reporting',
        description:
            'Submit detailed rescue requests with photos, animal type, injury description, severity level (Low / Medium / High), and GPS-pinned location — all in a guided, easy-to-use form.',
    },
    {
        icon: MapPin,
        title: 'Live Location Pinning',
        description:
            'Use automatic geolocation or manually drop a pin on an interactive map to share the exact location of the animal. No address typing needed.',
    },
    {
        icon: ShieldCheck,
        title: 'Verified NGO Network',
        description:
            'Only approved and verified NGOs can access the rescue management dashboard. Every team is vetted to ensure quality, accountability, and reliable rescue operations.',
    },
    {
        icon: HeartHandshake,
        title: 'Real-Time Status Tracking',
        description:
            'Track your submitted reports through every stage: Submitted → Under Review → Accepted → On the Way → Rescued. Get notified at every milestone.',
    },
    {
        icon: Bell,
        title: 'Instant Notifications',
        description:
            'Push notifications and in-app alerts keep both citizens and NGO teams updated instantly — from case acceptance to volunteer dispatch and final rescue confirmation.',
    },
    {
        icon: ClipboardList,
        title: 'Full Rescue History',
        description:
            'Citizens can view a complete log of all their past reports. NGOs can review closed cases, response times, and outcomes for quality improvement.',
    },
    {
        icon: Users,
        title: 'Volunteer Management',
        description:
            'NGOs can onboard volunteers, assign them to active cases, and track their real-time status — all from the NGO dashboard without any extra tooling.',
    },
    {
        icon: Building2,
        title: 'Multi-Role Platform',
        description:
            'Designed for three distinct roles: Citizens who report, NGOs who manage rescues, and volunteers who respond on the ground. Each role has a tailored dashboard experience.',
    },
]

const roles = [
    {
        role: 'Citizen',
        icon: Phone,
        color: 'role-citizen',
        description: 'Report animals in distress, track your rescue requests, and view history.',
        capabilities: [
            'Submit animal rescue reports with photos & GPS',
            'Track real-time rescue status',
            'Receive live notifications at every stage',
            'View full history of past reports',
            'Update profile and manage account settings',
        ],
    },
    {
        role: 'NGO / Rescue Team',
        icon: Building2,
        color: 'role-ngo',
        description: 'Manage incoming rescue requests, assign volunteers, and coordinate operations.',
        capabilities: [
            'View and accept incoming rescue reports',
            'Assign volunteers to active cases',
            'Update rescue status in real-time',
            'Access full rescue workflow dashboard',
            'Review historical rescue data and outcomes',
        ],
    },
]

const stats = [
    { value: '1.2K+', label: 'Rescue Reports Filed', icon: ClipboardList },
    { value: '98%', label: 'Response Rate', icon: CheckCircle2 },
    { value: '450+', label: 'Active Volunteers', icon: Users },
    { value: '60+', label: 'Partner NGOs', icon: Building2 },
    { value: '< 15 min', label: 'Avg. Response Time', icon: Clock },
    { value: '25+', label: 'Cities Covered', icon: Globe },
]

const faqs = [
    {
        q: 'Is Animal Guardian free to use?',
        a: 'Yes, Animal Guardian is completely free for citizens. NGO registration is also free — we believe rescue coordination should never be behind a paywall.',
    },
    {
        q: 'How do I report an animal emergency?',
        a: 'Simply register as a Citizen, log in, and tap "Report an Animal". Fill in the animal details, upload a photo, pin the location, and submit. The nearest NGO will be notified instantly.',
    },
    {
        q: 'Can I track my report after submitting?',
        a: 'Absolutely. Your dashboard shows real-time status updates for every report you submit — from Submitted all the way through to Rescued. You\'ll also receive notifications at each stage.',
    },
    {
        q: 'How do NGOs join the platform?',
        a: 'NGOs can register by selecting the "NGO" role during sign-up. After submission, accounts are reviewed and verified by our team before being granted access to the rescue management tools.',
    },
    {
        q: 'What types of animals can be reported?',
        a: 'Any injured, endangered, or distressed animal can be reported — dogs, cats, birds, wildlife, and more. The reporting form lets you specify the animal type and condition in detail.',
    },
    {
        q: 'What happens if no NGO is available nearby?',
        a: 'Your report remains in the queue and visible to all registered NGOs in the system. You\'ll receive a notification as soon as a team accepts and begins responding to your report.',
    },
]

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' },
    }),
}

export default function LearnMorePage() {
    return (
        <main className="learn-more-page">
            {/* Back button */}
            <div className="lm-back-row">
                <Link to="/" className="auth-back-link">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>

            {/* Hero */}
            <section className="lm-hero">
                <motion.span
                    className="landing-badge"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                >
                    Animal Welfare | Rescue Management
                </motion.span>
                <motion.h1
                    className="lm-hero-title"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                >
                    Everything you need to know about Animal Guardian
                </motion.h1>
                <motion.p
                    className="lm-hero-sub"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                >
                    Animal Guardian is a full-stack rescue coordination platform built to connect concerned
                    citizens, NGOs, and volunteers so no animal emergency goes unanswered. Here's how it works
                    and what makes it different.
                </motion.p>
                <motion.div
                    className="hero-actions"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                >
                    <Link to="/register" className="button button-primary">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="button button-secondary">
                        Sign In
                    </Link>
                </motion.div>
            </section>

            {/* Impact Stats */}
            <section className="lm-section">
                <div className="section-header">
                    <p className="section-meta">Our impact so far</p>
                    <h2>Numbers that matter.</h2>
                </div>
                <div className="lm-stats-grid">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                className="lm-stat-card"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i * 0.5}
                            >
                                <div className="feature-icon">
                                    <Icon size={22} />
                                </div>
                                <p className="stat-value">{stat.value}</p>
                                <p className="stat-label">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* How It Works */}
            <section className="lm-section">
                <div className="section-header">
                    <p className="section-meta">Simple 4-step process</p>
                    <h2>How Animal Guardian works.</h2>
                </div>
                <div className="lm-steps-grid">
                    {howItWorks.map((step, i) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={step.step}
                                className="lm-step-card"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i * 0.5}
                            >
                                <div className="lm-step-number">{step.step}</div>
                                <div className="feature-icon lm-step-icon">
                                    <Icon size={22} />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Features */}
            <section className="lm-section">
                <div className="section-header">
                    <p className="section-meta">Built for citizen safety and rescue coordination</p>
                    <h2>Every feature you need to save animals faster.</h2>
                </div>
                <div className="feature-grid lm-feature-grid">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <motion.article
                                key={feature.title}
                                className="feature-card"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover={{ y: -6 }}
                                custom={i * 0.3}
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

            {/* Who Is It For */}
            <section className="lm-section">
                <div className="section-header">
                    <p className="section-meta">Role-based access</p>
                    <h2>Built for everyone involved in rescue.</h2>
                </div>
                <div className="lm-roles-grid">
                    {roles.map((role, i) => {
                        const Icon = role.icon
                        return (
                            <motion.div
                                key={role.role}
                                className={`lm-role-card ${role.color}`}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                custom={i * 0.5}
                            >
                                <div className="lm-role-header">
                                    <div className="feature-icon">
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <h3>{role.role}</h3>
                                        <p className="lm-role-desc">{role.description}</p>
                                    </div>
                                </div>
                                <ul className="lm-cap-list">
                                    {role.capabilities.map((cap) => (
                                        <li key={cap}>
                                            <CheckCircle2 size={15} />
                                            <span>{cap}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Testimonial / Trust */}
            <section className="lm-section">
                <motion.div
                    className="lm-trust-card"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="lm-trust-stars">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill="currentColor" />
                        ))}
                    </div>
                    <blockquote className="lm-quote">
                        "Animal Guardian helped us cut our average rescue response time by 60%. The real-time
                        status tracking and instant notifications make our team coordination seamless — we've
                        handled over 300 cases since joining."
                    </blockquote>
                    <div className="lm-quote-author">
                        <div className="lm-author-avatar">PR</div>
                        <div>
                            <p className="lm-author-name">Priya Rao</p>
                            <p className="lm-author-role">Operations Head, Paws Rescue NGO</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* FAQ */}
            <section className="lm-section">
                <div className="section-header">
                    <p className="section-meta">Got questions?</p>
                    <h2>Frequently asked questions.</h2>
                </div>
                <div className="lm-faq-grid">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={faq.q}
                            className="lm-faq-card"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={i * 0.3}
                        >
                            <h3>{faq.q}</h3>
                            <p>{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div>
                    <h2>Ready to make a difference?</h2>
                    <p>
                        Join thousands of citizens and NGOs already using Animal Guardian to protect animals
                        across the country. It's free, fast, and built for impact.
                    </p>
                </div>
                <Link to="/register" className="button button-primary cta-button">
                    Create Free Account
                </Link>
            </section>
        </main>
    )
}
