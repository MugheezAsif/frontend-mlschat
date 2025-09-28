import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Building2, MailCheck, RefreshCw } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function VerifyEmail() {
  const { token, user } = useSelector((s) => s.auth);
  const [params] = useSearchParams();
  const emailFromQuery = params.get('email');
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    setLoading(true);
    try {
      let res, data;
      if (token) {
        res = await fetch(`${APP_BASE_URL}/api/email/verification-notification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        data = await res.json();
      } else {
        const email = emailFromQuery || user?.email;
        res = await fetch(`${APP_BASE_URL}/api/email/resend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        data = await res.json();
      }
      if (res.ok && data?.status === 'success') {
        toast.success('Verification email sent.');
      } else {
        toast.error(data?.message || 'Failed to send verification email');
      }
    } catch (e) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 w-100 bg-white text-slate-900">
      <header className="border-bottom border-slate-200 bg-white">
        <div className="container-xl py-3 d-flex align-items-center justify-content-between">
          <a href="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="d-grid rounded-2xl text-white" style={{ width: 36, height: 36, placeItems: 'center', backgroundImage: 'linear-gradient(135deg,#5B21B6,#7C3AED)' }}>
              <Building2 size={18} />
            </div>
            <span className="fw-semibold" style={{ color: '#5B21B6' }}>MLS Chat</span>
          </a>
          <span className="text-decoration-none nav-link-soft small">{user?.email}</span>
        </div>
      </header>

      <div className="container-xl py-5">
        <div className="row justify-content-center align-items-center min-vh-75">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="text-center mb-5">
              <div className="d-inline-flex align-items-center gap-2 mb-3">
                <div className="d-grid rounded-2xl text-white" style={{ width: 48, height: 48, placeItems: 'center', backgroundImage: 'linear-gradient(135deg,#5B21B6,#7C3AED)' }}>
                  <MailCheck size={24} />
                </div>
              </div>
              <h1 className="fw-semibold" style={{ fontSize: 'clamp(2rem,4vw,2.5rem)' }}>Verify your email</h1>
              <p className="lead text-slate-700 mt-2">We sent a verification link to your email address. Click it to continue.</p>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="card-soft rounded-3xl p-4 p-md-5 shadow-lg text-center">
              <p className="mb-4 text-slate-700">Didn’t receive the email?</p>
              <button
                className="btn-modern d-inline-flex align-items-center justify-content-center gap-2 py-3 px-4"
                style={{ background: 'linear-gradient(135deg,#5B21B6,#7C3AED)', border: 'none', color: 'white', borderRadius: '12px', fontWeight: '500' }}
                onClick={resend}
                disabled={loading}
              >
                <RefreshCw size={18} /> {loading ? 'Sending…' : 'Resend verification email'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="border-top border-slate-200 mt-auto">
        <div className="container-xl py-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="d-grid rounded-2xl text-white" style={{ width: 32, height: 32, placeItems: 'center', backgroundImage: 'linear-gradient(135deg,#5B21B6,#7C3AED)' }}>
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


