import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faIdCard,
  faCalendarAlt, faInfoCircle, faGlobe, faShieldAlt, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './aboutTab.css';

const SectionNavItem = ({ id, title, icon, active, onClick }) => (
  <button
    type="button"
    className={`about-list-item list-group-item list-group-item-action d-flex align-items-center ${active ? 'active' : ''}`}
    onClick={() => onClick(id)}
    aria-current={active}
  >
    <FontAwesomeIcon icon={icon} className="me-2" />
    <span className="flex-grow-1 text-start">{title}</span>
  </button>
);

const FieldRow = ({ icon, label, value, href, hint }) => {
  if (!value) return null;
  const Inner = (
    <div className="d-flex align-items-start about-field-row">
      <FontAwesomeIcon icon={icon} className="me-2 mt-1 text-primary about-field-icon" />
      <div>
        <div className="fw-semibold">{label}</div>
        <div className="text-dark">{value}</div>
        {hint && <div className="small text-muted mt-1">{hint}</div>}
      </div>
    </div>
  );
  return <div className="py-2">{href ? <a href={href} className="text-decoration-none text-reset">{Inner}</a> : Inner}</div>;
};

const SectionCard = ({ title, children, actionHref }) => (
  <div className="card border-0 shadow-sm mb-4 about-card">
    <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between about-card-header">
      <h5 className="mb-0">{title}</h5>
      {actionHref && <a href={actionHref} className="btn btn-sm btn-outline-primary">Edit</a>}
    </div>
    <div className="card-body">{children}</div>
  </div>
);

const EmptyState = ({ icon = faInfoCircle, title, subtitle, ctaHref }) => (
  <div className="text-center text-muted py-4">
    <FontAwesomeIcon icon={icon} className="mb-2" style={{ fontSize: '2rem' }} />
    <div className="fw-semibold">{title}</div>
    {subtitle && <small className="d-block mb-2">{subtitle}</small>}
    {ctaHref && <a className="btn btn-sm btn-primary" href={ctaHref}>Update Profile</a>}
  </div>
);

const formatJoinDate = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return isNaN(d) ? dateString : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function AboutTab() {
  const user = useSelector((s) => s.auth.user);
  const [active, setActive] = useState('overview');

  const settingsHref = user ? `/user-settings/${user.id}` : '#';

  const sections = useMemo(() => ([
    { id: 'overview', title: 'Overview', icon: faUser },
    { id: 'contact', title: 'Contact & Basic Info', icon: faEnvelope },
    { id: 'work', title: 'Work & Credentials', icon: faBuilding },
    { id: 'places', title: 'Places Lived', icon: faMapMarkerAlt },
    { id: 'details', title: 'Details About You', icon: faInfoCircle },
    { id: 'account', title: 'Account Information', icon: faShieldAlt },
  ]), []);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <div className="text-muted">No user data available</div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 about-container">
      <div className="row g-4">
        <div className="col-lg-4 col-xl-3">
          <div className="position-sticky about-sticky" style={{ top: 16 }}>
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0"><h5 className="mb-0">About</h5></div>
              <div className="list-group list-group-flush">
                {sections.map((s) => (
                  <SectionNavItem
                    key={s.id}
                    id={s.id}
                    title={s.title}
                    icon={s.icon}
                    active={active === s.id}
                    onClick={setActive}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8 col-xl-9">
          {active === 'overview' && (
            <>
              <SectionCard title="Overview" actionHref={settingsHref}>
                <div className="row">
                  <div className="col-md-6">
                    <FieldRow icon={faUser} label="Full Name" value={user.name} />
                    <FieldRow icon={faEnvelope} label="Email" value={user.email} href={user.email ? `mailto:${user.email}` : undefined} />
                    <FieldRow icon={faPhone} label="Phone" value={user.phone} href={user.phone ? `tel:${user.phone}` : undefined} />
                  </div>
                  <div className="col-md-6">
                    <FieldRow icon={faMapMarkerAlt} label="Location" value={user.location} />
                    <FieldRow icon={faCalendarAlt} label="Member Since" value={formatJoinDate(user.created_at)} />
                    <FieldRow icon={faCheckCircle} label="Email Status" value={user.email_verified_at ? 'Verified' : 'Unverified'} />
                  </div>
                </div>
                {!user.name && !user.email && !user.phone && !user.location && !user.created_at && (
                  <EmptyState title="No overview info yet" subtitle="Add some basics so people can know you better." ctaHref={settingsHref} />
                )}
              </SectionCard>

              {user.bio && (
                <SectionCard title="About Me" actionHref={settingsHref}>
                  <p className="mb-0" style={{ lineHeight: 1.7 }}>{user.bio}</p>
                </SectionCard>
              )}
            </>
          )}

          {active === 'contact' && (
            <SectionCard title="Contact & Basic Info" actionHref={settingsHref}>
              <FieldRow icon={faEnvelope} label="Email" value={user.email} href={user.email ? `mailto:${user.email}` : undefined} />
              <FieldRow icon={faPhone} label="Phone" value={user.phone} href={user.phone ? `tel:${user.phone}` : undefined} />
              <FieldRow icon={faGlobe} label="Website" value={user.website} href={user.website} hint="Public link to your site" />
              <FieldRow icon={faMapMarkerAlt} label="Location" value={user.location} />
              {!user.email && !user.phone && !user.location && !user.website && (
                <EmptyState title="No contact info" subtitle="Share ways people can reach you." ctaHref={settingsHref} />
              )}
            </SectionCard>
          )}

          {active === 'work' && (
            <SectionCard title="Work & Credentials" actionHref={settingsHref}>
              <FieldRow icon={faBuilding} label="Brokerage" value={user.brokerage_name} />
              <FieldRow icon={faIdCard} label="License Number" value={user.license_number} />
              {!user.brokerage_name && !user.license_number && (
                <EmptyState title="No professional information" subtitle="Add your brokerage and license details." ctaHref={settingsHref} />
              )}
            </SectionCard>
          )}

          {active === 'places' && (
            <SectionCard title="Places Lived" actionHref={settingsHref}>
              <FieldRow icon={faMapMarkerAlt} label="Current City" value={user.location} />
              {!user.location && <EmptyState title="No places added" subtitle="Tell people where you live." ctaHref={settingsHref} />}
            </SectionCard>
          )}

          {active === 'details' && (
            <SectionCard title="Details About You" actionHref={settingsHref}>
              <FieldRow icon={faInfoCircle} label="Bio" value={user.bio} />
              {!user.bio && <EmptyState title="No details yet" subtitle="Write a short bio about yourself." ctaHref={settingsHref} />}
            </SectionCard>
          )}

          {active === 'account' && (
            <SectionCard title="Account Information" actionHref={settingsHref}>
              <div className="row text-center text-md-start">
                <div className="col-md-4">
                  <div className="p-3 border rounded-3 h-100">
                    <div className="h5 text-primary mb-1">{user.id}</div>
                    <div className="small text-muted">User ID</div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="p-3 border rounded-3 h-100">
                    <div className="h5 text-success mb-1">{user.email_verified_at ? 'Verified' : 'Unverified'}</div>
                    <div className="small text-muted">Email Status</div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="p-3 border rounded-3 h-100">
                    <div className="h5 text-info mb-1">Active</div>
                    <div className="small text-muted">Account Status</div>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
