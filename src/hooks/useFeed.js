import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient'; // adjust path



export const useFeed = () => {
  const user   = useSelector((state) => state.auth.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    apiFetch(`${APP_BASE_URL}/api/feed`)
      .then((data) => {
        setPosts(data.data);
        console.log('Fetched posts:', data.data);
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [user]);

  // --- addNewPost (copied as-is) ---
  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return { posts, addNewPost };
};
