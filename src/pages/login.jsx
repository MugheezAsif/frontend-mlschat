import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Building2, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import '../home.css';
import { toast } from 'react-toastify';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const Login = () => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/home" replace />;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fpOpen, setFpOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, setError, setIsLoading);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!fpEmail) {
      toast.error('Please enter your email');
      return;
    }
    setFpLoading(true);
    try {
      const res = await fetch(`${APP_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fpEmail })
      });
      const data = await res.json();
      if (res.ok && data?.status === 'success') {
        toast.success('Password reset link sent. Check your email.');
        setFpOpen(false);
      } else {
        toast.error(data?.message || 'Unable to send reset link');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setFpLoading(false);
    }
  };

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
        <div className="row justify-content-center align-items-center min-vh-75">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeUp}
              className="text-center "
            >
              <div className="d-inline-flex align-items-center gap-2 mb-3">
                <div
                  className="d-grid rounded-2xl text-white"
                  style={{
                    width: 48, height: 48, placeItems: "center",
                    backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)",
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
              </div>
              <h1 className="fw-semibold" style={{ fontSize: "clamp(2rem,4vw,2.5rem)" }}>
                Welcome Back
              </h1>
              <p className="lead text-slate-700 mt-2">
                Sign in to your MLSChat account and continue building your network
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeUp}
              className="card-soft rounded-3xl p-4 p-md-5 shadow-lg"
            >
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
                <div className="mb-4">
                  <label className="form-label fw-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-3 border-slate-200"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ 
                      backgroundColor: '#f8fafc',
                      borderColor: '#e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-medium text-slate-700 mb-2">Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg rounded-3 border-slate-200"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ 
                        backgroundColor: '#f8fafc',
                        borderColor: '#e2e8f0',
                        fontSize: '1rem',
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

                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label text-slate-600 small" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  <button type="button" onClick={() => setFpOpen(true)} className="btn btn-link p-0 text-decoration-none fw-medium" style={{ color: '#5B21B6' }}>
                    Forgot password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="btn-modern w-100 d-inline-flex align-items-center justify-content-center gap-2 py-3"
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-slate-600 mb-0">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-decoration-none fw-medium" style={{ color: '#5B21B6' }}>
                    Create one now
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial="hidden" 
              whileInView="show" 
              viewport={{ once: true, amount: 0.3 }} 
              variants={fadeUp}
              className="text-center mt-4"
            >
              <div className="d-flex align-items-center justify-content-center gap-3 text-slate-500 small">
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  Secure login
                </div>
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  Free forever
                </div>
                <div className="d-flex align-items-center gap-1">
                  <ShieldCheck size={16} className="text-success" />
                  No spam
                </div>
              </div>
              <p className="text-slate-500 small mt-2 mb-0">
                By continuing, you agree to MLSChat's{' '}
                <a href="/terms" className="text-decoration-none" style={{ color: '#5B21B6' }}>Terms of Service</a> and{' '}
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
              <a href="/terms" className="text-decoration-none nav-link-soft">Terms</a>
              <a href="#" className="text-decoration-none nav-link-soft">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {fpOpen && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset password</h5>
                <button type="button" className="btn-close" onClick={() => setFpOpen(false)}></button>
              </div>
              <form onSubmit={handleForgotPassword}>
                <div className="modal-body">
                  <p className="text-slate-600 mb-3">Enter your account email and we will send you a reset link.</p>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={fpEmail} onChange={(e) => setFpEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setFpOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={fpLoading}>{fpLoading ? 'Sending…' : 'Send reset link'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
