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
    Search,
    ShieldCheck,
    Sparkles,
    ArrowRight,
    ArrowUpRight,
    Globe,
    Link,
    BarChart3,
    CheckCircle,
    Zap,
    Target,
    Heart,
    X
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

const FeatureCard = ({ icon: Icon, title, desc, gradient, delay = 0 }) => (
    <motion.div
        variants={fadeUp}
        className="feature-enhanced card-purple"
        style={{ animationDelay: `${delay}s` }}
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

const BenefitCard = ({ icon: Icon, title, desc, color = "primary" }) => (
    <motion.div
        variants={fadeUp}
        className="card-soft rounded-2xl p-4 h-100 card-purple"
        whileHover={{
            scale: 1.03,
            y: -5,
            boxShadow: "0 15px 35px rgba(91, 33, 182, 0.1)"
        }}
    >
        <div className="d-flex align-items-center gap-3">
            <motion.div
                className={`icon-chip d-inline-flex bg-${color}-subtle text-${color}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <Icon size={24} />
            </motion.div>
            <h4 className="h6 m-0 text-slate-900">{title}</h4>
        </div>
        <p className="mt-3 small text-slate-600">{desc}</p>
    </motion.div>
);

export default function Upcoming() {
    return (
        <div className="min-vh-100 w-100 bg-white text-slate-900">
            <Navbar currentPage="upcoming" />

            {/* Hero Section */}
            <section className="hero-bg py-5">
                <div className="container-xl">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={stagger}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <Badge>🚀 Coming Soon</Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeUp}
                            className="mt-3 fw-semibold"
                            style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}
                        >
                            The Ultimate Home Search Experience
                        </motion.h1>
                        <motion.p variants={fadeUp} className="mt-3 lead text-slate-700" style={{ maxWidth: 800, margin: "0 auto" }}>
                            A Client-Facing Platform That Puts You at the Center of the Buying Journey
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Main Value Proposition */}
            <section id="about">
                <div className="container-xl py-5">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                    >
                        <motion.h2
                            variants={fadeUp}
                            className="fw-semibold gradient-text"
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Give Your Buyers a Smarter, Simpler, and Agent-First Experience
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            You asked—we listened. MLSChat is expanding beyond agent-to-agent networking and listing visibility.
                        </motion.p>
                        <motion.p variants={fadeUp} className="mt-1 text-slate-600" style={{ maxWidth: 760 }}>
                            We're launching a client-facing portal that lets your buyers search, plan, and communicate with you—all in one place.
                            Think <strong>Ruuster.com</strong>, but agent-first and completely aligned with your brand.
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
                                <span className="small">Agent-first platform with full branding control and zero competing distractions.</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* What's Coming Section */}
            <section id="features">
                <div className="container-xl py-5">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                    >
                        <motion.h2
                            variants={fadeUp}
                            className="fw-semibold gradient-text"
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            What's Coming
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            Powerful tools designed to make you the hero of every home search. MLSChat is expanding beyond agent-to-agent networking
                            to give you a complete client-facing platform.
                        </motion.p>

                        <div className="row g-3 mt-3">
                            <div className="col-md-6">
                                <FeatureCard
                                    icon={Globe}
                                    title="Branded Home Search Pages"
                                    desc="Your buyers will explore listings in a sleek interface where your name, face, and brand are front and center. No competing agents. No third-party ads. No distractions."
                                />
                            </div>
                            <div className="col-md-6">
                                <FeatureCard
                                    icon={MessageSquare}
                                    title="Built-In Buyer Communication Hub"
                                    desc="Message, collaborate, and manage the home search experience directly inside MLSChat. Track questions, favorites, timelines, and more—all in one place."
                                />
                            </div>
                            <div className="col-md-6">
                                <FeatureCard
                                    icon={Search}
                                    title="Personalized Home Search Tools"
                                    desc="Just like Ruuster, but custom-built for your workflow. Homebuyers can organize to-dos, track documents, manage timelines—and you stay in control of the process."
                                />
                            </div>
                            <div className="col-md-6">
                                <FeatureCard
                                    icon={Users}
                                    title="Referral-Ready Design"
                                    desc="Once buyers see how seamless your branded experience is, they'll be more likely to send their friends your way. MLSChat's referral tools will work on the client side too—keeping you top-of-mind and first-in-line."
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Differentiation Section */}
            <section>
                <div className="container-xl py-5">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                    >
                        <motion.h2
                            variants={fadeUp}
                            className="fw-semibold gradient-text"
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Keep Your Face on Their Journey
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            This isn't Zillow. This isn't Redfin. This is your portal, your brand, your relationship—backed by MLSChat's tech and zero distractions.
                        </motion.p>

                        <motion.div variants={fadeUp} className="mt-3 d-flex gap-3 flex-wrap">
                            <motion.div
                                className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2"
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <X size={16} className="me-1" />
                                No Zillow
                            </motion.div>
                            <motion.div
                                className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <X size={16} className="me-1" />
                                No Redfin
                            </motion.div>
                            <motion.div
                                className="badge bg-success-subtle text-success rounded-pill px-3 py-2"
                                whileHover={{ scale: 1.1, y: -3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle size={16} className="me-1" />
                                Your Brand
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* What Agents Will Get Section */}
            <section id="benefits" className="py-5 bg-slate-50">
                <div className="container-xl">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                    >
                        <motion.h2
                            variants={fadeUp}
                            className="fw-semibold gradient-text"
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Agents Will Get
                        </motion.h2>
                        <motion.p variants={fadeUp} className="mt-2 text-slate-600" style={{ maxWidth: 760 }}>
                            Everything you need to dominate your local market. MLSChat is building the tools that will make you the go-to agent in your area.
                        </motion.p>

                        <div className="row g-4">
                            <div className="col-md-6 col-lg-4">
                                <BenefitCard
                                    icon={Link}
                                    title="Custom URL"
                                    desc="A custom URL to share with buyers that showcases your brand"
                                    color="primary"
                                />
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <BenefitCard
                                    icon={Building2}
                                    title="Seamless Integration"
                                    desc="Full integration with your MLSChat listings and profile"
                                    color="success"
                                />
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <BenefitCard
                                    icon={Target}
                                    title="Full Branding Control"
                                    desc="Complete control across every step of the buyer experience"
                                    color="warning"
                                />
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <BenefitCard
                                    icon={Zap}
                                    title="One-Click Invites"
                                    desc="Simple invite links for onboarding new clients into your system"
                                    color="info"
                                />
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <BenefitCard
                                    icon={BarChart3}
                                    title="Lead Visibility & Analytics"
                                    desc="Complete visibility into leads, analytics, and messaging—no gatekeepers"
                                    color="purple"
                                />
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <BenefitCard
                                    icon={Heart}
                                    title="Client Relationship Management"
                                    desc="Build stronger relationships with tools designed for real estate professionals"
                                    color="danger"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-grad-soft">
                <div className="container-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <motion.h2
                            className="fw-semibold text-slate-900 gradient-text"
                            style={{ fontSize: "clamp(1.75rem,2.5vw,2.25rem)" }}
                        >
                            Be the First to Launch With It
                        </motion.h2>
                        <p className="lead text-slate-700 mt-3" style={{ maxWidth: 800, margin: "0 auto" }}>
                            The consumer-facing platform is already in development—and early access will go to agents who are already active on MLSChat.
                        </p>
                        <p className="text-slate-600 mt-3">
                            Create your account today and start building your listings, profile, and client base.
                            When it launches, your buyers will already be there—with your name on it.
                        </p>

                        <div className="mt-4 d-flex justify-content-center flex-wrap align-items-center gap-2">
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
                                Get Started <ArrowRight size={16} />
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
                                Sign In to Existing Account
                            </motion.a>
                        </div>

                        <motion.div
                            className="mt-4 d-flex align-items-center justify-content-center gap-3 text-slate-600 small"
                            variants={stagger}
                        >
                            <motion.div
                                className="d-flex align-items-center gap-2"
                                variants={fadeUp}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle size={16} className="text-success" />
                                No credit card required
                            </motion.div>
                            <motion.div
                                className="d-flex align-items-center gap-2"
                                variants={fadeUp}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle size={16} className="text-success" />
                                Free forever
                            </motion.div>
                            <motion.div
                                className="d-flex align-items-center gap-2"
                                variants={fadeUp}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CheckCircle size={16} className="text-success" />
                                Priority access
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
} 