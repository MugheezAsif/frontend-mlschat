import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

const TestimonialModal = ({ isOpen, onClose, onSubmit, professionalName, submitting }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    testimonial: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ full_name: '', email: '', testimonial: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-0" style={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <div className="modal-header border-0 pb-0" style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', borderRadius: '24px 24px 0 0' }}>
            <div className="d-flex align-items-center gap-3 w-100">
              <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                <Star size={24} className="text-white" />
              </div>
              <div className="flex-grow-1">
                <h5 className="modal-title text-white mb-0 fw-semibold">Share Your Experience</h5>
                <p className="text-white-50 mb-0 small">Write a testimonial for {professionalName}</p>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={handleClose}
                style={{ filter: 'invert(1)' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4" style={{ backgroundColor: '#f8fafc' }}>
              <div className="row g-4">
                {/* Full Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    className="form-control border-0"
                    style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    className="form-control border-0"
                    style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Testimonial */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-slate-700 mb-2">Your Testimonial *</label>
                  <textarea
                    className="form-control border-0"
                    style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                    rows="6"
                    value={formData.testimonial}
                    onChange={(e) => setFormData({...formData, testimonial: e.target.value})}
                    placeholder="Share your experience working with this professional. What made them stand out? How did they help you achieve your real estate goals?"
                    maxLength="2000"
                    required
                  />
                  <div className="small text-slate-500 mt-2 text-end">
                    {formData.testimonial.length}/2000 characters
                  </div>
                </div>

                {/* Info Box */}
                <div className="col-12">
                  <div className="p-3 bg-blue-50 rounded-3 border border-blue-200">
                    <div className="d-flex align-items-start gap-2">
                      <div className="text-blue-600 mt-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <div className="small text-blue-800">
                        <strong>Note:</strong> Your testimonial will be reviewed before being published. We appreciate your feedback and will make sure it meets our community guidelines.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0" style={{ backgroundColor: '#f8fafc', borderRadius: '0 0 24px 24px' }}>
              <div className="d-flex gap-3 w-100">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary flex-fill py-3"
                  style={{ borderRadius: '12px', fontWeight: '500' }}
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn flex-fill py-3"
                  style={{ 
                    background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', 
                    border: 'none', 
                    color: 'white', 
                    borderRadius: '12px', 
                    fontWeight: '500',
                    opacity: submitting ? 0.8 : 1
                  }}
                  disabled={submitting || !formData.full_name || !formData.email || !formData.testimonial}
                >
                  {submitting ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <Star size={16} />
                      Submit Testimonial
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;
