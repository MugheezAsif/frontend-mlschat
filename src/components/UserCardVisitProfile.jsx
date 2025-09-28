import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Check } from 'lucide-react';
import './friendCard.css';

const UserCardVisitProfile = ({ user, onFollow, isFollowing = false }) => {
  return (
    <div className="facebook-friend-card">
      <div className="friend-avatar-container">
        <img
          src={user.avatar_url || '/default-avatar.png'}
          className="friend-avatar"
          alt={`${user.name}'s profile`}
        />
      </div>

      <div className="friend-info">
        <h4 className="friend-name">{user.name}</h4>
        <p className="friend-mutual">Real Estate Professional</p>
      </div>

      <div className="friend-actions">
        <Link
          to={`/user/${user.id}`}
          className="btn-view-profile"
        >
          View Profile
        </Link>
        

      </div>
    </div>
  );
};

export default UserCardVisitProfile;
