import React from 'react';
import { useNavigate } from 'react-router-dom';

function Follower({ requests, handleUnfollow, type, handleAccept }) {
  console.log('Requests:', requests);
  const navigate = useNavigate();

  return (
    <div className="row">
      {requests.length === 0 ? (
        <div className="text-center py-3">You have no follower requests yet.</div>
      ) : (
        requests.map(request => (
          <div key={request.id} className="col-md-6 mb-3">
            <div className="user-card card-basic p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="user-info cursor-pointer"
                  onClick={() => navigate(`/user/${request.follower?.id}`)}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={request.follower?.avatar_url || 'images/user-profile.png'}
                      className="img img-fluid me-3"
                      alt="User"
                      style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                    <div className="info">
                      <p className="m-0 text-black">
                        <strong>{request.follower?.name}</strong>
                      </p>
                      <p className="m-0">
                        {request.follower?.user_type || 'Real Estate Agent'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-light dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => navigate(`/user/${request.follower?.id}`)}
                      >
                        <i className="fa-regular fa-user me-2"></i>View Profile
                      </button>
                    </li>

                    {type === 'accepted' && (
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleUnfollow(request.follower?.id)}
                        >
                          <i className="fa-solid fa-user-minus me-2"></i>Remove Follower
                        </button>
                      </li>
                    )}

                    {type === 'pending' && (
                      <li>
                        <button
                          className="dropdown-item text-success"
                          onClick={() => handleAccept(request.follower?.id)}
                        >
                          <i className="fa-solid fa-user-check me-2"></i>Accept Request
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Follower;
