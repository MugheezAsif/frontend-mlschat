// hooks/useNonFollowers.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

export const useNonFollowers = () => {
  const user  = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [nonFollowers, setNonFollowers] = useState([]);

  useEffect(() => {
    if (!user) return;

    apiFetch(`${APP_BASE_URL}/api/users/non-followers`)
      .then((data) => setNonFollowers(data.data))
      .catch((err) => console.error('Error fetching non-followers:', err));
  }, [user]);

  const followUser = (userId) => {
    apiFetch(`${APP_BASE_URL}/api/users/follow/${userId}`, {
      method: 'POST',
    })
      .then(() => {
        setNonFollowers((prev) => prev.filter((u) => u.id !== userId));
      })
      .catch((err) => console.error('Follow error:', err));
  };

  return { nonFollowers, followUser };
};
