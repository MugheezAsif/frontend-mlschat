import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileNavigation from '../components/ProfileNavigation';
import UserPhotos from '../components/UserPhotos';
import { apiFetch } from '../lib/apiClient';

const Photos = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (!user) return;

    apiFetch(APP_BASE_URL + `/api/users/pending-requests`)
      .then(data => setRequests(data.pending_requests))
      .catch(err => console.error('Error fetching pending requests:', err));

    apiFetch(APP_BASE_URL + `/api/users/${user.id}/followings`)
      .then(data => setFollowings(data.followings))
      .catch(err => console.error('Error fetching followings:', err));
  }, [user]);

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !token) return;

    try {
      setUploading(true);

      // Step 1: Get presigned URL
      const { upload_url, public_url } = await apiFetch(APP_BASE_URL + '/api/media/presign', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          type: file.type,
        }),
      });

      // Step 2: Upload file to S3
      await fetch(upload_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      // Step 3: Update user profile with new cover photo
      await apiFetch(APP_BASE_URL + `/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          cover_photo_url: public_url,
        }),
      });

      // Refresh or update UI
      window.location.reload();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Cover photo update failed.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="text-center py-5">Please log in to view your followings.</div>;

  return (
    <div>
      <div className="d-none d-md-block py-5" />

      <div className="main py-4">
        <div className="container">
          {/* Profile Header */}
          <div className="profile-top">
            <div className="position-relative profile-covers">
              <img
                src={user.cover_photo_url || 'images/profile-bg.png'}
                className="img-fluid profile-cover rounded"
                alt="Cover"
              />

              {/* Hidden file input */}
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverChange}
              />

              <button
                className="btn btn-light position-absolute z-3 bottom-0 end-0 m-3"
                onClick={() => document.getElementById('cover-upload').click()}
                disabled={uploading}
              >
                <i className="fa-solid fa-camera"></i> {uploading ? 'Uploading...' : 'Edit Cover Photo'}
              </button>
            </div>

            <div className="profile-info position-relative z-2" style={{ marginTop: '-3.5rem' }}>
              <div className="d-block d-md-flex align-items-center justify-content-between">
                <div className="profile-image p-2">
                  <div className="d-block d-md-flex align-items-center gap-3">
                    <div className="img-cont">
                      <img
                        src={user.avatar_url || 'images/profile.png'}
                        className="img-fluid profile-main-img"
                        alt="Profile"
                      />
                    </div>
                    <div className="info-cont pt-0 pt-md-5 mt-0 mt-md-2">
                      <h4>{user.name}</h4>
                      <p>{user.location || 'User Location'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProfileNavigation user={user} />
          <UserPhotos/>
        </div>
      </div>
    </div>
  );
};

export default Photos;
