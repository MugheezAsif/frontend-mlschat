import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from "framer-motion";
import { Building2, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle, Users, Sparkles } from "lucide-react";
import '../home.css';

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

const BenefitItem = ({ icon: Icon, text }) => (
  <motion.div variants={fadeUp} className="d-flex align-items-center gap-2 text-slate-600 small">
    <CheckCircle size={16} className="text-success" />
    {text}
  </motion.div>
);

const Signup = () => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/home" replace />;
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    dob_year: '',
    dob_month: '',
    dob_day: '',
    gender: '',
    
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const getDaysInMonth = (year, month) => {
    const y = Number(year);
    const m = Number(month);
    if (!y || !m) return null;
    return new Date(y, m, 0).getDate(); // month is 1-based; day 0 gives last day of previous month
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };

    // Compose DOB and validate day against month/year
    const nextDobYear = name === 'dob_year' ? value : formData.dob_year;
    const nextDobMonth = name === 'dob_month' ? value : formData.dob_month;
    let nextDobDay = name === 'dob_day' ? value : formData.dob_day;

    const maxDays = getDaysInMonth(nextDobYear, nextDobMonth);
    if (maxDays && nextDobDay && Number(nextDobDay) > maxDays) {
      nextDobDay = '';
      next.dob_day = '';
    }

    if (nextDobYear && nextDobMonth && nextDobDay) {
      const mm = String(nextDobMonth).padStart(2, '0');
      const dd = String(nextDobDay).padStart(2, '0');
      next.date_of_birth = `${nextDobYear}-${mm}-${dd}`;
    } else {
      next.date_of_birth = '';
    }

    setFormData(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    const signupData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      password: formData.password
    };
    
    signup(signupData, setIsLoading);
  };

  // Build select options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const maxDaysForSelection = getDaysInMonth(formData.dob_year, formData.dob_month) || 31;
  const days = Array.from({ length: maxDaysForSelection }, (_, i) => String(i + 1));

  return (
    <div className="min-vh-100 w-100 bg-white text-slate-900">
      {/* Header */}
      <header className="border-bottom border-slate-200 bg-white">
        <div className="container-xl py-3 d-flex align-items-center justify-content-between">
          <a href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-grid rounded-2xl text-white"
              style={{
                width: 36, height: 36, placeItems: "center",
                backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)",
              }}
            >
              <Building2 size={18} />
            </div>
            <span className="fw-semibold" style={{ color: '#5B21B6' }}>MLS Chat</span>
          </a>
          <a href="/" className="text-decoration-none nav-link-soft small">
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-xl py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="text-center mb-5"
            >
              <div className="d-inline-flex align-items-center gap-2 mb-3">
                <div
                  className="d-grid rounded-2xl text-white"
                  style={{
                    width: 48, height: 48, placeItems: "center",
                    backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)",
                  }}
                >
                  <Users size={24} />
                </div>
              </div>
              <h1 className="fw-semibold" style={{ fontSize: "clamp(2rem,4vw,2.5rem)" }}>
                Join MLSChat Today
              </h1>
              <p className="lead text-slate-700 mt-2">
                Create your free account and start building your real estate network
              </p>
            </motion.div>

            <div className="row g-5">
              {/* Signup Form */}
              <div className="col-lg-7">
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  className="card-soft rounded-3xl p-4 p-md-5 shadow-lg h-100"
                >
                  <h3 className="h4 text-slate-900 mb-4">Create Your Account</h3>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="alert alert-danger border-0 bg-danger-subtle text-danger rounded-3 mb-4"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-slate-700 mb-2">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          className="form-control rounded-3 border-slate-200"
                          placeholder="First name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-medium text-slate-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          className="form-control rounded-3 border-slate-200"
                          placeholder="Last name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="form-label fw-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                      />
                    </div>

                    <div className="row g-3 mt-3">
                      <div className="col-12">
                        <label className="form-label fw-medium text-slate-700 mb-2">Date of Birth</label>
                        <div className="d-flex gap-2">
                          <select
                            name="dob_day"
                            className="form-select rounded-3 border-slate-200"
                            value={formData.dob_day}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', minWidth: '70px' }}
                          >
                            <option value="">Day</option>
                            {days.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <select
                            name="dob_month"
                            className="form-select rounded-3 border-slate-200"
                            value={formData.dob_month}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', minWidth: '84px' }}
                          >
                            <option value="">Month</option>
                            {months.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                          <select
                            name="dob_year"
                            className="form-select rounded-3 border-slate-200"
                            value={formData.dob_year}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', minWidth: '96px' }}
                          >
                            <option value="">Year</option>
                            {years.map(y => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="form-label fw-medium text-slate-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        className="form-select rounded-3 border-slate-200"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    

                    <div className="mt-3">
                      <label className="form-label fw-medium text-slate-700 mb-2">Password</label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="form-control rounded-3 border-slate-200"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          style={{
                            backgroundColor: '#f8fafc',
                            borderColor: '#e2e8f0',
                            paddingRight: '3rem'
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center text-slate-500"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ zIndex: 10 }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="form-label fw-medium text-slate-700 mb-2">Confirm Password</label>
                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirm_password"
                          className="form-control rounded-3 border-slate-200"
                          placeholder="Confirm your password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          required
                          style={{
                            backgroundColor: '#f8fafc',
                            borderColor: '#e2e8f0',
                            paddingRight: '3rem'
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center text-slate-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ zIndex: 10 }}
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-modern w-100 d-inline-flex align-items-center justify-content-center gap-2 py-3 mt-4"
                      disabled={isLoading}
                      style={{
                        background: isLoading ? "#94a3b8" : "linear-gradient(135deg,#5B21B6,#7C3AED)",
                        border: "none",
                        color: "white",
                        borderRadius: "12px",
                        fontWeight: "500",
                        opacity: isLoading ? 0.7 : 1,
                        cursor: isLoading ? "not-allowed" : "pointer"
                      }}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Your Account <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-slate-600 mb-0">
                      Already have an account?{' '}
                      <a href="/login" className="text-decoration-none fw-medium" style={{ color: '#5B21B6' }}>
                        Sign in here
                      </a>
                    </p>
                    <div className="mt-3 pt-3 border-top border-slate-200">
                      <p className="text-slate-600 mb-2 small">Are you a real estate agent?</p>
                      <a href="/agent-signup" className="text-decoration-none fw-medium" style={{ color: '#5B21B6' }}>
                        Create your agent profile →
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Benefits Sidebar */}
              <div className="col-lg-5">
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={stagger}
                  className="h-100"
                >
                  <div className="card-soft rounded-3xl p-4 p-md-5 bg-grad-soft h-100">
                    <div className="text-center mb-4">
                      <div className="d-inline-flex align-items-center gap-2 mb-3">
                        <div
                          className="d-grid rounded-2xl text-white"
                          style={{
                            width: 48, height: 48, placeItems: "center",
                            backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)",
                          }}
                        >
                          <Sparkles size={24} />
                        </div>
                      </div>
                      <h3 className="h4 text-slate-900">Why Join MLSChat?</h3>
                      <p className="text-slate-700">Everything you need to succeed in real estate</p>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <BenefitItem text="Connect with 12,500+ real estate professionals" />
                      <BenefitItem text="Share listings and generate organic leads" />
                      <BenefitItem text="Build your personal brand and online presence" />
                      <BenefitItem text="Access AI-powered marketing tools and scripts" />
                      <BenefitItem text="Track referrals and manage your network" />
                      <BenefitItem text="Free forever - no hidden fees or subscriptions" />
                    </div>

                    <div className="mt-4 p-3 bg-white rounded-3 border border-slate-200">
                      <div className="d-flex align-items-center gap-2 text-slate-700 small">
                        <ShieldCheck size={18} />
                        <span>Your information is secure and will never be shared with third parties</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="text-center mt-5"
            >
              <div className="d-flex align-items-center justify-content-center gap-4 text-slate-500 small">
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  Secure signup
                </div>
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  Free forever
                </div>
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  No credit card required
                </div>
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  Instant access
                </div>
              </div>
              <p className="text-slate-500 small mt-3 mb-0">
                By creating an account, you agree to MLSChat's{' '}
                <a href="#" className="text-decoration-none" style={{ color: '#5B21B6' }}>Terms of Service</a> and{' '}
                <a href="#" className="text-decoration-none" style={{ color: '#5B21B6' }}>Privacy Policy</a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-top border-slate-200 mt-auto">
        <div className="container-xl py-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-grid rounded-2xl text-white"
                style={{
                  width: 32, height: 32, placeItems: "center",
                  backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)",
                }}
              >
                <Building2 size={16} />
              </div>
              <span className="small" style={{ color: '#5B21B6' }}>© {new Date().getFullYear()} MLS Chat</span>
            </div>
            <div className="d-flex align-items-center gap-3 small text-slate-600">
              <a href="#" className="text-decoration-none nav-link-soft">Privacy</a>
              <a href="#" className="text-decoration-none nav-link-soft">Terms</a>
              <a href="#" className="text-decoration-none nav-link-soft">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
