import React from "react";
import { motion } from "framer-motion";
import '../../home.css';
import './frontend.css';
import Navbar from '../../components/frontend/Navbar';
import Footer from '../../components/frontend/Footer';
import { 
    FileText, 
    Shield, 
    Users, 
    AlertTriangle, 
    CheckCircle,
    ArrowRight,
    Scale,
    Eye,
    Lock,
    Globe,
    Mail,
    Phone
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

const SectionCard = ({ icon: Icon, title, children, className = "" }) => (
    <motion.div 
        variants={fadeUp} 
        className={`card-soft rounded-2xl p-4 p-md-5 mb-4 ${className}`}
        whileHover={{ 
            scale: 1.01,
            y: -2,
            boxShadow: "0 20px 40px rgba(91, 33, 182, 0.1)"
        }}
    >
        <div className="d-flex align-items-center gap-3 mb-3">
            <motion.div 
                className="icon-chip d-inline-flex icon-chip-purple"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
            >
                <Icon size={24} />
            </motion.div>
            <h3 className="h4 gradient-text mb-0">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const HighlightBox = ({ children, type = "info" }) => {
    const colors = {
        info: "bg-primary bg-opacity-10 border-primary",
        warning: "bg-warning bg-opacity-10 border-warning",
        success: "bg-success bg-opacity-10 border-success"
    };
    
    return (
        <div className={`p-4 rounded-2xl border border-2 ${colors[type]} mb-4`}>
            {children}
        </div>
    );
};

export default function TermsAndConditions() {
    return (
        <div className="min-vh-100 w-100 bg-white text-slate-900">
            <Navbar currentPage="terms" />

            {/* Hero Section */}
            <section className="hero-bg">
                <div className="container-xl py-5">
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
                            <div className="d-inline-flex align-items-center gap-2 badge-soft rounded-pill px-4 py-2 mb-3">
                                <FileText size={16} />
                                <span className="fw-semibold">Legal Information</span>
                            </div>
                        </motion.div>

                        <motion.h1 
                            variants={fadeUp} 
                            className="fw-bold gradient-text mb-3" 
                            style={{ fontSize: "clamp(2rem,4vw,3.5rem)" }}
                        >
                            Bread List Technologies Privacy Policy
                        </motion.h1>

                        <motion.p 
                            variants={fadeUp} 
                            className="lead text-slate-600 mb-4" 
                            style={{ maxWidth: 800, margin: "0 auto" }}
                        >
                            This Privacy Policy describes how Bread List Technologies, LLC collects, uses, and protects 
                            information when you use our software platform including our CRM system with modules for 
                            contacts, deals, e-signature, and MLSChat.
                        </motion.p>

                        <motion.div 
                            variants={fadeUp} 
                            className="d-flex flex-wrap justify-content-center gap-3"
                        >
                            <div className="d-flex align-items-center gap-2 text-slate-600">
                                <CheckCircle size={16} className="text-success" />
                                <span className="small">Effective Date: [Insert Date]</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 text-slate-600">
                                <Scale size={16} className="text-primary" />
                                <span className="small">Last Updated: [Insert Date]</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-5">
                <div className="container-xl">
                    <motion.div 
                        initial="hidden" 
                        whileInView="show" 
                        viewport={{ once: true, amount: 0.1 }} 
                        variants={stagger}
                    >
                        {/* Introduction */}
                        <SectionCard icon={FileText} title="Privacy Policy">
                            <p className="text-slate-600 mb-3">
                                This Privacy Policy describes how Bread List Technologies, LLC ("Bread List," "we," "our," or "us") 
                                collects, uses, and protects information when you use our software platform (the "Service"). The Service 
                                includes our CRM system with modules for contacts, deals, e-signature, and MLSChat.
                            </p>
                            <p className="text-slate-600 mb-0">
                                Bread List Technologies, LLC is a Wyoming limited liability company, primarily operating in Florida, 
                                with business activity in other U.S. states.
                            </p>
                        </SectionCard>

                        {/* Information We Collect */}
                        <SectionCard icon={Users} title="1. Information We Collect">
                            <p className="text-slate-600 mb-3">
                                We collect and process the following types of information:
                            </p>
                            <ul className="text-slate-600 mb-0">
                                <li className="mb-2"><strong>Account Information:</strong> Name, email, billing information, and login credentials.</li>
                                <li className="mb-2"><strong>User Content:</strong> Contacts, deals, documents, e-sign records, and messages you upload or create in the system.</li>
                                <li className="mb-2"><strong>Usage Data:</strong> Device information, log data, IP addresses, and activity within the Service.</li>
                                <li className="mb-0"><strong>Support Communications:</strong> Information you provide when contacting us for help.</li>
                            </ul>
                        </SectionCard>

                        {/* Individual vs Office Accounts */}
                        <SectionCard icon={Shield} title="2. Individual vs. Office Accounts">
                            <div className="mb-4">
                                <h5 className="fw-semibold text-slate-900 mb-3">Individual Accounts</h5>
                                <ul className="text-slate-600 mb-4">
                                    <li className="mb-2">Data (contacts, deals, documents, chats) is private to the individual account holder.</li>
                                    <li className="mb-0">Bread List does not share this information with others unless required by law or with your consent.</li>
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h5 className="fw-semibold text-slate-900 mb-3">Office Accounts</h5>
                                <p className="text-slate-600 mb-3">
                                    Accounts paid for by a company ("Company Owner") may grant the owner certain visibility.
                                </p>
                                <div className="p-3 rounded-2xl bg-slate-50">
                                    <h6 className="fw-semibold text-slate-900 mb-2">Company Owner Access:</h6>
                                    <ul className="text-slate-600 mb-2">
                                        <li className="mb-1">Owners can view deals created under their company account.</li>
                                        <li className="mb-1">Owners cannot view contacts, chats, or documents unless a document is directly attached to a deal.</li>
                                        <li className="mb-0">All other data (contacts, standalone documents, chats) remains private to the individual user.</li>
                                    </ul>
                                </div>
                            </div>
                        </SectionCard>

                        {/* How We Use Information */}
                        <SectionCard icon={Eye} title="3. How We Use Information">
                            <p className="text-slate-600 mb-3">
                                We use information to:
                            </p>
                            <ul className="text-slate-600 mb-0">
                                <li className="mb-2">Provide, maintain, and improve the Service.</li>
                                <li className="mb-2">Facilitate deal and document sharing within company accounts according to account permissions.</li>
                                <li className="mb-2">Respond to support requests.</li>
                                <li className="mb-2">Detect, prevent, and address technical issues, fraud, or misuse.</li>
                                <li className="mb-0">Comply with legal obligations.</li>
                            </ul>
                        </SectionCard>

                        {/* Bread List Access to User Data */}
                        <SectionCard icon={Lock} title="4. Bread List Access to User Data">
                            <p className="text-slate-600 mb-3">
                                Bread List Technologies, LLC staff may access your account data only as necessary for:
                            </p>
                            <ul className="text-slate-600 mb-3">
                                <li className="mb-2">Troubleshooting technical issues.</li>
                                <li className="mb-2">Assisting with account support at your request.</li>
                                <li className="mb-0">Ensuring system security and integrity.</li>
                            </ul>
                            <p className="text-slate-600 mb-0">
                                We do not access, share, or use your information for any other purpose.
                            </p>
                        </SectionCard>

                        {/* Sharing of Information */}
                        <SectionCard icon={Globe} title="5. Sharing of Information">
                            <p className="text-slate-600 mb-3">
                                We do not sell or rent your personal information. We only share data in the following circumstances:
                            </p>
                            <ul className="text-slate-600 mb-0">
                                <li className="mb-2"><strong>With Your Consent:</strong> When you explicitly authorize sharing.</li>
                                <li className="mb-2"><strong>With Service Providers:</strong> Third-party vendors who help operate the Service (e.g., payment processors, hosting providers).</li>
                                <li className="mb-2"><strong>For Legal Reasons:</strong> When required by law, regulation, or valid legal process.</li>
                                <li className="mb-0"><strong>Business Transfers:</strong> If Bread List is involved in a merger, acquisition, or sale of assets, information may be transferred.</li>
                            </ul>
                        </SectionCard>

                        {/* Data Security */}
                        <SectionCard icon={AlertTriangle} title="6. Data Security">
                            <p className="text-slate-600 mb-0">
                                We implement technical and organizational measures to protect your information, including encryption, 
                                secure data storage, and restricted access protocols. However, no system is completely secure, and 
                                we cannot guarantee absolute security.
                            </p>
                        </SectionCard>

                        {/* Data Retention */}
                        <SectionCard icon={CheckCircle} title="7. Data Retention">
                            <p className="text-slate-600 mb-0">
                                We retain your information as long as your account is active or as needed to provide the Service. 
                                We may also retain and use information as required to comply with legal obligations, resolve disputes, 
                                and enforce agreements.
                            </p>
                        </SectionCard>

                        {/* Your Rights */}
                        <SectionCard icon={Scale} title="8. Your Rights">
                            <p className="text-slate-600 mb-3">
                                Depending on your location, you may have rights under privacy laws such as GDPR or CCPA, including:
                            </p>
                            <ul className="text-slate-600 mb-0">
                                <li className="mb-2">The right to access, update, or delete your personal information.</li>
                                <li className="mb-2">The right to restrict or object to certain processing.</li>
                                <li className="mb-2">The right to data portability.</li>
                                <li className="mb-0">The right to lodge a complaint with a supervisory authority.</li>
                            </ul>
                        </SectionCard>

                        {/* Location of Business */}
                        <motion.div 
                            variants={fadeUp} 
                            className="card-soft rounded-2xl p-4 p-md-5 mb-3"
                        >
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="icon-chip d-inline-flex icon-chip-purple">
                                    <Mail size={24} />
                                </div>
                                <h3 className="h4 gradient-text mb-0">9. Location of Business</h3>
                            </div>
                            <p className="text-slate-600 mb-0">
                                Bread List Technologies, LLC is organized in Wyoming but operates primarily in Florida and other U.S. states. 
                                Your data may be processed and stored in the United States.
                            </p>
                        </motion.div>

                        {/* Changes to This Policy */}
                        <motion.div 
                            variants={fadeUp} 
                            className="card-soft rounded-2xl p-4 p-md-5 mb-4"
                        >
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="icon-chip d-inline-flex icon-chip-purple">
                                    <Phone size={24} />
                                </div>
                                <h3 className="h4 gradient-text mb-0">10. Changes to This Policy</h3>
                            </div>
                            <p className="text-slate-600 mb-0">
                                We may update this Privacy Policy from time to time. Updates will be posted with a new "Last Updated" date. 
                                Significant changes will be communicated to users via email or in-app notice.
                            </p>
                        </motion.div>

                        {/* Contact Us */}
                        <SectionCard icon={Globe} title="11. Contact Us">
                            <p className="text-slate-600 mb-4">
                                If you have any questions or concerns about this Privacy Policy or your data, please contact us:
                            </p>
                            
                            <div className="p-3 rounded-2xl bg-slate-50">
                                <h6 className="fw-semibold text-slate-900 mb-2">Bread List Technologies, LLC</h6>
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <Mail size={16} className="text-purple" />
                                    <span className="text-slate-600">Email: info@breadlist.com</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <Phone size={16} className="text-purple" />
                                    <span className="text-slate-600">Address: [Insert Business Address]</span>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Updates and Changes */}
                        <motion.div 
                            variants={fadeUp}
                            className="card-soft rounded-2xl p-4 p-md-5 text-center"
                            style={{ background: "linear-gradient(135deg, rgba(91, 33, 182, 0.05), rgba(124, 58, 237, 0.05))" }}
                        >
                            <h3 className="h4 gradient-text mb-3">Privacy Policy Updates</h3>
                            <p className="text-slate-600 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                                Privacy Policy on this page and updating the "Last Updated" date.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center gap-3">
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
                                    Create Account <ArrowRight size={16} />
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
                                    Sign In
                                </motion.a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer showTagline={true} tagline="MLSChat — Where Real Estate Pros Network, Market, and Win." />
        </div>
    );
}
