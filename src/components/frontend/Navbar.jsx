import React from "react";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";

export default function Navbar({ currentPage = "home" }) {
    const token = localStorage.getItem('token');
    const navItems = [
        { href: "/", label: "Home", isActive: currentPage === "home" },
        { href: "/about", label: "About", isActive: currentPage === "about" },
        { href: "/upcoming", label: "Upcoming", isActive: currentPage === "upcoming" },
        { href: "/professionals", label: "Professionals", isActive: currentPage === "professionals" },
    ];

    return (
        <motion.header
            className="sticky-top border-bottom border-slate-200 bg-white"
            style={{ backdropFilter: "blur(6px)" }}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="container-xl py-3 d-flex align-items-center justify-content-between">
                <motion.a
                    href="/"
                    className="d-flex align-items-center gap-2 text-decoration-none"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <motion.div
                        className="d-grid rounded-2xl text-white"
                        style={{
                            width: 36, height: 36, placeItems: "center",
                            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                        }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Building2 size={18} />
                    </motion.div>
                    <motion.span
                        className="fw-semibold"
                        style={{
                            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '1.25rem'
                        }}
                    >
                        MLS Chat
                    </motion.span>
                </motion.a>

                <nav className="d-none d-md-flex align-items-center gap-4 small">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <motion.a
                                href={item.href}
                                className={`text-decoration-none nav-link-soft ${item.isActive ? 'fw-semibold' : ''}`}
                                style={{
                                    color: item.isActive ? '#5B21B6' : '#6B7280',
                                    borderBottom: item.isActive ? '2px solid #5B21B6' : 'none',
                                    paddingBottom: item.isActive ? '4px' : '0'
                                }}
                                whileHover={{
                                    y: -2,
                                    color: '#5B21B6'
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {item.label}
                            </motion.a>
                        </motion.div>
                    ))}
                </nav>

                {token && <div className="d-flex align-items-center gap-2">
                    <motion.a
                        href="/home"
                        className="d-none d-md-inline-flex btn rounded-3"
                        style={{
                            border: '2px solid #5B21B6',
                            color: '#5B21B6',
                            background: 'transparent'
                        }}
                        whileHover={{
                            scale: 1.05,
                            background: '#5B21B6',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(91, 33, 182, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        ← Back to Feed
                    </motion.a>
                </div>

                }


                {!token && <div className="d-flex align-items-center gap-2">
                    <motion.a
                        href="/login"
                        className="d-none d-md-inline-flex btn rounded-3"
                        style={{
                            border: '2px solid #5B21B6',
                            color: '#5B21B6',
                            background: 'transparent'
                        }}
                        whileHover={{
                            scale: 1.05,
                            background: '#5B21B6',
                            color: 'white',
                            boxShadow: '0 4px 15px rgba(91, 33, 182, 0.3)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Log in
                    </motion.a>
                    <motion.a
                        href="/signup"
                        className="btn rounded-3 d-inline-flex align-items-center gap-2 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                            border: 'none',
                            color: 'white'
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 8px 25px rgba(91, 33, 182, 0.4)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Get Started <ArrowRight size={16} />
                    </motion.a>
                </div>}
            </div>
        </motion.header>
    );
} 