import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

export const usePostLike = () => {
  const likeOrUnlike = async (postId, liked) => {
    const endpoint = `${APP_BASE_URL}/api/posts/${postId}/like`;
    await apiFetch(endpoint, {
      method: liked ? 'DELETE' : 'POST',
    });
  };

  return { likeOrUnlike };
};
