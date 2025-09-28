import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { apiFetch } from '../lib/apiClient';

export const handleDeleteComment = async (commentId, postId, onSuccess) => {
  const result = await Swal.fire({
    title: 'Delete this comment?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
  });

  if (!result.isConfirmed) return;

  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (data.success) {
      toast.success('Comment deleted');
      if (typeof onSuccess === 'function') onSuccess();
    } else {
      throw new Error(data.message || 'Failed to delete');
    }
  } catch (err) {
    console.error('❌ Failed to delete comment:', err.message);
    toast.error('Failed to delete comment');
  }
};

export const handleHideComment = async (commentId, postId, onSuccess) => {
  const result = await Swal.fire({
    title: 'Hide this comment?',
    text: 'This comment will no longer be visible on your post.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, hide it',
  });

  if (!result.isConfirmed) return;

  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/posts/${postId}/comments/${commentId}/hide`, {
      method: 'POST',
    });

    if (data.success) {
      toast.success('Comment hidden');
      if (typeof onSuccess === 'function') onSuccess();
    } else {
      throw new Error(data.message || 'Failed to hide');
    }
  } catch (err) {
    console.error('❌ Failed to hide comment:', err.message);
    toast.error('Failed to hide comment');
  }
};

export const handleEditComment = async (commentId, postId, currentText, onSuccess) => {
  const { value: newText } = await Swal.fire({
    title: 'Edit Comment',
    input: 'textarea',
    inputLabel: 'Update your comment',
    inputValue: currentText,
    showCancelButton: true,
    confirmButtonText: 'Save changes',
  });

  if (!newText) return;

  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ text: newText }),
    });

    if (data.success) {
      toast.success('Comment updated');
      if (typeof onSuccess === 'function') onSuccess(data.data);
    } else {
      throw new Error(data.message || 'Failed to update comment');
    }
  } catch (err) {
    console.error('❌ Failed to update comment:', err.message);
    toast.error('Failed to update comment');
  }
};
