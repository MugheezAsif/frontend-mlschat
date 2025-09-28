// src/components/ProfileHeader.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMessage, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useFollowStatus } from '../hooks/useFollowStatus';
import { useDispatch } from 'react-redux';
import { createPrivateConversation } from '../store/slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import EditCoverPhotoModal from './modal/EditCoverPhotoModal';
import EditProfilePhotoModal from './modal/EditProfilePhotoModal';

const ProfileHeader = ({ user, setUser, onUserUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const { followStatus, toggleFollow } = useFollowStatus(user.id);
  const token = useSelector((s) => s.auth.token);
  const FALLBACK_COVER =
    "https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop";

  const FALLBACK_AVATAR =
    "https://images.unsplash.com/photo-1683029096295-7680306aa37d?q=80&w=3264&auto=format&fit=crop";


  if (!user) return null;

  const renderButton = () => {
    if (!authUser || authUser.id === user.id) return null;

    let buttonText = 'Follow';
    let buttonClass = 'btn-solid';

    if (followStatus === 'pending') {
      buttonText = 'Requested';
      buttonClass = 'btn-secondary';
    } else if (followStatus === 'accepted') {
      buttonText = 'Following';
      buttonClass = 'btn-secondary';
    }

    return (
      <>
        <button className={`btn-main ${buttonClass} me-2`} onClick={toggleFollow}>
          <FontAwesomeIcon icon={faUserPlus} className="me-1" />
          {buttonText}
        </button>

        {followStatus === 'accepted' && (
          <button className="btn-main btn-secondary" onClick={handleMessage}>
            <FontAwesomeIcon icon={faMessage} className="me-1" /> Message
          </button>
        )}
      </>
    );
  };

  const [showCoverModal, setShowCoverModal] = useState(false);

  const handleCoverUpload = (file) => {
    // TODO: Upload logic (e.g., presigned URL, direct upload, etc.)
    console.log('Uploading cover photo:', file);
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleProfileUpload = (croppedResult) => {
    console.log('Cropped profile image:', croppedResult);
    // 🔁 You can send `croppedResult.blob` to backend and update avatar
  };

  const handleMessage = async () => {
    try {
      const resultAction = await dispatch(createPrivateConversation(user.id)).unwrap();
      const convoId = resultAction.id;

      if (convoId) {
        navigate(`/messenger?convo_id=${convoId}`);
      } else {
        console.warn("No conversation ID returned from server.");
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  return (
    <div className="profile-top">
      <div className="position-relative profile-covers">
        <img
          src={user.cover_photo_url || FALLBACK_COVER}
          className="img-fluid profile-cover rounded"
          alt="Cover"
        />

        {authUser?.id === user.id && (
          <button
            className="btn btn-light position-absolute z-3 bottom-0 end-0 m-3"
            onClick={() => setShowCoverModal(true)}
          >
            <FontAwesomeIcon icon={faCamera} /> Edit Cover Photo
          </button>
        )}

        <EditCoverPhotoModal
          show={showCoverModal}
          handleClose={() => setShowCoverModal(false)}
          onSave={handleCoverUpload}
          onUserUpdate={onUserUpdate}

        />
      </div>

      <div className="profile-info position-relative z-2" style={{ marginTop: '-3.5rem' }}>
        <div className="d-block d-md-flex align-items-center justify-content-between">
          <div className="profile-image p-2">
            <div className="d-block d-md-flex align-items-center gap-3">
              <div className="position-relative">
                <div className="img-cont">
                  <img
                    src={user.avatar_url || FALLBACK_AVATAR}
                    className="img-fluid profile-main-img"
                    alt="Profile"
                  />
                </div>
                {authUser?.id === user.id && (
                  <button
                    className="btn btn-light btn-sm position-absolute bottom-0 end-0 translate-middle rounded-circle shadow-sm"
                    onClick={() => setShowProfileModal(true)}
                    title="Edit Profile Picture"
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                )}
              </div>
              <EditProfilePhotoModal
                show={showProfileModal}
                handleClose={() => setShowProfileModal(false)}
                onSave={handleProfileUpload}
                token={token}
                onUserUpdate={onUserUpdate}
              />
              <div className="info-cont pt-0 pt-md-5 mt-0 mt-md-2">
                <h4>{user.name}</h4>
                <p>{user.location || 'User Location'}</p>
              </div>
            </div>
          </div>
          <div className="profile-actions pt-0 pt-md-5 mt-0 mt-md-2">
            {renderButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
