
import { toast } from 'react-toastify';
import { deletePostById } from '../store/slices/postSlice';
import Swal from 'sweetalert2';
import { hidePostById } from '../store/slices/postSlice';




export const handleDeletePost = async (dispatch, postId, onSuccess) => {
  if (!postId) return;

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to undo this action!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (!result.isConfirmed) return;

  try {
    await dispatch(deletePostById(postId)).unwrap();
    toast.success('Post deleted successfully');
    if (typeof onSuccess === 'function') onSuccess();
  } catch (err) {
    console.error('❌ Failed to delete post:', err.message);
    toast.error('Failed to delete post');
  }
};

export const handleHidePost = async (dispatch, postId, token, onSuccess, setModalClose) => {
  if (!postId || !token) return;

  const result = await Swal.fire({
    title: 'Hide this post?',
    text: "It will no longer be visible to you.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, hide it',
    cancelButtonText: 'Cancel',
  });

  if (!result.isConfirmed) return;

  try {
    await dispatch(hidePostById(postId)).unwrap();
    toast.success('Post hidden successfully');
    if (typeof onSuccess === 'function') onSuccess();
    if (typeof setModalClose === 'function') setModalClose();
  } catch (err) {
    console.error('❌ Error hiding post:', err.message);
    toast.error('Failed to hide post');
  }
};


