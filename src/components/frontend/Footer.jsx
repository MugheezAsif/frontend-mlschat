import React from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export default function Footer({ showTagline = false, tagline = "" }) {
    return (
        <motion.footer 
            className="border-top border-slate-200"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="container-xl py-4">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                    <motion.div 
                        className="d-flex align-items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.div
                            className="d-grid rounded-2xl text-white"
                            style={{
                                width: 32, height: 32, placeItems: "center",
                                background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                            }}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Building2 size={16} />
                        </motion.div>
                        <motion.span 
                            className="small"
                            style={{
                                background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: '600'
                            }}
                        >
                            © {new Date().getFullYear()} MLS Chat
                        </motion.span>
                    </motion.div>
                    <div className="d-flex align-items-center gap-3 small text-slate-600">
                        <motion.a 
                            href="#" 
                            className="text-decoration-none nav-link-soft"
                            style={{ color: '#6B7280' }}
                            whileHover={{ 
                                color: '#5B21B6',
                                scale: 1.05,
                                y: -2
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Privacy
                        </motion.a>
                        <motion.a 
                            href="/terms" 
                            className="text-decoration-none nav-link-soft"
                            style={{ color: '#6B7280' }}
                            whileHover={{ 
                                color: '#5B21B6',
                                scale: 1.05,
                                y: -2
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Terms
                        </motion.a>
                        <motion.a 
                            href="#" 
                            className="text-decoration-none nav-link-soft"
                            style={{ color: '#6B7280' }}
                            whileHover={{ 
                                color: '#5B21B6',
                                scale: 1.05,
                                y: -2
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Support
                        </motion.a>
                    </div>
                </div>
                {showTagline && (
                    <motion.div 
                        className="text-center mt-3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="small mb-0" style={{ color: '#6B7280' }}>
                            <strong style={{
                                background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {tagline}
                            </strong>
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.footer>
    );
} 