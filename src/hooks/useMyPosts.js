// hooks/useMyPosts.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

export const useMyPosts = () => {
  const user  = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    apiFetch(`${APP_BASE_URL}/api/posts/my`)
      .then((data) => {
        setPosts(data.posts);
        console.log('Fetched posts:', data.posts);
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [user]);

  return { posts };
};
