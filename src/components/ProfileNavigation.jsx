import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import InviteUsersModal from './modal/InviteUsersModal';

const ProfileNavigation = ({ user }) => {
  const location = useLocation();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleInviteSuccess = (response) => {
    console.log('Invites sent successfully:', response);
  };

  return (
    <div className="card-basic">
      <div>
        <Link
          to={`/user/${user.id}`}
          className={`nav-pill me-2 ${isActive(`/user/${user.id}`) ? 'active' : ''}`}
        >
          Profile
        </Link>
        <Link
          to="/about"
          className={`nav-pill me-2 ${isActive('/about') ? 'active' : ''}`}
        >
          About
        </Link>
       <Link
  to="/following"
  className={`nav-pill me-2 ${isActive('/following') || isActive('/follow_request') ? 'active' : ''}`}
>
  Following
</Link>


       
        <Link
          to="/my_post"
          className={`nav-pill me-2 ${isActive('/my_post') ? 'active' : ''}`}
        >
          Posts
        </Link>


        <Link
          to="/friends"
          className={`nav-pill me-2 ${isActive('/friends') ? 'active' : ''}`}
        >
          Friends
        </Link>


        
        <Link
          to="/photos"
          className={`nav-pill me-2 ${isActive('/photos') ? 'active' : ''}`}
        >
          Photos
        </Link>

        <button
          className="nav-pill me-2 btn btn-link p-0"
          onClick={() => setShowInviteModal(true)}
          style={{ textDecoration: 'none', border: 'none', background: 'none' }}
        >
          <FontAwesomeIcon icon={faEnvelope} className="me-1" />
          Invite Friends
        </button>
      </div>

      <InviteUsersModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
};

export default ProfileNavigation;
