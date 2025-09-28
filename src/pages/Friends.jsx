import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import UserCardVisitProfile from '../components/UserCardVisitProfile';
import { useNonFollowers } from '../hooks/useNonFollowers';
import SearchInputCard from '../components/SearchInputCard';
import '../pages/Frontend/frontend.css';

const Friends = () => {
    const user = useSelector((state) => state.auth.user);
    const { nonFollowers, followUser } = useNonFollowers();
    const [searchTerm, setSearchTerm] = useState('');


    if (!user) return (
        <div className="min-vh-100 bg-gradient-to-br from-slate-50 to-purple-50 py-5">
            <div className="container-xl">
                <div className="text-center py-5">
                    <div className="display-1 mb-3">🔒</div>
                    <h2 className="gradient-text">Please Log In</h2>
                    <p className="text-slate-600">You need to be logged in to view friend suggestions.</p>
                </div>
            </div>
        </div>
    );

    const filteredUsers = nonFollowers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-vh-100 bg-light py-4">
            <div className="container">
                    {/* Header Section */}
                    <div className="text-center mb-4">
                        <h1 className="h3 fw-bold mb-2" style={{color: '#333'}}>
                            People You May Know
                        </h1>
                        <p className="text-muted mb-0">
                            Discover and connect with real estate professionals
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="mb-4">
                        <div className="card">
                            <div className="card-body p-3">
                                <SearchInputCard
                                    placeholder="Search for users by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {searchTerm && (
                        <div className="mb-3 d-flex align-items-center justify-content-between">
                            <span className="text-muted">
                                {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} found
                            </span>
                            <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setSearchTerm('')}
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Users Grid */}
                    {filteredUsers.length > 0 ? (
                        <div className="row g-3">
                            {filteredUsers.map((user, index) => (
                                <div 
                                    key={user.id} 
                                    className="col-lg-3 col-md-4 col-sm-6"
                                >
                                    <UserCardVisitProfile
                                        user={user}
                                        onFollow={() => followUser(user.id)}
                                        isFollowing={false}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : searchTerm ? (
                        <div className="text-center py-4">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h5 className="mb-2" style={{color: '#333'}}>No Results Found</h5>
                                    <p className="text-muted mb-3">
                                        No users found matching "{searchTerm}".
                                    </p>
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="card">
                                <div className="card-body p-4">
                                    <h5 className="mb-2" style={{color: '#333'}}>No Suggestions Available</h5>
                                    <p className="text-muted mb-0">
                                        We don't have any friend suggestions for you right now.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

            </div>
        </div>
    );
};

export default Friends;