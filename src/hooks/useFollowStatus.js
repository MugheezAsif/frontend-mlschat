import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

export const useFollowStatus = (profileUserId) => {
  const authUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [followStatus, setFollowStatus] = useState(null);

  useEffect(() => {
    if (!authUser || authUser.id === profileUserId) return;

    apiFetch(`${APP_BASE_URL}/api/users/${profileUserId}/followers`)
      .then((data) => {
        const record = data.data.find((f) => f.follower_id === authUser.id);
        setFollowStatus(record ? record.status : null);
      })
      .catch((error) => console.error('Follow status fetch error:', error));
  }, [authUser, profileUserId]);

  const toggleFollow = () => {
    const isUnfollowing = !!followStatus;
    const endpoint = `${APP_BASE_URL}/api/users/${profileUserId}/${isUnfollowing ? 'unfollow' : 'follow'}`;
    const method = isUnfollowing ? 'DELETE' : 'POST';

    apiFetch(endpoint, { method })
      .then(() => {
        setFollowStatus((prev) => (prev ? null : 'pending'));
      })
      .catch((error) => console.error('Follow toggle error:', error));
  };

  return { followStatus, toggleFollow };
};
