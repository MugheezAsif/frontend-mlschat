import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../store/slices/postSlice';
import { apiFetch } from '../lib/apiClient';

export const usePostDetails = (initialPost, isOpen, shouldFetch = true) => {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);

  const [currentPost, setCurrentPost] = useState(initialPost);
  const [liked, setLiked] = useState(initialPost.liked_by === 1);
  const [likeCount, setLikeCount] = useState(initialPost.like_count);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');

  const toggleLike = async () => {
    const endpoint = `${APP_BASE_URL}/api/posts/${currentPost.id}/like`;
    await apiFetch(endpoint, {
      method: liked ? 'DELETE' : 'POST',
    });

    const updatedLikeCount = liked ? likeCount - 1 : likeCount + 1;
    const updatedPost = {
      ...currentPost,
      liked_by: liked ? 0 : 1,
      like_count: updatedLikeCount,
    };

    setLiked(!liked);
    setLikeCount(updatedLikeCount);
    setCurrentPost(updatedPost);
    dispatch(updatePost(updatedPost));
  };

  useEffect(() => {
    if (!isOpen || !currentPost.id || !shouldFetch) return;
    setLoading(true);
    apiFetch(`${APP_BASE_URL}/api/posts/${currentPost.id}`)
      .then((d) => {
        setCurrentPost(d.data);
        setLiked(d.data.liked_by === 1);
        setLikeCount(d.data.like_count);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen, currentPost?.id]);

  const submitComment = async (text) => {
    if (!text.trim()) return false;
    
    if (currentPost.comment_permission === 'no_comment') {
      return false;
    }
    
    const result = await apiFetch(
      `${APP_BASE_URL}/api/posts/${currentPost.id}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      }
    );
    if (result.success) {
      result.data.user = user;
      result.data['like_count'] = 0;
      
      const shouldIncrementCount = result.data.approved === 'approved';
      
      const updatedPost = {
        ...currentPost,
        comments: [...(currentPost.comments || []), result.data],
        comment_count: shouldIncrementCount ? (currentPost.comment_count || 0) + 1 : (currentPost.comment_count || 0),
      };

      setCurrentPost(updatedPost);
      dispatch(updatePost(updatedPost));
      return true;
    }
    return false;
  };

  return {
    currentPost,
    liked,
    likeCount,
    loading,
    newComment,
    setNewComment,
    toggleLike,
    submitComment,
    setCurrentPost
  };
};
