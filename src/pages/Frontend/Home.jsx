import React, { useState } from "react";
import { motion } from "framer-motion";
import '../../home.css';
import './frontend.css';
import Navbar from '../../components/frontend/Navbar';
import Footer from '../../components/frontend/Footer';
import { Building2 } from "lucide-react";
import {
    Users,
    MessageSquare,
    Newspaper,
    MapPin,
    ShieldCheck,
    Sparkles,
    ArrowRight,
    ArrowUpRight,
    LineChart,
    Layers,
} from "lucide-react";
import { apiFetch } from '../../lib/apiClient';
import { toast } from 'react-toastify';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const stagger = {
    show: { transition: { staggerChildren: 0.08 } },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

const Badge = ({ children }) => (
    <motion.span 
        className="badge-soft d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1 small badge-purple"
        whileHover={{ 
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(91, 33, 182, 0.3)"
        }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <Sparkles size={14} /> {children}
    </motion.span>
);

const Stat = ({ label, value }) => (
    <motion.div
        variants={fadeUp}
        className="stat-enhanced d-flex flex-column align-items-center justify-content-center stat-card"
        whileHover={{ 
            scale: 1.05,
            y: -5
        }}
    >
        <div className="fw-semibold stat-value-purple" style={{ fontSize: "1.75rem", lineHeight: 1 }}>
            {value}
        </div>
        <div className="mt-1 small text-slate-600 text-center">{label}</div>
    </motion.div>
);

const ModuleCard = ({ icon: Icon, title, desc }) => (
    <motion.div 
        variants={fadeUp} 
        className="feature-enhanced card-purple"
        whileHover={{ 
            scale: 1.02,
            y: -8,
            boxShadow: "0 20px 40px rgba(91, 33, 182, 0.15)"
        }}
    >
        <div className="d-flex align-items-center gap-3">
            <motion.div 
                className="icon-chip d-inline-flex icon-chip-purple"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <Icon size={24} />
            </motion.div>
            <h3 className="h6 m-0 gradient-text">{title}</h3>
        </div>
        <p className="mt-3 small text-slate-600">{desc}</p>
        <motion.div 
            className="mt-3 d-inline-flex align-items-center gap-1 small opacity-75 text-purple"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            Learn more <ArrowUpRight size={16} />
        </motion.div>
    </motion.div>
);

export default function Home() {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        
        try {
            await apiFetch(`${APP_BASE_URL}/api/contact`, {
                method: 'POST',
                body: JSON.stringify(contactForm),
            });
            
            toast.success('Thank you for your message! We will get back to you soon.');
            setContactForm({ name: '', email: '', message: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-vh-100 w-100 bg-white text-slate-900">
            <Navbar currentPage="home" />

            {/* Hero */}
            <section id="home">
                <div className="container-xl py-5 py-md-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                        <Badge>Built for Real Estate</Badge>
                        </motion.div>

                        <motion.h1 
                            variants={fadeUp} 
                            className="mt-3 fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}
                        >
                            Welcome to MLSChat
                        </motion.h1>

                        <motion.p variants={fadeUp} className="mt-2 lead text-slate-700">
                            The <strong>FREE Social Network</strong> Built Exclusively for Real Estate Agents
                        </motion.p>

                        <motion.p variants={fadeUp} className="mt-1 text-slate-600" style={{ maxWidth: 760 }}>
                            Create your account today and unlock the most powerful platform ever built for real estate pros — at zero cost.
                        </motion.p>

                        <motion.div variants={fadeUp} className="mt-4 d-flex flex-wrap align-items-center gap-2">
                            <motion.a 
                                href="/signup" 
                                className="btn-modern d-inline-flex align-items-center gap-2 btn-purple"
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 8px 25px rgba(91, 33, 182, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Create your free account <ArrowRight size={16} />
                            </motion.a>
                            <motion.a 
                                href="/login" 
                                className="btn-outline-modern d-inline-flex align-items-center gap-2 btn-outline-purple"
                                whileHover={{ 
                                    scale: 1.05,
                                    background: '#5B21B6',
                                    color: 'white'
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                Log in
                            </motion.a>
                        </motion.div>

                        {/* Social proof */}
                        <motion.div variants={stagger} className="mt-4">
                            <div className="row g-2 row-cols-2 row-cols-sm-4">
                                <div className="col"><Stat label="Agents & Brokers" value="12,500+" /></div>
                                <div className="col"><Stat label="Active Markets" value="120+" /></div>
                                <div className="col"><Stat label="Avg. Response Time" value="2m 18s" /></div>
                                <div className="col"><Stat label="Listings Shared" value="1.2M" /></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* What Makes MLSChat Different? */}
            <section id="about">
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            What Makes MLSChat Different?
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            MLSChat isn't just another social media app. It's a purpose-built platform designed for agents, by agents —
                            giving you everything you need to grow your brand, close more deals, and connect with the industry like never before:
                        </motion.p>

                        <div className="row g-3 mt-3">
                            <div className="col-md-6">
                                <ModuleCard icon={Newspaper} title="Post, Promote, and Grow — All in One Place" desc="Share market updates, wins, open houses, and more across your profile and newsfeed." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={MapPin} title="Upload Your Listings Instantly" desc="Publish listings for visibility and lead generation with powerful share tools." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={Layers} title="Build SEO-Friendly Agent Pages" desc="Attract clients 24/7 on Google with your own professional agent profile." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={Building2} title="Engage with Broker Pages & Office Threads" desc="Stay in the loop with team channels and office updates." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={Users} title="Generate Organic Leads" desc="Every listing post and interaction helps you get discovered by the right buyers and agents." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={MessageSquare} title="Share Listings & Updates" desc="Seamless posting of listings, company updates, and local wins." />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* AI Coach */}
            <section>
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Work Smarter with Your Real Estate AI Coach
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            Let our built-in, next-gen AI Real Estate Coach guide you through marketing tips, script writing, listing feedback, and more.
                            Whether you're a rookie or a seasoned top producer, our AI helps you stay ahead.
                        </motion.p>
                        <motion.div 
                            variants={fadeUp} 
                            className="card-soft rounded-2xl p-4 mt-3 card-purple-subtle"
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: "0 15px 35px rgba(91, 33, 182, 0.1)"
                            }}
                        >
                            <div className="d-flex align-items-center gap-2 text-slate-700">
                                <ShieldCheck size={18} className="text-purple" />
                                <span className="small">Smart prompts for listings, outreach scripts, market updates, and ad copy.</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Referral Network */}
            <section>
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Build a Powerful Referral Network
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            Stay connected with top agents across the country using our Referral Match & Tracker System:
                        </motion.p>

                        <div className="row g-3 mt-1">
                            <div className="col-md-6">
                                <ModuleCard icon={Users} title="Send and Receive Referrals with Confidence" desc="Connect with trusted agents in any market and keep deals moving." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={MessageSquare} title="Track Follow-Ups and Commitments" desc="Never let a referral slip through the cracks again." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={Layers} title="Reengage with Past Connections" desc="Spark new deals and out-of-market leads from your network." />
                            </div>
                            <div className="col-md-6">
                                <ModuleCard icon={Building2} title="Be the Go-To Agent" desc="Show you're responsive and reliable when referrals come your way." />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Free forever */}
            <section>
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            All This. Totally Free. No Catch.
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            No subscriptions. No hidden fees. Just a powerful, agent-first ecosystem designed to help you win in today's market.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section id="cta">
                <div className="container-xl py-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-3xl border border-slate-200 p-4 p-md-5 card-purple-subtle"
                    >
                        <div className="row g-4 align-items-center">
                            <div className="col-md-6">
                                <motion.h3 
                                    className="fw-semibold text-slate-900" 
                                    style={{ fontSize: "clamp(1.5rem,2.2vw,2rem)" }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    Join Now & Upload Your First Listing
                                </motion.h3>
                                <p className="mt-2 text-slate-700">The sooner you join, the sooner you can start:</p>
                                <div className="row row-cols-1 row-cols-md-2 g-1 mt-2 small text-slate-700 ps-3">
                                    <div className="col">• Expanding your visibility</div>
                                    <div className="col">• Growing your referral network</div>
                                    <div className="col">• Generating leads</div>
                                    <div className="col">• Dominating your local market</div>
                                </div>
                                <div className="mt-3 d-flex flex-wrap gap-2">
                                    <motion.a 
                                        href="/signup" 
                                        className="btn-modern d-inline-flex align-items-center gap-2 btn-purple"
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: "0 8px 25px rgba(91, 33, 182, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Create your free account <ArrowRight size={16} />
                                    </motion.a>
                                    <motion.a 
                                        href="/login" 
                                        className="btn-outline-modern d-inline-flex align-items-center gap-2 btn-outline-purple"
                                        whileHover={{ 
                                            scale: 1.05,
                                            background: '#5B21B6',
                                            color: 'white'
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Log in
                                    </motion.a>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <motion.div 
                                    className="card-soft rounded-2xl p-4"
                                    whileHover={{ 
                                        scale: 1.02,
                                        y: -5
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="d-flex align-items-center gap-2 text-slate-700">
                                        <LineChart size={18} className="text-purple" />
                                        <div className="small">This week</div>
                                    </div>
                                    <div className="mt-3 row g-2 text-center small">
                                        <div className="col-4">
                                            <motion.div 
                                                className="bg-slate-50 rounded-3 p-3 border-purple"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <div className="fw-semibold text-slate-900" style={{ fontSize: "1.1rem" }}>58</div>
                                                <div className="text-slate-600">New leads</div>
                                            </motion.div>
                                        </div>
                                        <div className="col-4">
                                            <motion.div 
                                                className="bg-slate-50 rounded-3 p-3 border-purple"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <div className="fw-semibold text-slate-900" style={{ fontSize: "1.1rem" }}>34</div>
                                                <div className="text-slate-600">Listing shares</div>
                                            </motion.div>
                                        </div>
                                        <div className="col-4">
                                            <motion.div 
                                                className="bg-slate-50 rounded-3 p-3 border-purple"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <div className="fw-semibold text-slate-900" style={{ fontSize: "1.1rem" }}>12</div>
                                                <div className="text-slate-600">Tours booked</div>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-slate-500 small mb-0">*Sample metrics for illustration.</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming */}
            <section id="upcoming">
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Upcoming
                        </motion.h2>

                        <div className="row g-3 mt-2">
                            {[
                                { title: "Referral Match 2.0", desc: "Deeper agent discovery, reputation graph, and smart routing." },
                                { title: "In-Thread Listing Tours", desc: "Schedule, confirm, and follow up without leaving chat." },
                                { title: "Broker Pages Enhancements", desc: "Role-based controls, office threads, and analytics." },
                            ].map((i, index) => (
                                <div key={i.title} className="col-md-4">
                                    <motion.div 
                                        className="card-soft rounded-2xl p-4 h-100 card-purple-subtle"
                                        variants={fadeUp}
                                        whileHover={{ 
                                            scale: 1.03,
                                            y: -8,
                                            boxShadow: "0 20px 40px rgba(91, 33, 182, 0.15)"
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <h3 className="h6 text-slate-900">{i.title}</h3>
                                        <p className="mt-2 small text-slate-600 mb-0">{i.desc}</p>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact">
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Contact Us
                        </motion.h2>

                        <div className="row g-4 mt-2">
                            <div className="col-md-6">
                                <motion.form 
                                    className="card-soft rounded-2xl p-4"
                                    variants={slideInLeft}
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 15px 35px rgba(91, 33, 182, 0.1)"
                                    }}
                                    onSubmit={handleContactSubmit}
                                >
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <input 
                                                className="form-control rounded-3" 
                                                placeholder="Your name" 
                                                name="name"
                                                value={contactForm.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <input 
                                                className="form-control rounded-3" 
                                                placeholder="Email" 
                                                type="email"
                                                name="email"
                                                value={contactForm.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <textarea 
                                                className="form-control rounded-3" 
                                                placeholder="How can we help?" 
                                                rows={5}
                                                name="message"
                                                value={contactForm.message}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <motion.button 
                                        type="submit" 
                                        className="btn rounded-3 d-inline-flex align-items-center gap-2 mt-3 btn-purple"
                                        whileHover={{ 
                                            scale: 1.05,
                                            boxShadow: "0 8px 25px rgba(91, 33, 182, 0.4)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send message'} <ArrowRight size={16} />
                                    </motion.button>
                                </motion.form>
                            </div>

                            <div className="col-md-6">
                                <motion.div 
                                    className="card-soft rounded-2xl p-4 h-100 d-flex flex-column justify-content-between shadow-lg border border-slate-200 bg-white"
                                    variants={slideInRight}
                                    whileHover={{ 
                                        scale: 1.02,
                                        y: -5
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div>
                                        <h3 className="h6 mb-3 d-flex align-items-center gap-2 text-purple">
                                            <span role="img" aria-label="Pages">📄</span> Quick Navigation
                                        </h3>
                                        <ul className="mt-2 small text-slate-700 list-unstyled">
                                            <li className="mb-2">
                                                <a href="#home" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft fw-semibold">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏠</span>
                                                    Home
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a href="#about" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft fw-semibold">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>ℹ️</span>
                                                    About
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a href="#upcoming" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft fw-semibold">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⏳</span>
                                                    Upcoming
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a href="#features" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft fw-semibold">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✨</span>
                                                    Features
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#contact" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft fw-semibold">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✉️</span>
                                                    Contact Us
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="h6 mb-3 d-flex align-items-center gap-2 text-purple">
                                            <span role="img" aria-label="Account">👤</span> Account & Resources
                                        </h3>
                                        <ul className="mt-2 small text-slate-700 list-unstyled mb-0">
                                            <li className="mb-2">
                                                <a href="/login" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔑</span>
                                                    Log in
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a href="/signup" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📝</span>
                                                    Sign up
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a href="/faq" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>❓</span>
                                                    FAQ
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/support" className="d-flex align-items-center gap-2 text-decoration-none nav-link-soft">
                                                    <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛟</span>
                                                    Support
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mt-4 border-top pt-3">
                                        <h3 className="h6 mb-2 d-flex align-items-center gap-2 text-purple">
                                            <span role="img" aria-label="Connect">🌐</span> Connect with Us
                                        </h3>
                                        <div className="d-flex gap-3">
                                            <motion.a 
                                                href="https://twitter.com/" 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-decoration-none" 
                                                title="Twitter"
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🐦</span>
                                            </motion.a>
                                            <motion.a 
                                                href="https://facebook.com/" 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-decoration-none" 
                                                title="Facebook"
                                                whileHover={{ scale: 1.2, rotate: -5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📘</span>
                                            </motion.a>
                                            <motion.a 
                                                href="mailto:support@mlschat.com" 
                                                className="text-decoration-none" 
                                                title="Email"
                                                whileHover={{ scale: 1.2, y: -3 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📧</span>
                                            </motion.a>
                                            <motion.a 
                                                href="https://www.linkedin.com/" 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-decoration-none" 
                                                title="LinkedIn"
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <span className="badge rounded-circle shadow-sm icon-chip-purple" style={{ width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💼</span>
                                            </motion.a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
