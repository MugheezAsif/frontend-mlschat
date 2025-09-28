import React from 'react';
import InfoCard from './InfoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const ProfileSidebar = ({ user }) => {
  if (!user) return null;

  const socialLinks =
    typeof user.social_link === 'string'
      ? JSON.parse(user.social_link)
      : user.social_link || {};

  const visibility =
    typeof user.profile_visibility_settings === 'string'
      ? JSON.parse(user.profile_visibility_settings)
      : user.profile_visibility_settings || { show_email: true, show_phone: true };

  const formatUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const hasAnySocial =
    socialLinks.facebook || socialLinks.instagram || socialLinks.linkedin || socialLinks.x;

  return (
    <>
      <InfoCard
        title="About"
        content={user.bio || 'No bio available.'}
      />

      <InfoCard
        title="Contact Information"
        content={
          <>
            {visibility.show_email && (
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-secondary" />
                {user.email || '-'}
              </p>
            )}
            {visibility.show_phone && (
              <p>
                <FontAwesomeIcon icon={faPhone} className="me-2 text-secondary" />
                {user.phone || '-'}
              </p>
            )}
            <p>
              <FontAwesomeIcon icon={faLocationDot} className="me-2 text-secondary" />
              {user.location || '-'}
            </p>
          </>
        }
      />

      {hasAnySocial && (
        <InfoCard
          title="Social Media"
          content={
            <>
              {socialLinks.linkedin && (
                <a href={formatUrl(socialLinks.linkedin)} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLinkedin} className="me-2 text-secondary" />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={formatUrl(socialLinks.facebook)} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} className="me-2 text-secondary" />
                </a>
              )}
              {socialLinks.x && (
                <a href={formatUrl(socialLinks.x)} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faXTwitter} className="me-2 text-secondary" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={formatUrl(socialLinks.instagram)} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} className="me-2 text-secondary" />
                </a>
              )}
            </>
          }
        />
      )}
    </>
  );
};

export default ProfileSidebar;
