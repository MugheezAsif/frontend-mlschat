// src/services/friendService.js
import { apiFetch } from '../lib/apiClient';

export const getPendingRequests = async () => {
  const data = await apiFetch(APP_BASE_URL + `/api/users/pending-requests`);
  return data.pending_requests || [];
};

export const getFollowings = async (userId) => {
  const data = await apiFetch(APP_BASE_URL + `/api/users/${userId}/followings`);
  return data.followings || [];
};

export const unfollowUser = async (userId) => {
  await apiFetch(APP_BASE_URL + `/api/users/${userId}/unfollow`, {
    method: 'DELETE',
  });
  return true;
};
