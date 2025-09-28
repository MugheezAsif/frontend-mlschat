import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { apiFetch } from '../lib/apiClient';

export const useLikeToggle = ({ isInitiallyLiked, initialCount, comment }) => {
  const token = useSelector((s) => s.auth.token);

  const likeUrl = useMemo(() => {
    if (!comment?.post_id || !comment?.id) return null;
    return `${APP_BASE_URL}/api/posts/${comment.post_id}/comments/${comment.id}/like`;
  }, [comment]);

  const [liked, setLiked] = useState(isInitiallyLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading || !likeUrl) return;

    setLoading(true);
    const method = liked ? 'DELETE' : 'POST';

    try {
      await apiFetch(likeUrl, { method });
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error('Toggle like failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return { liked, likeCount, loading, toggleLike };
};
