import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import NavbarTop from '../components/NavbarTop';
import NavbarMobile from '../components/NavbarMobile';
import { Link } from 'react-router-dom';
import ProfileNavigation from '../components/ProfileNavigation';
import ProfilePosts from '../components/ProfilePosts';
import { useMyPosts } from '../hooks/useMyPosts';



const MyPost = () => {
    const user = useSelector((state) => state.auth.user);
    const { posts } = useMyPosts(); 
    
    const navigate = useNavigate();

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
                            <button className="btn btn-light position-absolute z-3 bottom-0 end-0 m-3">
                                <i className="fa-solid fa-camera"></i> Edit Cover Photo
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
                    <div className="w-100 main-cont m-auto" style={{ maxWidth: '680px' }}>
                    <ProfilePosts
                        posts={posts}
                    />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default MyPost;

