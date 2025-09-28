import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { apiFetch } from '../lib/apiClient';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  IdCard,
  FileText,
  Save,
} from 'lucide-react';
import '../pages/Frontend/frontend.css';
import AgentSettings from '../components/settings/AgentSettings';

const UserSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    bio: '',
    brokerage_name: '',
    license_number: '',
    phone: '',
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || parseInt(id) !== user.id) {
      toast.error('Unauthorized access');
      navigate('/home');
    } else {
      setForm({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        bio: user.bio || '',
        brokerage_name: user.brokerage_name || '',
        license_number: user.license_number || '',
        phone: user.phone || '',
      });
    }
  }, [user, id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });

      dispatch(setUser(form));
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger = {
    show: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-vh-100 bg-gradient-to-br from-slate-50 to-purple-50 py-5">
      <div className="container-xl">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-width mx-auto"
        >
          {/* Main Form Card (General user settings) */}
          <motion.div
            variants={fadeUp}
            className="card border-0 shadow-soft rounded-3xl overflow-hidden settings-card"
          >
            <div className="card-header border-0 p-4 settings-card-header">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center settings-section-icon">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="h5 mb-1 text-purple">Profile Information</h3>
                  <p className="small text-slate-600 mb-0">Update your personal and professional details</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-lg-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Personal Information Section */}
                  <motion.div variants={fadeUp} className="col-12">
                    <h4 className="h6 mb-3 d-flex align-items-center gap-2 text-purple">
                      <User size={18} />
                      Personal Information
                    </h4>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <User size={16} className="text-purple" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-purple"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <Mail size={16} className="text-purple" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg form-control-purple"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled
                        style={{ background: '#f8fafc', color: '#6B7280' }}
                      />
                      <small className="text-slate-500 mt-1 d-block">Email cannot be changed</small>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <Phone size={16} className="text-purple" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg form-control-purple"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <MapPin size={16} className="text-purple" />
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-purple"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="City, State"
                      />
                    </div>
                  </motion.div>

                  {/* Professional Information Section */}
                  <motion.div variants={fadeUp} className="col-12 mt-4">
                    <h4 className="h6 mb-3 d-flex align-items-center gap-2 text-purple">
                      <Building2 size={18} />
                      Professional Information
                    </h4>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <Building2 size={16} className="text-purple" />
                        Brokerage Name
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-purple"
                        name="brokerage_name"
                        value={form.brokerage_name}
                        onChange={handleChange}
                        placeholder="Your brokerage or company"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-md-6">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <IdCard size={16} className="text-purple" />
                        License Number
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg form-control-purple"
                        name="license_number"
                        value={form.license_number}
                        onChange={handleChange}
                        placeholder="Your real estate license number"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="col-12">
                    <div className="form-group">
                      <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                        <FileText size={16} className="text-purple" />
                        Bio
                      </label>
                      <textarea
                        className="form-control form-control-lg form-control-purple"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself, your experience, and what makes you unique as a real estate professional..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div variants={fadeUp} className="d-flex flex-wrap gap-3 mt-5 pt-4 settings-form-section">
                  <motion.button
                    type="submit"
                    className="btn btn-lg d-inline-flex align-items-center gap-2 btn-purple"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 8px 25px rgba(91, 33, 182, 0.4)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary btn-lg btn-outline-purple"
                    whileHover={{
                      background: '#5B21B6',
                      color: 'white',
                      scale: 1.05
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Agent Settings Card (only for agents) */}
          {user?.user_type === 'agent' && (
            <AgentSettings />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserSettings;