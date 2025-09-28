import React from 'react';
import { Link } from 'react-router-dom';
import FollowRequestCard from './FollowRequestCard';


const FollowingRequestsHeader = ({ badgeCount = 0, searchTerm, setSearchTerm, user, requests, handleUnfollow }) => {
    return (
        <div className="user-friends">
            <div className="card-basic">
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between">
                        <h4>Follow Requests</h4>
                        <div className="follow-request-cont d-block d-md-none position-relative">
                            <Link to="/follow_requests" className="pe-3">
                                Follow requests
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {badgeCount}
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <div className="follow-request-cont d-none d-md-block position-relative">
                            <Link to="/follow_request" className="pe-3">
                                Follow requests
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {badgeCount}
                                </span>
                            </Link>
                        </div>
                        <input
                            type="text"
                            className="search-input mt-2 mt-md-0"
                            placeholder="Search friends..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    {requests.length === 0 ? (
                        <div className="text-center py-3">You're not following anyone yet.</div>
                    ) : (
                        requests
                            .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(following => (
                                <div key={following.id} className="col-md-6 mb-3">
                                    <div className="user-card card-basic p-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div
                                                className="user-info cursor-pointer"
                                                onClick={() => navigate(`/user/${following.id}`)}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={following.avatar_url || 'images/user-profile.png'}
                                                        className="img img-fluid me-3"
                                                        alt="User"
                                                        style={{ width: 50, height: 50, borderRadius: '50%' }}
                                                    />
                                                    <div className="info">
                                                        <p className="m-0 text-black">
                                                            <strong>{following.name}</strong>
                                                        </p>
                                                        <p className="m-0">{following.user_type || 'Real Estate Agent'}</p>
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
                                                            onClick={() => navigate(`/user/${following.id}`)}
                                                        >
                                                            <i className="fa-regular fa-user me-2"></i>View Profile
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={() => handleUnfollow(following.id)}
                                                        >
                                                            <i className="fa-solid fa-user-minus me-2"></i>Unfollow
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>



            </div>
        </div>
    );
};

export default FollowingRequestsHeader;
