import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/slices/authSlice';
import { apiFetch } from '../../lib/apiClient';
import { Building2, IdCard, Calendar, Phone, MapPin, FileText, Layers, Gauge, Hash, Languages, Save } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function AgentSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const [form, setForm] = useState({
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    license_number: '',
    years_experience: '',
    specializations: '', // comma-separated
    price_range_min: '',
    price_range_max: '',
    listings_sold: '',
    average_days_on_market: '',
    certifications: '',
    languages: '', // comma-separated
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.user_type !== 'agent') return;
    setForm((prev) => ({
      ...prev,
      phone: user.phone || '',
      license_number: user.license_number || '',
      // If agent data was stored in bio as JSON, try to parse
      ...(typeof user.bio === 'string' ? (() => { try { return JSON.parse(user.bio) || {}; } catch { return {}; } })() : (user.bio || {}))
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      // Combine into a single payload for now; backend can map as needed
      const payload = { ...form };
      await apiFetch(`${APP_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      // Update local user with merged data
      dispatch(setUser({ ...user, ...payload, bio: JSON.stringify({
        years_experience: payload.years_experience,
        specializations: payload.specializations?.split(',').map(s => s.trim()).filter(Boolean) || [],
        price_range_min: payload.price_range_min,
        price_range_max: payload.price_range_max,
        average_days_on_market: payload.average_days_on_market,
        certifications: payload.certifications,
      }) }));
      toast.success('Agent profile updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update agent profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={fadeUp} className="card border-0 shadow-soft rounded-3xl overflow-hidden settings-card mt-4">
      <div className="card-header border-0 p-4 settings-card-header">
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center settings-section-icon">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="h5 mb-1 text-purple">Agent Profile</h3>
            <p className="small text-slate-600 mb-0">Manage your professional details shown on your profile</p>
          </div>
        </div>
      </div>

      <div className="card-body p-4 p-lg-5">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Phone size={16} className="text-purple" /> Phone
              </label>
              <input className="form-control form-control-lg form-control-purple" name="phone" value={form.phone} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <IdCard size={16} className="text-purple" /> License Number
              </label>
              <input className="form-control form-control-lg form-control-purple" name="license_number" value={form.license_number} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Calendar size={16} className="text-purple" /> Date of Birth
              </label>
              <input type="date" className="form-control form-control-lg form-control-purple" name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <MapPin size={16} className="text-purple" /> Address
              </label>
              <input className="form-control form-control-lg form-control-purple" name="address" value={form.address} onChange={handleChange} placeholder="Street address" />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-4">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <MapPin size={16} className="text-purple" /> City
              </label>
              <input className="form-control form-control-lg form-control-purple" name="city" value={form.city} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-4">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <MapPin size={16} className="text-purple" /> State
              </label>
              <input className="form-control form-control-lg form-control-purple" name="state" value={form.state} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-4">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Hash size={16} className="text-purple" /> Zip Code
              </label>
              <input className="form-control form-control-lg form-control-purple" name="zip_code" value={form.zip_code} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Gauge size={16} className="text-purple" /> Years Experience
              </label>
              <select className="form-select form-select-lg form-control-purple" name="years_experience" value={form.years_experience} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="0-1">0-1</option>
                <option value="2-5">2-5</option>
                <option value="6-10">6-10</option>
                <option value="11-15">11-15</option>
                <option value="16-20">16-20</option>
                <option value="20+">20+</option>
              </select>
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Layers size={16} className="text-purple" /> Specializations (comma-separated)
              </label>
              <input className="form-control form-control-lg form-control-purple" name="specializations" value={form.specializations} onChange={handleChange} placeholder="e.g., Buyer’s Agent, Listing Agent" />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Gauge size={16} className="text-purple" /> Price Range Min ($)
              </label>
              <input type="number" className="form-control form-control-lg form-control-purple" name="price_range_min" value={form.price_range_min} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Gauge size={16} className="text-purple" /> Price Range Max ($)
              </label>
              <input type="number" className="form-control form-control-lg form-control-purple" name="price_range_max" value={form.price_range_max} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Hash size={16} className="text-purple" /> Listings Sold
              </label>
              <input type="number" className="form-control form-control-lg form-control-purple" name="listings_sold" value={form.listings_sold} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Gauge size={16} className="text-purple" /> Avg. Days on Market
              </label>
              <input type="number" className="form-control form-control-lg form-control-purple" name="average_days_on_market" value={form.average_days_on_market} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <FileText size={16} className="text-purple" /> Certifications
              </label>
              <input className="form-control form-control-lg form-control-purple" name="certifications" value={form.certifications} onChange={handleChange} />
            </motion.div>

            <motion.div variants={fadeUp} className="col-md-6">
              <label className="form-label d-flex align-items-center gap-2 mb-2 text-slate-700 fw-semibold">
                <Languages size={16} className="text-purple" /> Languages (comma-separated)
              </label>
              <input className="form-control form-control-lg form-control-purple" name="languages" value={form.languages} onChange={handleChange} placeholder="e.g., English, Spanish" />
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="d-flex flex-wrap gap-3 mt-5 pt-4 settings-form-section">
            <button type="submit" className="btn btn-lg d-inline-flex align-items-center gap-2 btn-purple" disabled={saving}>
              {saving ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
            <button type="button" className="btn btn-outline-secondary btn-lg btn-outline-purple" onClick={() => navigate(-1)}>Cancel</button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}


