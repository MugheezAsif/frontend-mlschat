import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Search, Filter, ChevronLeft, ChevronRight, Users, Star, MapPin } from 'lucide-react';
import { apiFetch } from '../lib/apiClient';
import { useSelector } from 'react-redux';
import NavbarTop from '../components/NavbarTop';
import FrontendNavbar from '../components/frontend/Navbar';
import '../home.css';
import './professionals.css';

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

const pageSizes = [12, 24, 36];
const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'name', label: 'Name' },
  { value: 'sold', label: 'Most Sold' },
  { value: 'rating', label: 'Top Rated' },
];

const Professionals = () => {
  const [items, setItems] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = useSelector(state => state.auth.user);

  const [q, setQ] = useState('');
  const [language, setLanguage] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [sort, setSort] = useState('recent');
  const [order, setOrder] = useState('desc');
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (language) params.set('language', language);
    if (city) params.set('city', city);
    if (state) params.set('state', state);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);
    if (perPage) params.set('per_page', String(perPage));
    if (page) params.set('page', String(page));
    return params;
  }, [q, language, city, state, sort, order, perPage, page]);

  const fetchLanguages = async () => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/languages`);
      setLanguages(data?.data || []);
    } catch (e) {
      // ignore
    }
  };

  const fetchProfessionals = async () => {
    setLoading(true);
    setError('');
    try {
      const url = `${APP_BASE_URL}/api/professionals?${queryParams.toString()}`;
      const data = await apiFetch(url);
      const paginated = data?.data;
      setItems(paginated?.data || []);
      setMeta({
        current_page: paginated?.current_page || 1,
        last_page: paginated?.last_page || 1,
        total: paginated?.total || 0,
      });
    } catch (e) {
      setError(e.message || 'Failed to load professionals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    fetchProfessionals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.toString()]);

  const canPrev = page > 1;
  const canNext = page < meta.last_page;

  return (
    <div className="min-vh-100 w-100 bg-white text-slate-900">
      {user ? <NavbarTop /> : <FrontendNavbar currentPage="professionals" />}

      {user && <div className="prof-nav-spacer"></div>}

      <div className="container-xl py-5">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-4 text-center"
        >
          <h1 className="fw-semibold prof-title">Real Estate Professionals</h1>
          <p className="text-slate-700">Browse verified agents and filter by language, location, and more.</p>
        </motion.div>

        {/* Filters */}
        <div className="d-flex justify-content-center mb-4">
          <div className="w-100 prof-container">
            <div className="card-soft rounded-3xl p-3 p-md-4">
              {/* Row 1: Search, City, State */}
              <div className="row g-2 g-md-3 align-items-end">
                <div className="col-12 col-md-6">
                  <label className="form-label small text-slate-600">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-slate-200"><Search size={16} /></span>
                    <input className="form-control border-slate-200" placeholder="Name, email, license..." value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small text-slate-600">City</label>
                  <input className="form-control border-slate-200" placeholder="City" value={city} onChange={(e) => { setPage(1); setCity(e.target.value); }} />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small text-slate-600">State</label>
                  <input className="form-control border-slate-200" placeholder="State" value={state} onChange={(e) => { setPage(1); setState(e.target.value); }} />
                </div>
              </div>
              {/* Row 2: Language, Sort, Order, Per Page */}
              <div className="row g-2 g-md-3 align-items-end mt-2">
                <div className="col-6 col-md-3">
                  <label className="form-label small text-slate-600">Language</label>
                  <select className="form-select border-slate-200" value={language} onChange={(e) => { setPage(1); setLanguage(e.target.value); }}>
                    <option value="">All</option>
                    {languages.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small text-slate-600">Sort</label>
                  <select className="form-select border-slate-200" value={sort} onChange={(e) => { setPage(1); setSort(e.target.value); }}>
                    {sortOptions.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small text-slate-600">Order</label>
                  <select className="form-select border-slate-200" value={order} onChange={(e) => { setPage(1); setOrder(e.target.value); }}>
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small text-slate-600">Per Page</label>
                  <select className="form-select border-slate-200" value={perPage} onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}>
                    {pageSizes.map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="d-flex justify-content-center mb-4">
            <div className="w-100 prof-container">
              <div className="alert alert-danger border-0 bg-danger-subtle text-danger rounded-3">{error}</div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-center">
          <div className="w-100 prof-container">
            {loading ? (
              <div className="text-center py-5">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-5">No professionals found.</div>
            ) : (
              items.map((u) => (
                <Link to={`/professionals/${u.id}`} className="text-decoration-none text-reset">
                  <div className="card-soft rounded-3xl p-3 mb-3" key={u.id}>
                    <div className="d-flex align-items-center gap-3">
                      <img src={u.avatar_url} alt={u.name} className="prof-avatar" />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="fw-semibold">{u.name}</div>
                          <div className="small text-slate-500 d-flex align-items-center gap-1">
                            <Star size={14} /> {u.professional_rating?.rating_avg ? Number(u.professional_rating.rating_avg).toFixed(2) : 'N/A'}
                          </div>
                        </div>
                        <div className="small text-slate-600 d-flex align-items-center gap-2 flex-wrap">
                          <Users size={14} /> Agent
                          {u.professional_profile?.sold_count ? (
                            <span className="ms-2">Sold (last year): {u.professional_profile.sold_count}</span>
                          ) : null}
                          {(u.bio && (() => { try { return JSON.parse(u.bio); } catch { return null; } })()) ? (() => { const meta = JSON.parse(u.bio); return (
                            <>
                              {(meta.price_range_min || meta.price_range_max) ? (
                                <span className="ms-2">Price Range: {meta.price_range_min || '—'} - {meta.price_range_max || '—'}</span>
                              ) : null}
                            </>
                          ); })() : null}
                        </div>
                        {u.professional_profile?.address_line_1 && (
                          <div className="small text-slate-500 d-flex align-items-center gap-1 mt-1"><MapPin size={14} /> {u.professional_profile.address_line_1}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <div className="w-100 prof-container">
            <div className="d-flex align-items-center justify-content-between">
              <div className="small text-slate-600">Page {meta.current_page} of {meta.last_page} • {meta.total} results</div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-secondary" disabled={!canPrev} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={16} /></button>
                <button className="btn btn-outline-secondary" disabled={!canNext} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Professionals;
