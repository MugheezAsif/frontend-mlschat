import React from 'react';

const UserPhotos = () => {
  const imageUrls = [
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1565402170291-8491f14678db?q=80&w=3639&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1678903964473-1271ecfb0288?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <div className="user-friends">
      <div className="card-basic">
        <div className="d-flex align-items-center justify-content-between">
          <h4>Your Photos</h4>
          <div className="follow-request-cont">
            <a href="#" className="pe-3">Upload Photo</a>
          </div>
        </div>
        <div className="your-photos">
          <div className="d-flex flex-wrap">
            {imageUrls.map((url, index) => (
              <div key={index} className="image-cont m-2">
                <img src={url} className="img-fluid rounded" alt={`User photo ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPhotos;
