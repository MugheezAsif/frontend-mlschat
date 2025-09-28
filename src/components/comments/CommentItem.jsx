import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faThumbsUp, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getRelativeTime } from '../../utils/dateUtils';
import { useLikeToggle } from '../../hooks/useLikeToggle';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../store/slices/postSlice';
import { handleEditComment, handleDeleteComment, handleHideComment } from '../../utils/commentActions';
import { toast } from 'react-toastify';
import { apiFetch } from '../../lib/apiClient';

const CommentItem = ({ comment, post, setPost }) => {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const authedUser = useSelector((s) => s.auth.user) || {};

  const {
    liked,
    likeCount,
    loading,
    toggleLike,
  } = useLikeToggle({
    isInitiallyLiked: comment.liked_by === 1,
    initialCount: comment.like_count,
    comment,
  });

  const isOwnerOfComment = authedUser?.id === comment?.user?.id;
  const isOwnerOfPost = authedUser?.id === post?.user?.id;
  const isPendingComment = comment?.approved === 'not_approved';
  const isApprovedComment = comment?.approved === 'approved';

  // ---- helpers to keep modal state + redux in sync ----
  const applyPostUpdate = (updater) => {
    setPost((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // Push to Redux so feed/user lists stay in sync
      dispatch(updatePost(next));
      return next;
    });
  };

  const onEdit = () => {
    handleEditComment(
      comment.id,
      comment.post_id,
      comment.text, // or open input UI to pass new text
      (updated) => {
        if (!updated) return;
        applyPostUpdate((prev) => {
          const list = (prev.comments || []).map((c) =>
            c.id === updated.id ? { ...c, ...updated } : c
          );
          return { ...prev, comments: list };
        });
      }
    );
  };

  const onDelete = () => {
    handleDeleteComment(
      comment.id,
      comment.post_id,
      () => {
        applyPostUpdate((prev) => {
          const list = (prev.comments || []).filter((c) => c.id !== comment.id);
          const newCount = Math.max(0, (prev.comment_count || 0) - 1);
          return { ...prev, comments: list, comment_count: newCount };
        });
      }
    );
  };

  const onHide = () => {
    handleHideComment(
      comment.id,
      comment.post_id,
      () => {
        // Treat hide as a local removal from the list (for viewer)
        applyPostUpdate((prev) => {
          const list = (prev.comments || []).filter((c) => c.id !== comment.id);
          // Usually hide shouldn't change total count on server; we won't decrement count here.
          return { ...prev, comments: list };
        });
      }
    );
  };

  const onApprove = async () => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/posts/${comment.post_id}/comments/${comment.id}/approve`, {
        method: 'POST',
      });

      if (data.success) {
        toast.success('Comment approved');
        applyPostUpdate((prev) => {
          const list = (prev.comments || []).map((c) =>
            c.id === comment.id ? { ...c, approved: 'approved' } : c
          );
          const newCount = prev.comment_count + 1;
          return { ...prev, comments: list, comment_count: newCount };
        });
      } else {
        throw new Error(data.message || 'Failed to approve comment');
      }
    } catch (err) {
      console.error('Failed to approve comment:', err.message);
      toast.error('Failed to approve comment');
    }
  };

  const onReject = async () => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/posts/${comment.post_id}/comments/${comment.id}/reject`, {
        method: 'POST',
      });

      if (data.success) {
        toast.success('Comment rejected');
        applyPostUpdate((prev) => {
          const list = (prev.comments || []).map((c) =>
            c.id === comment.id ? { ...c, approved: 'rejected' } : c
          );
          return { ...prev, comments: list };
        });
      } else {
        throw new Error(data.message || 'Failed to reject comment');
      }
    } catch (err) {
      console.error('Failed to reject comment:', err.message);
      toast.error('Failed to reject comment');
    }
  };

  return (
    <div className="comment mb-3">
      <div className="d-flex gap-3">
        <img
          src={comment?.user?.avatar_url || '/default-avatar.png'}
          className="img-fluid comment-img"
          alt={comment?.user?.name || 'User'}
        />

        <div className="comment-cont">
          <div className="info">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <p className="text-black m-0">
                  <strong>{comment?.user?.name || 'User'}</strong>
                </p>
                {isPendingComment && (
                  <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                    Pending
                  </span>
                )}
                {comment?.approved === 'rejected' && (
                  <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>
                    Rejected
                  </span>
                )}
              </div>

              <div className="comment-actions">
                <div className="d-inline-block" data-bs-toggle="dropdown">
                  <p className="m-0">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </p>
                  <ul className="dropdown-menu">
                    {isOwnerOfPost && isPendingComment && (
                      <>
                        <li>
                          <button className="dropdown-item text-success" onClick={onApprove}>
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            Approve
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item text-danger" onClick={onReject}>
                            <FontAwesomeIcon icon={faTimes} className="me-2" />
                            Reject
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                      </>
                    )}
                    
                    {isOwnerOfComment && isApprovedComment && (
                      <li>
                        <button className="dropdown-item" onClick={onEdit}>
                          Edit
                        </button>
                      </li>
                    )}
                    {isOwnerOfComment && isApprovedComment && (
                      <li>
                        <button className="dropdown-item text-danger" onClick={onDelete}>
                          Delete
                        </button>
                      </li>
                    )}
                    {isOwnerOfPost && isApprovedComment && (
                      <li>
                        <button className="dropdown-item" onClick={onHide}>
                          Hide
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <p className="m-0">{comment.text}</p>
          </div>

          <div className="comment-stats w-100 mt-1">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <p className="m-0">{getRelativeTime(comment.created_at)}</p>
                <button
                  onClick={toggleLike}
                  disabled={loading}
                  className="btn btn-sm btn-link text-primary p-0"
                >
                  {liked ? 'Unlike' : 'Like'}
                </button>
              </div>
              <p className="m-0 like-count">
                {likeCount} <FontAwesomeIcon icon={faThumbsUp} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    like_count: PropTypes.number.isRequired,
    liked_by: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      avatar_url: PropTypes.string.isRequired,
    }).isRequired,
    post_id: PropTypes.number.isRequired,
  }).isRequired,
  post: PropTypes.shape({
    id: PropTypes.number,
    user: PropTypes.shape({ id: PropTypes.number }),
    comments: PropTypes.array,
    comment_count: PropTypes.number,
  }),
  setPost: PropTypes.func.isRequired,
};

export default CommentItem;
