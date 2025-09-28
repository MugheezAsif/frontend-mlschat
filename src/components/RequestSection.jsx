import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Follower from './requests/Follower';
import Following from './requests/Following';
import useFriendData from '../hooks/useFriendData';

function RequestSection() {
    const {
        user,
        searchTerm,
        setSearchTerm,
        showFollowing,
        setShowFollowing,
        filteredFollowers,
        filteredRequests,
        requests,
        followers,
        handleUnfollow,
        handleAccept,
        handleRemoveFollower,
    } = useFriendData();

    return (
        <div className="user-friends mt-4">
            <div className="user-friends">
                <div className="card-basic">
                    <div className="d-block d-md-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center justify-content-between">
                            <h4>{showFollowing ? 'Followers' : 'Pending Requests'}</h4>
                        </div>

                        <div className="d-flex align-items-center gap-4">
                            {showFollowing ? (
                                <div
                                    className="follow-request-cont d-none d-md-block position-relative"
                                    onClick={() => setShowFollowing(false)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="pe-3">
                                        Pending Requests
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {requests.length}
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className="follow-request-cont d-none d-md-block position-relative"
                                    onClick={() => setShowFollowing(true)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="pe-3">
                                        Followers
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {followers.length}
                                        </span>
                                    </span>
                                </div>
                            )}

                            <input
                                type="text"
                                className="search-input mt-2 mt-md-0"
                                placeholder="Search followers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {showFollowing ? (
                        <Follower
                            requests={filteredFollowers}
                            type="accepted"
                            handleUnfollow={handleRemoveFollower}
                        />
                    ) : (
                        <Follower
                            requests={filteredRequests}
                            type="pending"
                            handleUnfollow={handleUnfollow}
                            handleAccept={handleAccept} // you can pass this too
                        />
                    )}

                </div>
            </div>
        </div>
    );
}

export default RequestSection;