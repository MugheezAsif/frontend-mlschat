import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchFriendPosts } from '../../store/slices/postSlice'; // Adjust the import path as necessary
import { useProfile } from '../../hooks/useProfile';

import ProfileStats from '../ProfileStats';
import ProfileSidebar from '../ProfileSidebar';
import ProfilePosts from '../ProfilePosts';

const ProfileTabs = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const { user } = useProfile(id);
  const posts = useSelector((state) => state.posts.friendPosts);

  useEffect(() => {
    if (id) {
      dispatch(fetchFriendPosts(id));
    }
  }, [dispatch, id]);

  if (!user) {
    return <div className="text-center py-5">Loading user and posts...</div>;
  }

  return (
    <>
      <ProfileStats user={user} />
      <div className="profile-main row">
        <div className="col-lg-4">
          <ProfileSidebar user={user} />
        </div>
        <div className="col-lg-8">
          <ProfilePosts posts={posts} />
        </div>
      </div>
    </>
  );
};

export default ProfileTabs;
