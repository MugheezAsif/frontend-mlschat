import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updatePost } from '../store/slices/postSlice';
import { apiFetch } from '../lib/apiClient';

export const useSaveToggle = ({ post }) => {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const { id: postId, saved_by, save_count } = post;

  const saveUrl = useMemo(() => {
    return postId ? `${APP_BASE_URL}/api/posts/${postId}/save` : null;
  }, [postId]);

  const [saved, setSaved] = useState(saved_by ? true : false);
  const [saveCount, setSaveCount] = useState(save_count || 0);
  const [loading, setLoading] = useState(false);

  const toggleSave = async () => {
    if (!saveUrl || loading) return;

    setLoading(true);
    const method = saved ? 'DELETE' : 'POST';

    try {
      await apiFetch(saveUrl, { method });

      const updatedPost = {
        ...post,
        saved_by: saved ? 0 : 1,
        save_count: saved ? saveCount - 1 : saveCount + 1,
      };

      setSaved(!saved);
      setSaveCount(saved ? saveCount - 1 : saveCount + 1);
      dispatch(updatePost(updatedPost));
    } catch (error) {
      console.error('Toggle save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { saved, saveCount, loading, toggleSave };
};
