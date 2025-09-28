import React, { useState } from 'react';
import CreatePostModal from './modal/CreatePostModal';
import imagesIcon from '../assets/icons/images-icon.png';
import videosIcon from '../assets/icons/videos-icon.png';
import listingsIcon from '../assets/icons/listings-icon.png';
import { useNavigate } from 'react-router-dom';

const MindSection = ({ user, onPostCreated, page, slug, group }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoTrigger, setAutoTrigger] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="mind-section card-basic">
      <div className="top">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <img src={user.avatar_url} className="rounded-circle img-fluid nav-profile" alt="Profile" />
          </div>
          <div className="flex-grow-1">
            <input
              type="text"
              placeholder="What’s on your mind?"
              className="form-control"
              onClick={() => setIsModalOpen(true)}
              readOnly
            />
          </div>
        </div>
      </div>

      <hr className="mt-4" />

      <div className="bottom">
        <div className="px-1 px-md-5">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn-simple" onClick={() => { setAutoTrigger('photo'); setIsModalOpen(true); }}>
              <img src={imagesIcon} alt="" />
              <span className="ms-1">Photo</span>
            </button>
            <button className="btn-simple" onClick={() => { setAutoTrigger('video'); setIsModalOpen(true); }}>
              <img src={videosIcon} alt="" />
              <span className="ms-1">Video</span>
            </button>
            <button className="btn-simple" onClick={() => navigate('/listings')}>
              <img src={listingsIcon} alt="" />
              <span className="ms-1">Listings</span>
            </button>
          </div>
        </div>
      </div>



      <CreatePostModal
        slug={slug}
        page={page}
        open={isModalOpen}
        onClose={setIsModalOpen}
        avatarUrl={user.avatar_url}
        userName={user.name}
        onPostCreated={onPostCreated}
        group={group}
        autoTrigger={autoTrigger}
      />

    </div>
  );
};

export default MindSection;
