import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

export const useProfile = (userId) => {
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    apiFetch(`${APP_BASE_URL}/api/users/${userId}`)
      .then((data) => {
        setUser(data.data);
      })
      .catch((err) => console.error('Error fetching user:', err));

    apiFetch(`${APP_BASE_URL}/api/users/${userId}/posts`)
      .then((data) => {
        setPosts(data.data);
      })
      .catch((err) => console.error('Error fetching posts:', err));
  }, [userId]);

  return { user, posts, setUser };
};
