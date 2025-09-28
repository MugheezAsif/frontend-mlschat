import React, { useState } from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Eye, EyeOff } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !email) {
      toast.error('Invalid or missing token/email.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${APP_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password, password_confirmation: passwordConfirmation }),
      });
      const data = await res.json();
      if (res.ok && data?.status === 'success') {
        toast.success('Password updated. You can log in now.');
        navigate('/login');
      } else {
        toast.error(data?.message || 'Reset failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // If token or email is missing, redirect to login
  if (!token || !email) return <Navigate to="/login" replace />;

  return (
    <div className="min-vh-100 w-100 bg-white text-slate-900">
      {/* Header */}
      <header className="border-bottom border-slate-200 bg-white">
        <div className="container-xl py-3 d-flex align-items-center justify-content-between">
          <a href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div
              className="d-grid rounded-2xl text-white"
              style={{ width: 36, height: 36, placeItems: "center", backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
            >
              <Building2 size={18} />
            </div>
            <span className="fw-semibold" style={{ color: '#5B21B6' }}>MLS Chat</span>
          </a>
          <a href="/login" className="text-decoration-none nav-link-soft small">
            ← Back to Sign in
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
              className="text-center mb-5"
            >
              <div className="d-inline-flex align-items-center gap-2 mb-3">
                <div
                  className="d-grid rounded-2xl text-white"
                  style={{ width: 48, height: 48, placeItems: "center", backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
                >
                  <ShieldCheck size={24} />
                </div>
              </div>
              <h1 className="fw-semibold" style={{ fontSize: "clamp(2rem,4vw,2.5rem)" }}>
                Reset your password
              </h1>
              <p className="lead text-slate-700 mt-2">
                Choose a new password for your MLSChat account
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="card-soft rounded-3xl p-4 p-md-5 shadow-lg"
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-medium text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-3 border-slate-200"
                    value={email || ''}
                    disabled
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', fontSize: '1rem' }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium text-slate-700 mb-2">New Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-lg rounded-3 border-slate-200"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', fontSize: '1rem', paddingRight: '3rem' }}
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

                <div className="mb-4">
                  <label className="form-label fw-medium text-slate-700 mb-2">Confirm Password</label>
                  <div className="position-relative">
                    <input
                      type={showPassword2 ? 'text' : 'password'}
                      className="form-control form-control-lg rounded-3 border-slate-200"
                      placeholder="Confirm new password"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      required
                      style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', fontSize: '1rem', paddingRight: '3rem' }}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center text-slate-500"
                      onClick={() => setShowPassword2(!showPassword2)}
                      style={{ zIndex: 10 }}
                    >
                      {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-modern w-100 d-inline-flex align-items-center justify-content-center gap-2 py-3"
                  style={{ background: "linear-gradient(135deg,#5B21B6,#7C3AED)", border: "none", color: "white", borderRadius: "12px", fontWeight: "500" }}
                  disabled={loading}
                >
                  {loading ? 'Saving…' : 'Save Password'}
                </button>
              </form>
            </motion.div>

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
                  Secure reset
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
                style={{ width: 32, height: 32, placeItems: "center", backgroundImage: "linear-gradient(135deg,#5B21B6,#7C3AED)" }}
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
}


