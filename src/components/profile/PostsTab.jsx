import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';

import { fetchUserPosts } from '../../store/slices/postSlice';

import ProfilePosts from '../ProfilePosts';

const PostsTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user } = useProfile(id); // for showing user info if needed
  const userPosts = useSelector((state) => state.posts.userPosts);

  useEffect(() => {
    dispatch(fetchUserPosts());
    console.log(userPosts, 'userPosts in PostsTab');
  }, [dispatch]);

  if (!user) {
    return <div className="text-center py-5">Loading posts…</div>;
  }

  return (
    <div className="w-100 main-cont m-auto" style={{ maxWidth: '680px' }}>
      <ProfilePosts posts={userPosts} />
    </div>
  );
};

export default PostsTab;
