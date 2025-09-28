import React from "react";
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
    Sparkles,
    ArrowRight,
    LineChart,
    Layers,
    Globe,
    Target,
    Zap,
    CheckCircle,
    Brain,
    Network,
} from "lucide-react";

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
                className="icon-chip d-inline-flex mx-auto mb-3 icon-chip-purple"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <Icon size={24} />
            </motion.div>
            <h3 className="h6 gradient-text">{title}</h3>
        </div>
        <p className="small text-slate-600 mb-0">{desc}</p>
    </motion.div>
);

export default function About() {
    return (
        <div className="min-vh-100 w-100 bg-white text-slate-900">
            <Navbar currentPage="about" />

            {/* Hero Section - Split Layout */}
            <section id="home" className="hero-bg">
                <div className="container-xl py-5">
                    <div className="row align-items-center g-5">
                        <motion.div 
                            initial="hidden" 
                            whileInView="show" 
                            viewport={{ once: true, amount: 0.3 }} 
                            variants={stagger}
                            className="col-lg-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <Badge>About MLSChat</Badge>
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

                            <motion.p variants={fadeUp} className="mt-1 text-slate-600">
                                Create your account today and unlock the most powerful platform ever built for real estate pros - at zero cost.
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
                                    Create Your Free Account <ArrowRight size={16} />
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
                        </motion.div>

                        <motion.div 
                            initial="hidden" 
                            whileInView="show" 
                            viewport={{ once: true, amount: 0.3 }} 
                            variants={stagger}
                            className="col-lg-6"
                        >
                            <motion.div 
                                variants={fadeUp}
                                whileHover={{ 
                                    scale: 1.02,
                                    y: -5
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="card-soft rounded-3xl p-4 p-md-5 text-center">
                                    <motion.div 
                                        className="display-1 mb-3"
                                        animate={{ 
                                            rotate: [0, 5, -5, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ 
                                            duration: 4, 
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        🏠
                                    </motion.div>
                                    <h3 className="h4 text-purple">Your Professional Network</h3>
                                    <p className="text-slate-600 mb-0">
                                        Connect with thousands of real estate professionals, share your expertise, 
                                        and grow your business in the most trusted agent community.
                                    </p>
                                </div>
                                <motion.div 
                                    className="position-absolute top-0 start-0 translate-middle"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="badge bg-success text-white rounded-pill px-3 py-2">
                                        <CheckCircle size={16} className="me-1" />
                                        Agent-First
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Social proof - Horizontal layout */}
                    <motion.div variants={stagger} className="mt-5">
                        <div className="row g-3 justify-content-center">
                            <div className="col-md-3">
                                <motion.div 
                                    className="card-soft rounded-2xl p-3 text-center stat-card"
                                    variants={fadeUp}
                                    whileHover={{ 
                                        scale: 1.05,
                                        y: -5
                                    }}
                                >
                                    <div className="d-flex align-items-center justify-content-center mb-2">
                                        <Users size={24} className="text-purple" />
                                    </div>
                                    <div className="fw-semibold text-slate-900" style={{ fontSize: "1.5rem" }}>12,500+</div>
                                    <div className="small text-slate-600">Agents & Brokers</div>
                                </motion.div>
                            </div>
                            <div className="col-md-3">
                                <motion.div 
                                    className="card-soft rounded-2xl p-3 text-center stat-card"
                                    variants={fadeUp}
                                    whileHover={{ 
                                        scale: 1.05,
                                        y: -5
                                    }}
                                >
                                    <div className="d-flex align-items-center justify-content-center mb-2">
                                        <Globe size={24} className="text-purple" />
                                    </div>
                                    <div className="fw-semibold text-slate-900" style={{ fontSize: "1.5rem" }}>120+</div>
                                    <div className="small text-slate-600">Active Markets</div>
                                </motion.div>
                            </div>
                            <div className="col-md-3">
                                <motion.div 
                                    className="card-soft rounded-2xl p-3 text-center stat-card"
                                    variants={fadeUp}
                                    whileHover={{ 
                                        scale: 1.05,
                                        y: -5
                                    }}
                                >
                                    <div className="d-flex align-items-center justify-content-center mb-2">
                                        <Zap size={24} className="text-purple" />
                                    </div>
                                    <div className="fw-semibold text-slate-900" style={{ fontSize: "1.5rem" }}>2m 18s</div>
                                    <div className="small text-slate-600">Avg. Response</div>
                                </motion.div>
                            </div>
                            <div className="col-md-3">
                                <motion.div 
                                    className="card-soft rounded-2xl p-3 text-center stat-card"
                                    variants={fadeUp}
                                    whileHover={{ 
                                        scale: 1.05,
                                        y: -5
                                    }}
                                >
                                    <div className="d-flex align-items-center justify-content-center mb-2">
                                        <LineChart size={24} className="text-purple" />
                                    </div>
                                    <div className="fw-semibold text-slate-900" style={{ fontSize: "1.5rem" }}>1.2M</div>
                                    <div className="small text-slate-600">Listings Shared</div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* What Makes MLSChat Different? */}
            <section id="features" className="bg-slate-50">
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <div className="text-center mb-5">
                            <motion.h2 
                                variants={fadeUp} 
                                className="fw-semibold gradient-text" 
                                style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                            >
                                What Makes MLSChat Different?
                            </motion.h2>
                            <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760, margin: "0 auto" }}>
                                MLSChat isn't just another social media app. It's a purpose-built platform designed for agents, by agents—
                                giving you everything you need to grow your brand, close more deals, and connect with the industry like never before:
                            </motion.p>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-4 col-md-6">
                                <ModuleCard 
                                    icon={Newspaper} 
                                    title="Post, Promote, and Grow" 
                                    desc="Share market updates, wins, open houses, and more across your profile and newsfeed." 
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <ModuleCard 
                                    icon={MapPin} 
                                    title="Upload Your Listings Instantly" 
                                    desc="Publish listings for visibility and lead generation with powerful share tools." 
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <ModuleCard 
                                    icon={Layers} 
                                    title="Build SEO-Friendly Agent Pages" 
                                    desc="Attract clients 24/7 on Google with your own professional agent profile." 
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <ModuleCard 
                                    icon={MessageSquare} 
                                    title="Share Listings & Updates" 
                                    desc="Seamless posting of listings, company updates, and local wins." 
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <ModuleCard 
                                    icon={Building2} 
                                    title="Engage with Broker Pages" 
                                    desc="Stay in the loop with team channels and office updates." 
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <ModuleCard 
                                    icon={Target} 
                                    title="Generate Organic Leads" 
                                    desc="Every listing post and interaction helps you get discovered by the right buyers and agents." 
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* AI Coach */}
            <section id="ai-coach">
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <div className="row align-items-center g-5">
                            <div className="col-lg-6">
                                <motion.h2 
                                    variants={fadeUp} 
                                    className="fw-semibold gradient-text" 
                                    style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                                >
                                    Work Smarter with Your Real Estate AI Coach
                                </motion.h2>
                                <motion.p variants={fadeUp} className="mt-2 text-slate-600">
                                    Let our built-in, next-gen AI Real Estate Coach guide you through marketing tips, script writing, listing feedback, and more.
                                    Whether you're a rookie or a seasoned top producer, our AI helps you stay ahead.
                                </motion.p>
                                
                                <motion.div variants={fadeUp} className="mt-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <motion.div 
                                            className="icon-chip d-inline-flex icon-chip-purple"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Brain size={20} />
                                        </motion.div>
                                        <span className="fw-semibold text-slate-900">Smart prompts for listings, outreach scripts, market updates, and ad copy.</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <motion.div 
                                            className="icon-chip d-inline-flex icon-chip-purple"
                                            whileHover={{ scale: 1.1, rotate: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Zap size={20} />
                                        </motion.div>
                                        <span className="fw-semibold text-slate-900">AI-powered market analysis and trend predictions.</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <motion.div 
                                            className="icon-chip d-inline-flex icon-chip-purple"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Target size={20} />
                                        </motion.div>
                                        <span className="fw-semibold text-slate-900">Personalized coaching based on your experience level.</span>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <div className="col-lg-6">
                                <motion.div 
                                    variants={fadeUp}
                                    whileHover={{ 
                                        scale: 1.02,
                                        y: -5
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="card-soft rounded-3xl p-4 p-md-5 text-center">
                                        <motion.div 
                                            className="display-1 mb-3"
                                            animate={{ 
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ 
                                                duration: 3, 
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            🤖
                                        </motion.div>
                                        <h3 className="h4 text-purple">Your AI Assistant</h3>
                                        <p className="text-slate-600 mb-0">
                                            Get instant help with marketing strategies, client communication, 
                                            and market insights powered by advanced AI technology.
                                        </p>
                                    </div>
                                    <motion.div 
                                        className="position-absolute top-0 end-0 translate-middle"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="badge badge-purple">
                                            <Zap size={16} className="me-1" />
                                            AI-Powered
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Referral Network */}
            <section id="referral" className="bg-slate-50">
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <div className="text-center mb-5">
                            <motion.h2 
                                variants={fadeUp} 
                                className="fw-semibold gradient-text" 
                                style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                            >
                                Build a Powerful Referral Network
                            </motion.h2>
                            <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760, margin: "0 auto" }}>
                                Stay connected with top agents across the country using our Referral Match & Tracker System:
                            </motion.p>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-3 col-md-6">
                                <div className="text-center">
                                    <motion.div 
                                        className="icon-chip d-inline-flex mx-auto mb-3 icon-chip-purple"
                                        style={{ width: "64px", height: "64px" }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Users size={32} />
                                    </motion.div>
                                    <h4 className="h6 text-purple">Send & Receive Referrals</h4>
                                    <p className="small text-slate-600 mb-0">Connect with trusted agents in any market and keep deals moving.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="text-center">
                                    <motion.div 
                                        className="icon-chip d-inline-flex mx-auto mb-3 icon-chip-purple"
                                        style={{ width: "64px", height: "64px" }}
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <MessageSquare size={32} />
                                    </motion.div>
                                    <h4 className="h6 text-purple">Track Follow-Ups</h4>
                                    <p className="small text-slate-600 mb-0">Never let a referral slip through the cracks again.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="text-center">
                                    <motion.div 
                                        className="icon-chip d-inline-flex mx-auto mb-3 icon-chip-purple"
                                        style={{ width: "64px", height: "64px" }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Network size={32} />
                                    </motion.div>
                                    <h4 className="h6 text-purple">Reengage Connections</h4>
                                    <p className="small text-slate-600 mb-0">Spark new deals and out-of-market leads from your network.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="text-center">
                                    <motion.div 
                                        className="icon-chip d-inline-flex mx-auto mb-3 icon-chip-purple"
                                        style={{ width: "64px", height: "64px" }}
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Target size={32} />
                                    </motion.div>
                                    <h4 className="h6 text-purple">Be the Go-To Agent</h4>
                                    <p className="small text-slate-600 mb-0">Show you're responsive and reliable when referrals come your way.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Free forever */}
            <section>
                <div className="container-xl py-5">
                    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
                        <div className="row align-items-center g-5">
                            <div className="col-lg-8">
                                <motion.h2 
                                    variants={fadeUp} 
                                    className="fw-semibold gradient-text" 
                                    style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                                >
                                    All This. Totally Free. No Catch.
                                </motion.h2>
                                <motion.p variants={fadeUp} className="mt-2 text-slate-600">
                                    No subscriptions. No hidden fees. Just a powerful, agent-first ecosystem designed to help you win in today's market.
                                </motion.p>
                                
                                <motion.div variants={fadeUp} className="mt-4">
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <motion.div 
                                            className="icon-chip d-inline-flex icon-chip-purple"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <CheckCircle size={20} />
                                        </motion.div>
                                        <span className="fw-semibold text-slate-900">No credit card required</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <motion.div 
                                            className="icon-chip d-inline-flex icon-chip-purple"
                                            whileHover={{ scale: 1.1, rotate: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <CheckCircle size={20} />
                                        </motion.div>
                                        <span className="fw-semibold text-slate-900">No hidden fees or charges</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <motion.div 
                                            className="icon-chip d-inline-flex icon-chip-purple"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <CheckCircle size={20} />
                                        </motion.div>
                                        <span className="fw-semibold text-slate-900">Free forever with full access</span>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <div className="col-lg-4">
                                <motion.div 
                                    variants={fadeUp}
                                    whileHover={{ 
                                        scale: 1.02,
                                        y: -5
                                    }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="text-center">
                                    <div className="card-soft rounded-3xl p-4 p-md-5">
                                            <motion.div 
                                                className="display-1 mb-3"
                                                animate={{ 
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, 0]
                                                }}
                                                transition={{ 
                                                    duration: 3, 
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                🎁
                                            </motion.div>
                                            <h3 className="h4 text-purple">100% Free</h3>
                                        <p className="text-slate-600 mb-0">
                                            Join thousands of agents who are already growing their business 
                                            with our completely free platform.
                                        </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section id="cta" className="bg-slate-900">
                <div className="container-xl py-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <motion.h2 
                            variants={fadeUp} 
                            className="fw-semibold text-white gradient-text" 
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Join Now & Upload Your First Listing
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-300" style={{ maxWidth: 800, margin: "0 auto" }}>
                            The sooner you join, the sooner you can start expanding your visibility, growing your referral network, generating leads, and dominating your local market.
                        </motion.p>
                        
                        <motion.div variants={fadeUp} className="mt-4 d-flex flex-wrap justify-content-center gap-3">
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
                                Create Your Free Account <ArrowRight size={16} />
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
                        
                        <motion.div variants={fadeUp} className="mt-5">
                            <div className="row g-4 justify-content-center">
                                <div className="col-md-3">
                                    <motion.div 
                                        className="text-center"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="display-6 text-purple">📈</div>
                                        <div className="fw-semibold text-white">Expand Visibility</div>
                                        <div className="small text-slate-400">Get discovered by more clients</div>
                                    </motion.div>
                                </div>
                                <div className="col-md-3">
                                    <motion.div 
                                        className="text-center"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="display-6 text-purple">🤝</div>
                                        <div className="fw-semibold text-white">Grow Network</div>
                                        <div className="small text-slate-400">Connect with top agents</div>
                                    </motion.div>
                                </div>
                                <div className="col-md-3">
                                    <motion.div 
                                        className="text-center"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="display-6 text-purple">🎯</div>
                                        <div className="fw-semibold text-white">Generate Leads</div>
                                        <div className="small text-slate-400">Convert prospects to clients</div>
                                    </motion.div>
                                </div>
                                <div className="col-md-3">
                                    <motion.div 
                                        className="text-center"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="display-6 text-purple">🏆</div>
                                        <div className="fw-semibold text-white">Dominate Market</div>
                                        <div className="small text-slate-400">Become the go-to agent</div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer showTagline={true} tagline="MLSChat — Where Real Estate Pros Network, Market, and Win." />
        </div>
    );
} 