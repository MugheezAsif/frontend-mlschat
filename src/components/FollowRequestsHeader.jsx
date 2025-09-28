import React from 'react';
import { Link } from 'react-router-dom';
import FollowRequestCard from './FollowRequestCard';


const FollowRequestsHeader = ({ badgeCount = 0, searchTerm, setSearchTerm, user, requests, onAccept }) => {
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
                            <Link to="/follow_requests" className="pe-3">
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
                <div className="friends mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2">
                    {requests
                        .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(r => (
                            <FollowRequestCard
                                key={r.id}
                                user={r}
                                onAccept={onAccept}
                            />
                        ))}
                </div>



            </div>
        </div>
    );
};

export default FollowRequestsHeader;
