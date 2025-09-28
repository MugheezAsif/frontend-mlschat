import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavbarTop from '../components/NavbarTop';
import FrontendNavbar from '../components/frontend/Navbar';
import { apiFetch } from '../lib/apiClient';
import { Building2, Users, MapPin, Award, Star, MessageSquare, Plus, Quote } from 'lucide-react';
import './professionals.css';
import { toast } from 'react-toastify';
import TestimonialModal from '../components/modal/TestimonialModal';

const ProfessionalShow = () => {
  const { id } = useParams();
  const user = useSelector(state => state.auth.user);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [contact, setContact] = useState({ need: '', zip: '', name: '', email: '', phone: '' });
  const [reviews, setReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [testimonials, setTestimonials] = useState(null);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    year_worked: '',
    role: '',
    overall_rating: 5,
    responsiveness_rating: 5,
    market_expertise_rating: 5,
    negotiation_skills_rating: 5,
    professionalism_communication_rating: 5,
    review_text: '',
    full_name: '',
    property_address: '',
    email: '',
    phone: '',
    worked_with_agent_confirmed: false,
    post_anonymously: false
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiFetch(`${APP_BASE_URL}/api/professionals/${id}`);
        setData(res?.data || null);
      } catch (e) {
        setError(e.message || 'Failed to load professional');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const res = await apiFetch(`${APP_BASE_URL}/api/reviews/professional/${id}?status=all&per_page=50&sort=recent`);
        setReviews(res?.data || null);
      } catch (e) {
        console.error('Failed to load reviews:', e);
      } finally {
        setReviewsLoading(false);
      }
    };
    loadReviews();
  }, [id]);

  useEffect(() => {
    const loadTestimonials = async () => {
      if (!id) return;
      setTestimonialsLoading(true);
      try {
        const res = await apiFetch(`${APP_BASE_URL}/api/testimonials/professional/${id}?status=all&per_page=50&sort=recent`);
        setTestimonials(res?.data || null);
      } catch (e) {
        console.error('Failed to load testimonials:', e);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    loadTestimonials();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    setSubmittingReview(true);
    try {
      await apiFetch(`${APP_BASE_URL}/api/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          ...reviewForm,
          professional_user_id: parseInt(id)
        }),
      });
      toast.success('Review submitted successfully! It will be reviewed before being published.');
      setShowReviewModal(false);
      setReviewForm({
        year_worked: '',
        role: '',
        overall_rating: 5,
        responsiveness_rating: 5,
        market_expertise_rating: 5,
        negotiation_skills_rating: 5,
        professionalism_communication_rating: 5,
        review_text: '',
        full_name: '',
        property_address: '',
        email: '',
        phone: '',
        worked_with_agent_confirmed: false,
        post_anonymously: false
      });
      // Reload reviews
      const res = await apiFetch(`${APP_BASE_URL}/api/reviews/professional/${id}?status=all&per_page=50&sort=recent`);
      setReviews(res?.data || null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitTestimonial = async (formData) => {
    setSubmittingTestimonial(true);
    try {
      await apiFetch(`${APP_BASE_URL}/api/testimonials`, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          professional_user_id: parseInt(id)
        }),
      });
      toast.success('Testimonial submitted successfully! It will be reviewed before being published.');
      setShowTestimonialModal(false);
      // Reload testimonials
      const res = await apiFetch(`${APP_BASE_URL}/api/testimonials/professional/${id}?status=approved&per_page=50&sort=recent`);
      setTestimonials(res?.data || null);
    } catch (err) {
      toast.error(err.message || 'Failed to submit testimonial');
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  const meta = (() => {
    try { return data?.bio ? JSON.parse(data.bio) : null; } catch { return null; }
  })();

  return (
    <div className="min-vh-100 w-100 bg-white text-slate-900">
      {user ? <NavbarTop /> : <FrontendNavbar currentPage="professionals" />}
      {user && <div className="prof-nav-spacer"></div>}

      <div className="container-xl py-5">
        <div className="row g-4">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger border-0 bg-danger-subtle text-danger rounded-3">{error}</div>
          ) : !data ? (
            <div className="text-center py-5">Not found.</div>
          ) : (
            <>
              <div className="col-12 col-lg-8">
                <div className="card-soft rounded-3xl p-4 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <img src={data.avatar_url} alt={data.name} className="prof-avatar" />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                        <h2 className="h5 m-0">{data.name}</h2>
                        <div className="small text-slate-500 d-flex align-items-center gap-1">
                          <Star size={14} /> {data.professional_rating?.rating_avg ? Number(data.professional_rating.rating_avg).toFixed(2) : 'N/A'}
                        </div>
                      </div>
                      <div className="small text-slate-600 d-flex align-items-center gap-2 flex-wrap mt-1">
                        <Users size={14} /> Agent
                        {data.license_number && <span className="ms-2">License: {data.license_number}</span>}
                        {meta && (meta.price_range_min || meta.price_range_max) && (
                          <span className="ms-2">Price Range: {meta.price_range_min || '—'} - {meta.price_range_max || '—'}</span>
                        )}
                      </div>
                      {data.professional_profile?.address_line_1 && (
                        <div className="small text-slate-500 d-flex align-items-center gap-1 mt-1"><MapPin size={14} /> {data.professional_profile.address_line_1}</div>
                      )}
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="p-3 bg-white rounded-3 border border-slate-200 h-100">
                        <h3 className="h6">Overview</h3>
                        <ul className="small text-slate-700 mb-0">
                          {data.email && <li>Email: {data.email}</li>}
                          {data.phone && <li>Phone: {data.phone}</li>}
                          {data.date_of_birth && <li>DOB: {data.date_of_birth}</li>}
                          {data.professional_profile?.sold_count && <li>Sold (last year): {data.professional_profile.sold_count}</li>}
                          {meta?.average_days_on_market && <li>Avg days on market: {meta.average_days_on_market}</li>}
                          {meta?.certifications && <li>Certifications: {meta.certifications}</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="p-3 bg-white rounded-3 border border-slate-200 h-100">
                        <h3 className="h6 mb-3">Languages</h3>
                        <div className="small text-slate-700">
                          {data.languages && data.languages.length > 0 ? (
                            <ul className="mb-0">
                              {data.languages.map(lang => (
                                <li key={lang.id}>{lang.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-between">
                    <Link className="btn btn-outline-secondary" to="/professionals">Back to list</Link>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        onClick={() => setShowTestimonialModal(true)}
                      >
                        <Quote size={16} />
                        Write Testimonial
                      </button>
                      <button 
                        className="btn btn-success d-flex align-items-center gap-2"
                        onClick={() => setShowReviewModal(true)}
                      >
                        <Plus size={16} />
                        Post Review
                      </button>
                      <a className="btn btn-primary" href={`mailto:${data.email}`}>Contact</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4">
                <div className="p-3 bg-white rounded-3 border border-slate-200" style={{ position: 'sticky', top: user ? 88 : 24 }}>
                  <h3 className="h6 mb-3">Contact this professional</h3>
                  <p className="small text-slate-600 mb-3">We’ve connected thousands of buyers and sellers with real estate agents. Let us find an agent for you.</p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const payload = { ...contact };
                    try {
                      setSending(true);
                      await apiFetch(`${APP_BASE_URL}/api/professionals/${id}/contact`, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                      });
                      toast.success('Query sent');
                      setContact({ need: '', zip: '', name: '', email: '', phone: '' });
                    } catch (err) {
                      toast.error(err.message || 'Failed to send');
                    } finally {
                      setSending(false);
                    }
                  }}>
                    <div className="mb-3">
                      <label className="form-label small text-slate-700">What do you need help with?</label>
                      <select
                        name="need"
                        className="form-control form-control-sm"
                        value={contact.need}
                        onChange={(e) => setContact({ ...contact, need: e.target.value })}
                      >
                        <option value="">Choose an option</option>
                        <option value="I want to buy a home">I want to buy a home</option>
                        <option value="I want to sell my home">I want to sell my home</option>
                        <option value="I'm both buying ans selling">I'm both buying ans selling</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-slate-700">Where are you buying or selling? (ZIP)</label>
                      <input
                        name="zip"
                        className="form-control form-control-sm"
                        placeholder="ZIP code"
                        value={contact.zip}
                        onChange={(e) => setContact({ ...contact, zip: e.target.value })}
                      />
                    </div>
                    <div className="mb-2 small fw-semibold text-purple">Your information</div>
                    <div className="mb-2">
                      <input
                        name="name"
                        className="form-control form-control-sm"
                        placeholder="Full name"
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-sm"
                        placeholder="Email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        name="phone"
                        className="form-control form-control-sm"
                        placeholder="Phone"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      />
                    </div>
                    <button
                      className="btn-modern w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2"
                      type="submit"
                      disabled={sending}
                      style={{
                        background: 'linear-gradient(135deg,#5B21B6,#7C3AED)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: 500,
                        opacity: sending ? 0.8 : 1,
                      }}
                    >
                      {sending ? 'Sending…' : 'Submit'}
                    </button>
                    <p className="small text-slate-500 mt-2">By proceeding, you consent to receive calls and texts at the number you provided, including marketing by autodialer and prerecorded and artificial voice, and email, from mlsChat.com about your inquiry and other home-related matters, but not as a condition of any purchase. You also agree to our Term of User , and to our Privicy Policy regarding the information relating to you. Msg/data rates may apply. This consent applies even if you are on a corporate, state or national Do Not Call list.</p>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Testimonials Section */}
        {!loading && !error && data && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card-soft rounded-3xl p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="h5 m-0 d-flex align-items-center gap-2">
                    <Quote size={20} />
                    Testimonials ({testimonials?.total || 0})
                  </h3>
                  <button 
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                    onClick={() => setShowTestimonialModal(true)}
                  >
                    <Quote size={14} />
                    Write Testimonial
                  </button>
                </div>

                {testimonialsLoading ? (
                  <div className="text-center py-4">Loading testimonials...</div>
                ) : testimonials?.data?.length > 0 ? (
                  <div className="row g-3">
                    {testimonials.data.map((testimonial) => (
                      <div key={testimonial.id} className="col-12 col-md-6">
                        <div className="p-4 bg-white rounded-3 border border-slate-200 h-100">
                          <div className="d-flex align-items-start gap-3 mb-3">
                            <div className="d-flex align-items-center justify-content-center bg-purple-100 rounded-circle" style={{ width: '48px', height: '48px' }}>
                              <Quote size={20} className="text-purple-600" />
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-semibold text-slate-800">{testimonial.full_name}</div>
                              <div className="small text-slate-500">
                                {new Date(testimonial.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-700 mb-0" style={{ lineHeight: '1.6' }}>
                            "{testimonial.testimonial}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <Quote size={48} className="mb-3 opacity-50" />
                    <p>No testimonials yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {!loading && !error && data && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card-soft rounded-3xl p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="h5 m-0 d-flex align-items-center gap-2">
                    <MessageSquare size={20} />
                    Reviews ({reviews?.total || 0})
                  </h3>
                  <button 
                    className="btn btn-success btn-sm d-flex align-items-center gap-2"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <Plus size={14} />
                    Post Review
                  </button>
                </div>

                {reviewsLoading ? (
                  <div className="text-center py-4">Loading reviews...</div>
                ) : reviews?.data?.length > 0 ? (
                  <div className="row g-3">
                    {reviews.data.map((review) => (
                      <div key={review.id} className="col-12">
                        <div className="p-3 bg-white rounded-3 border border-slate-200">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div className="fw-semibold">
                                {review.post_anonymously ? 'Anonymous' : (review.full_name || 'Anonymous')}
                              </div>
                              <div className="small text-slate-500">
                                {review.year_worked && `${review.year_worked} • `}
                                {review.role && `${review.role} • `}
                                {new Date(review.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <Star size={14} className="text-warning" />
                              <span className="fw-semibold">{review.overall_rating}</span>
                            </div>
                          </div>
                          
                          {review.review_text && (
                            <p className="mb-3 text-slate-700">{review.review_text}</p>
                          )}
                          
                          <div className="row g-2 small">
                            <div className="col-6 col-md-3">
                              <span className="text-slate-500">Responsiveness:</span>
                              <div className="d-flex align-items-center gap-1">
                                <Star size={12} className="text-warning" />
                                {review.responsiveness_rating}
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <span className="text-slate-500">Market Expertise:</span>
                              <div className="d-flex align-items-center gap-1">
                                <Star size={12} className="text-warning" />
                                {review.market_expertise_rating}
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <span className="text-slate-500">Negotiation:</span>
                              <div className="d-flex align-items-center gap-1">
                                <Star size={12} className="text-warning" />
                                {review.negotiation_skills_rating}
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <span className="text-slate-500">Professionalism:</span>
                              <div className="d-flex align-items-center gap-1">
                                <Star size={12} className="text-warning" />
                                {review.professionalism_communication_rating}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <span className={`badge ${review.status === 'approved' ? 'bg-success' : review.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                              {review.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <MessageSquare size={48} className="mb-3 opacity-50" />
                    <p>No reviews yet. Be the first to review this professional!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content border-0" style={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <div className="modal-header border-0 pb-0" style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)', borderRadius: '24px 24px 0 0' }}>
                <div className="d-flex align-items-center gap-3 w-100">
                  <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                    <Star size={24} className="text-white" />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="modal-title text-white mb-0 fw-semibold">Post a Review</h5>
                    <p className="text-white-50 mb-0 small">Share your experience with {data?.name}</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowReviewModal(false)}
                    style={{ filter: 'invert(1)' }}
                  ></button>
                </div>
              </div>
              <form onSubmit={handleSubmitReview}>
                <div className="modal-body p-4" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="row g-4">
                    {/* Year Worked */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Year Worked Together</label>
                      <input
                        type="number"
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        value={reviewForm.year_worked}
                        onChange={(e) => setReviewForm({...reviewForm, year_worked: e.target.value})}
                        min="1900"
                        max={new Date().getFullYear()}
                        placeholder="2023"
                      />
                    </div>

                    {/* Role */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Your Role</label>
                      <select
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        value={reviewForm.role}
                        onChange={(e) => setReviewForm({...reviewForm, role: e.target.value})}
                      >
                        <option value="">Select role</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                      </select>
                    </div>
                    
                    {/* Overall Rating */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <label className="form-label fw-semibold text-slate-700 mb-3">Overall Rating *</label>
                        <div className="d-flex align-items-center gap-3">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setReviewForm({...reviewForm, overall_rating: rating})}
                              style={{ fontSize: '32px', transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              {rating <= reviewForm.overall_rating ? '⭐' : '☆'}
                            </button>
                          ))}
                          <span className="ms-3 fw-semibold text-slate-600" style={{ fontSize: '18px' }}>{reviewForm.overall_rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Responsiveness Rating */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <label className="form-label fw-semibold text-slate-700 mb-3">Responsiveness *</label>
                        <div className="d-flex align-items-center gap-3">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setReviewForm({...reviewForm, responsiveness_rating: rating})}
                              style={{ fontSize: '28px', transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              {rating <= reviewForm.responsiveness_rating ? '⭐' : '☆'}
                            </button>
                          ))}
                          <span className="ms-3 fw-semibold text-slate-600">{reviewForm.responsiveness_rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Market Expertise Rating */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <label className="form-label fw-semibold text-slate-700 mb-3">Market Expertise *</label>
                        <div className="d-flex align-items-center gap-3">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setReviewForm({...reviewForm, market_expertise_rating: rating})}
                              style={{ fontSize: '28px', transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              {rating <= reviewForm.market_expertise_rating ? '⭐' : '☆'}
                            </button>
                          ))}
                          <span className="ms-3 fw-semibold text-slate-600">{reviewForm.market_expertise_rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Negotiation Skills Rating */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <label className="form-label fw-semibold text-slate-700 mb-3">Negotiation Skills *</label>
                        <div className="d-flex align-items-center gap-3">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setReviewForm({...reviewForm, negotiation_skills_rating: rating})}
                              style={{ fontSize: '28px', transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              {rating <= reviewForm.negotiation_skills_rating ? '⭐' : '☆'}
                            </button>
                          ))}
                          <span className="ms-3 fw-semibold text-slate-600">{reviewForm.negotiation_skills_rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Professionalism & Communication Rating */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <label className="form-label fw-semibold text-slate-700 mb-3">Professionalism & Communication *</label>
                        <div className="d-flex align-items-center gap-3">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setReviewForm({...reviewForm, professionalism_communication_rating: rating})}
                              style={{ fontSize: '28px', transition: 'transform 0.2s' }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                              {rating <= reviewForm.professionalism_communication_rating ? '⭐' : '☆'}
                            </button>
                          ))}
                          <span className="ms-3 fw-semibold text-slate-600">{reviewForm.professionalism_communication_rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Review Text</label>
                      <textarea
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        rows="4"
                        value={reviewForm.review_text}
                        onChange={(e) => setReviewForm({...reviewForm, review_text: e.target.value})}
                        placeholder="Share your experience working with this professional..."
                        maxLength="4000"
                      />
                    </div>

                    {/* Full Name */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        value={reviewForm.full_name}
                        onChange={(e) => setReviewForm({...reviewForm, full_name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Property Address */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Property Address</label>
                      <input
                        type="text"
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        value={reviewForm.property_address}
                        onChange={(e) => setReviewForm({...reviewForm, property_address: e.target.value})}
                        placeholder="Property address"
                      />
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        className="form-control border-0"
                        style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                        value={reviewForm.phone}
                        onChange={(e) => setReviewForm({...reviewForm, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Worked with agent confirmation */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={reviewForm.worked_with_agent_confirmed}
                            onChange={(e) => setReviewForm({...reviewForm, worked_with_agent_confirmed: e.target.checked})}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <label className="form-check-label fw-semibold text-slate-700 ms-2">
                            I confirm that I worked with this agent
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Post anonymously */}
                    <div className="col-12">
                      <div className="p-3 bg-white rounded-3" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={reviewForm.post_anonymously}
                            onChange={(e) => setReviewForm({...reviewForm, post_anonymously: e.target.checked})}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <label className="form-check-label fw-semibold text-slate-700 ms-2">
                            Post this review anonymously
                          </label>
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
                      onClick={() => setShowReviewModal(false)}
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
                        opacity: submittingReview ? 0.8 : 1
                      }}
                      disabled={submittingReview}
                    >
                      {submittingReview ? (
                        <span className="d-flex align-items-center justify-content-center gap-2">
                          <div className="spinner-border spinner-border-sm" role="status"></div>
                          Submitting...
                        </span>
                      ) : (
                        <span className="d-flex align-items-center justify-content-center gap-2">
                          <Star size={16} />
                          Submit Review
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        onSubmit={handleSubmitTestimonial}
        professionalName={data?.name}
        submitting={submittingTestimonial}
      />

      <footer className="border-top border-slate-200 mt-auto">
        <div className="container-xl py-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="prof-logo">
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

export default ProfessionalShow;

