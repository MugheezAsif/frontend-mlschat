import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';

import { fetchSavedPosts } from '../../store/slices/postSlice';

import ProfilePosts from '../ProfilePosts';

const SavedPostsTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user } = useProfile(id);
  const savedPosts = useSelector((state) => state.posts.savedPosts);

  useEffect(() => {
    dispatch(fetchSavedPosts());
    console.log(savedPosts, 'savedPosts in SavedPostsTab');
  }, [dispatch]);

  if (!user) {
    return <div className="text-center py-5">Loading saved posts…</div>;
  }

  return (
    <div className="w-100 main-cont m-auto" style={{ maxWidth: '680px' }}>
      <ProfilePosts posts={savedPosts} />
    </div>
  );
};

export default SavedPostsTab; 