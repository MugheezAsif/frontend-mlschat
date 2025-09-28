import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, User, Briefcase, Mail, CheckCircle, Users, Sparkles, MapPin, DollarSign, Home, Award } from "lucide-react";
import { useAuth } from '../hooks/useAuth';
import '../home.css';
import Select from 'react-select';

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

const slideIn = {
    hidden: { opacity: 0, x: 50 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, x: -50 }
};

const BenefitItem = ({ icon: Icon, text }) => (
    <motion.div variants={fadeUp} className="d-flex align-items-center gap-2 text-slate-600 small">
        <CheckCircle size={16} className="text-success" />
        {text}
    </motion.div>
);

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
        {Array.from({ length: totalSteps }, (_, index) => (
            <div
                key={index}
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                    width: 32,
                    height: 32,
                    backgroundColor: index <= currentStep - 1 ? '#5B21B6' : '#e2e8f0',
                    color: index <= currentStep - 1 ? 'white' : '#64748b',
                    fontSize: '14px',
                    fontWeight: '600'
                }}
            >
                {index + 1}
            </div>
        ))}
    </div>
);

const US_STATES = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const LANGUAGE_OPTIONS = [
    'English','Spanish','French','German','Chinese','Japanese','Korean','Hindi','Arabic','Portuguese','Russian','Italian','Urdu','Bengali','Vietnamese'
];
const LANGUAGE_SELECT_OPTIONS = LANGUAGE_OPTIONS.map(l => ({ value: l, label: l }));
const US_STATE_SELECT_OPTIONS = US_STATES.map(s => ({ value: s, label: s }));

const AgentSignup = () => {
    const token = localStorage.getItem('token');
    if (token) return <Navigate to="/home" replace />;
    
    const { agentSignup } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Info
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        dob_year: '',
        dob_month: '',
        dob_day: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        password: '',
        confirm_password: '',

        // Professional Info
        license_number: '',
        years_experience: '',
        specializations: [],
        price_range_min: '',
        price_range_max: '',
        listings_sold: '',
        average_days_on_market: '',
        certifications: '',
        languages: [],
        areas_served: []
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDaysInMonth = (year, month) => {
        const y = Number(year);
        const m = Number(month);
        if (!y || !m) return null;
        return new Date(y, m, 0).getDate();
    };

    const handleChange = (e) => {
        const { name, value, type, checked, multiple, options } = e.target;

        if (type === 'checkbox' && name === 'specializations') {
            const currentSpecializations = formData.specializations || [];
            if (checked) {
                setFormData({
                    ...formData,
                    specializations: [...currentSpecializations, value]
                });
            } else {
                setFormData({
                    ...formData,
                    specializations: currentSpecializations.filter(s => s !== value)
                });
            }
            return;
        }

        if (multiple) {
            const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
            setFormData({
                ...formData,
                [name]: selected
            });
            return;
        }

        const next = { ...formData, [name]: value };
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

    const nextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
            setError('');
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setError('');
    };

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
                    setError('Please fill in all required fields');
                    return false;
                }
                if (!formData.password) {
                    setError('Please enter a password');
                    return false;
                }
                if (formData.password !== formData.confirm_password) {
                    setError('Passwords do not match');
                    return false;
                }
                if (!formData.date_of_birth) {
                    setError('Please select your date of birth');
                    return false;
                }
                if (!formData.address || !formData.city || !formData.state || !formData.zip_code) {
                    setError('Please fill in all address fields');
                    return false;
                }
                break;
            case 2:
                if (!formData.license_number || !formData.years_experience) {
                    setError('Please fill in all required fields');
                    return false;
                }
                if (!formData.specializations || formData.specializations.length === 0) {
                    setError('Please select at least one specialization');
                    return false;
                }
                if (!formData.price_range_min || !formData.price_range_max) {
                    setError('Please specify your price range');
                    return false;
                }
                if (!formData.listings_sold || !formData.average_days_on_market) {
                    setError('Please fill in your sales performance data');
                    return false;
                }
                if (!formData.languages || formData.languages.length === 0) {
                    setError('Please select at least one language');
                    return false;
                }
                if (!formData.areas_served || formData.areas_served.length === 0) {
                    setError('Please select at least one area you serve');
                    return false;
                }
                break;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep < 2) {
            nextStep();
        } else {
            setIsSubmitting(true);
            setError('');
            
            try {
                const agentData = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone: formData.phone,
                    date_of_birth: formData.date_of_birth,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zip_code,
                    password: formData.password,
                    
                    // Professional Info
                    license_number: formData.license_number,
                    years_experience: formData.years_experience,
                    specializations: formData.specializations,
                    price_range_min: formData.price_range_min,
                    price_range_max: formData.price_range_max,
                    listings_sold: formData.listings_sold,
                    average_days_on_market: formData.average_days_on_market,
                    // certifications removed
                    languages: (formData.languages || []).join(', '),
                    areas_served: formData.areas_served
                };
                
                await agentSignup(agentData);
                setIsSubmitting(false);
            } catch (err) {
                const backendErrors = (err && err.errors && Object.values(err.errors).flat().join(' ')) || err.message;
                setError(backendErrors || 'Failed to create agent account');
                setIsSubmitting(false);
            }
        }
    };

    const specializations = [
        'Residential Sales', 'Commercial Real Estate', 'Luxury Homes',
        'First-Time Buyers', 'Investment Properties', 'New Construction',
        'Land Sales', 'Property Management', 'Relocation Services'
    ];

    // DOB selects
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const maxDaysForSelection = getDaysInMonth(formData.dob_year, formData.dob_month) || 31;
    const days = Array.from({ length: maxDaysForSelection }, (_, i) => String(i + 1));

    const renderStep1 = () => (
        <motion.div
            key="step1"
            variants={slideIn}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <h3 className="h4 text-slate-900 mb-4">Personal Information</h3>

            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">First Name *</label>
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
                    <label className="form-label fw-medium text-slate-700 mb-2">Last Name *</label>
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
                <label className="form-label fw-medium text-slate-700 mb-2">Email Address *</label>
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

            <div className="mt-3">
                <label className="form-label fw-medium text-slate-700 mb-2">Phone Number *</label>
                <input
                    type="tel"
                    name="phone"
                    className="form-control rounded-3 border-slate-200"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                />
            </div>

            <div className="row g-3 mt-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Password *</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Enter a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Confirm Password *</label>
                    <input
                        type="password"
                        name="confirm_password"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Confirm password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
            </div>

            <div className="mt-3">
                <label className="form-label fw-medium text-slate-700 mb-2">Date of Birth *</label>
                <div className="d-flex gap-2">
                    <select
                        name="dob_day"
                        className="form-select rounded-3 border-slate-200"
                        value={formData.dob_day}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
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
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
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
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    >
                        <option value="">Year</option>
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row g-3 mt-3">
                <div className="col-12">
                    <label className="form-label fw-medium text-slate-700 mb-2">Address *</label>
                    <input
                        type="text"
                        name="address"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Street address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        name="city"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        name="state"
                        className="form-control rounded-3 border-slate-200"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    >
                        <option value="">State</option>
                        {US_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        name="zip_code"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="ZIP Code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            key="step2"
            variants={slideIn}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            <h3 className="h4 text-slate-900 mb-4">Professional Information</h3>

            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">License Number *</label>
                    <input
                        type="text"
                        name="license_number"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Real estate license number"
                        value={formData.license_number}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Years of Experience *</label>
                    <select
                        name="years_experience"
                        className="form-control rounded-3 border-slate-200"
                        value={formData.years_experience}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    >
                        <option value="">Select years of experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-5">2-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-15">11-15 years</option>
                        <option value="16-20">16-20 years</option>
                        <option value="20+">20+ years</option>
                    </select>
                </div>
            </div>

            <div className="mt-3">
                <label className="form-label fw-medium text-slate-700 mb-2">Specializations *</label>
                <div className="row g-2">
                    {specializations.map((spec) => (
                        <div key={spec} className="col-md-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="specializations"
                                    value={spec}
                                    checked={formData.specializations?.includes(spec) || false}
                                    onChange={handleChange}
                                    id={spec.replace(/\s+/g, '-')}
                                />
                                <label className="form-check-label text-slate-600 small" htmlFor={spec.replace(/\s+/g, '-')}>
                                    {spec}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="row g-3 mt-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Price Range (Min) *</label>
                    <input
                        type="number"
                        name="price_range_min"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Minimum price"
                        value={formData.price_range_min}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Price Range (Max) *</label>
                    <input
                        type="number"
                        name="price_range_max"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Maximum price"
                        value={formData.price_range_max}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
            </div>

            <div className="row g-3 mt-3">
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Listings Sold (Last Year) *</label>
                    <input
                        type="number"
                        name="listings_sold"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Number of listings sold"
                        value={formData.listings_sold}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-medium text-slate-700 mb-2">Avg. Days on Market *</label>
                    <input
                        type="number"
                        name="average_days_on_market"
                        className="form-control rounded-3 border-slate-200"
                        placeholder="Average days"
                        value={formData.average_days_on_market}
                        onChange={handleChange}
                        required
                        style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                    />
                </div>
            </div>

            <div className="mt-3">
                <label className="form-label fw-medium text-slate-700 mb-2">Languages (Select multiple) *</label>
                <Select
                    isMulti
                    name="languages"
                    options={LANGUAGE_SELECT_OPTIONS}
                    value={(formData.languages || []).map(v => ({ value: v, label: v }))}
                    onChange={(selected) => {
                        setFormData({ ...formData, languages: (selected || []).map(o => o.value) });
                    }}
                    classNamePrefix="rs"
                    styles={{
                        control: (base) => ({ ...base, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', borderRadius: 12, minHeight: 40 }),
                        multiValue: (base) => ({ ...base, backgroundColor: '#e9d5ff' }),
                    }}
                />
            </div>

            <div className="mt-3">
                <label className="form-label fw-medium text-slate-700 mb-2">Areas Served (Select multiple states) *</label>
                <Select
                    isMulti
                    name="areas_served"
                    options={US_STATE_SELECT_OPTIONS}
                    value={(formData.areas_served || []).map(v => ({ value: v, label: v }))}
                    onChange={(selected) => {
                        setFormData({ ...formData, areas_served: (selected || []).map(o => o.value) });
                    }}
                    classNamePrefix="rs"
                    styles={{
                        control: (base) => ({ ...base, borderColor: '#e2e8f0', backgroundColor: '#f8fafc', borderRadius: 12, minHeight: 40 }),
                        multiValue: (base) => ({ ...base, backgroundColor: '#e9d5ff' }),
                    }}
                />
            </div>

            {/* Certifications removed */}
        </motion.div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            default:
                return renderStep1();
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
                    <a href="/signup" className="text-decoration-none nav-link-soft small">
                        ← Back to Signup
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
                                    <Briefcase size={24} />
                                </div>
                            </div>
                            <h1 className="fw-semibold" style={{ fontSize: "clamp(2rem,4vw,2.5rem)" }}>
                                Create Your Agent Profile
                            </h1>
                            <p className="lead text-slate-700 mt-2">
                                Complete your professional profile to unlock all features
                            </p>
                        </motion.div>

                        <div className="row g-5">
                            {/* Form */}
                            <div className="col-lg-7">
                                <motion.div
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={fadeUp}
                                    className="card-soft rounded-3xl p-4 p-md-5 shadow-lg h-100"
                                >
                                    <StepIndicator currentStep={currentStep} totalSteps={2} />

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
                                        <AnimatePresence mode="wait">
                                            {renderCurrentStep()}
                                        </AnimatePresence>

                                        <div className="d-flex justify-content-between mt-4">
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                                                    style={{
                                                        borderColor: '#5B21B6',
                                                        color: '#5B21B6',
                                                        borderRadius: '12px'
                                                    }}
                                                >
                                                    <ArrowLeft size={18} /> Previous
                                                </button>
                                            )}

                                            <button
                                                type="submit"
                                                className="btn-modern d-inline-flex align-items-center justify-content-center gap-2 py-3"
                                                style={{
                                                    background: "linear-gradient(135deg,#5B21B6,#7C3AED)",
                                                    border: "none",
                                                    color: "white",
                                                    borderRadius: "12px",
                                                    fontWeight: "500",
                                                    marginLeft: currentStep === 1 ? 'auto' : '0'
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                                        Submitting...
                                                    </>
                                                ) : currentStep === 2 ? (
                                                    <>
                                                        Complete Profile <ArrowRight size={18} />
                                                    </>
                                                ) : (
                                                    <>
                                                        Next Step <ArrowRight size={18} />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
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
                                                    <Award size={24} />
                                                </div>
                                            </div>
                                            <h3 className="h4 text-slate-900">Agent Benefits</h3>
                                            <p className="text-slate-700">Unlock premium features for real estate professionals</p>
                                        </div>

                                        <div className="d-flex flex-column gap-3">
                                            <BenefitItem text="Enhanced profile visibility in search results" />
                                            <BenefitItem text="Priority listing placement and promotion" />
                                            <BenefitItem text="Advanced analytics and performance metrics" />
                                            <BenefitItem text="Direct messaging with potential clients" />
                                            <BenefitItem text="Custom branding and profile customization" />
                                            <BenefitItem text="Access to exclusive market insights" />
                                            <BenefitItem text="Priority customer support" />
                                            <BenefitItem text="Featured agent status on listings" />
                                        </div>

                                        <div className="mt-4 p-3 bg-white rounded-3 border border-slate-200">
                                            <div className="d-flex align-items-center gap-2 text-slate-700 small">
                                                <ShieldCheck size={18} />
                                                <span>Your professional information is verified and secure</span>
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
                                <div className="d-flex alignments-center gap-1">
                                    <ShieldCheck size={16} className="text-success" />
                                    Verified profiles
                                </div>
                                <div className="d-flex alignments-center gap-1">
                                    <ShieldCheck size={16} className="text-success" />
                                    Secure process
                                </div>
                                <div className="d-flex alignments-center gap-1">
                                    <ShieldCheck size={16} className="text-success" />
                                    Free verification
                                </div>
                                <div className="d-flex alignments-center gap-1">
                                    <ShieldCheck size={16} className="text-success" />
                                    Instant access
                                </div>
                            </div>
                            <p className="text-slate-500 small mt-3 mb-0">
                                By creating an agent profile, you agree to MLSChat's{' '}
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
                        <div className="d-flex alignments-center gap-3 small text-slate-600">
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

export default AgentSignup; 