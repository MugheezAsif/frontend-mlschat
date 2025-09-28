import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePostDetails } from '../../hooks/usePostDetails';
import '../../assets/showPostModal.css';
import PostComments from '../comments/PostComments';
import {
  faHeart as solidHeart,
  faShare,
  faEllipsis,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { useSaveToggle } from '../../hooks/useSaveToggle';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as regularHeart,
  faComment as regularComment,
  faBookmark as regularBookmark,
} from '@fortawesome/free-regular-svg-icons';

import { handleDeletePost, handleHidePost } from '../../utils/deletePost';

const ShowPostModal = ({ open, onClose, postId, post }) => {
  const dispatch = useDispatch();
  const authedUser = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);

  // Pull live post details (likes/comments updates, etc.)
  const {
    currentPost,
    liked,
    likeCount,
    loading,
    newComment,
    setNewComment,
    toggleLike,
    submitComment,
    setCurrentPost,
  } = usePostDetails(post, open);

  const {
    saved,
    loading: saveLoading,
    toggleSave,
  } = useSaveToggle({ post: currentPost });

  // ---- Safety fallbacks to avoid runtime errors ----
  const safeUser = currentPost?.user || {};
  const {
    id: cpId,
    content = '',
    created_at = '',
    media_urls = { others: [] },
    comment_count = 0,
    share_count = 0,
    comment_permission = 'no_approval',
  } = currentPost || {};

  const isOwner = authedUser?.id && safeUser?.id && authedUser.id === safeUser.id;

  // video helper
  const isVideo = (url = '') => /\.(mp4|webm|ogg|mov|m4v)$/i.test((url || '').split('?')[0]);

  // Single place to submit comment
  const handleCommentSubmit = () => {
    submitComment(newComment).then((ok) => ok && setNewComment(''));
  };

  if (!open) return null;
  if (loading) return null;

  // Stable carousel id
  const carouselId = `show-post-carousel-${cpId || postId || 'x'}`;

  const mediaList = Array.isArray(media_urls?.others) ? media_urls.others : [];

  return (
    <>
      <div
        className="modal modal-lg fade show d-block"
        tabIndex={-1}
        aria-labelledby="postDetailModalLabel"
        aria-hidden="true"
        id="postDetailsModal"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable border-0">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="postDetailModalLabel">Post</h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body p-0 m-0">
              <div className="card-basic post-card border-0 mt-0 mb-0">
                <div className="user-post my-4">
                  {/* Header / meta */}
                  <div className="post-profile-badge">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <Link to={safeUser?.id ? `/user/${safeUser.id}` : '#'}>
                          <img
                            src={safeUser?.avatar_url || '/default-avatar.png'}
                            className="img-fluid"
                            alt={safeUser?.name || 'User'}
                            style={{ cursor: safeUser?.id ? 'pointer' : 'default' }}
                          />
                        </Link>

                        <div className="info-cont ms-2">
                          <h6 className="name mb-0">
                            {safeUser?.id ? (
                              <Link
                                to={`/user/${safeUser.id}`}
                                className="text-decoration-none text-dark"
                              >
                                {safeUser?.name || 'User'}
                              </Link>
                            ) : (
                              <span>{safeUser?.name || 'User'}</span>
                            )}
                          </h6>
                          <p className="time mb-0">
                            {created_at ? getRelativeTime(created_at) : ''}
                          </p>
                        </div>
                      </div>

                      {/* Dropdown: owner gets Delete + Hide; non-owner gets Hide */}
                      <div className="post-settings">
                        <div className="dropdown d-inline-block">
                          <button
                            className="btn-simple"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <FontAwesomeIcon icon={faEllipsis} />
                          </button>

                          <ul className="dropdown-menu">
                            {isOwner ? (
                              <>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() =>
                                      handleDeletePost(dispatch, cpId, onClose)
                                    }
                                  >
                                    Delete Post
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleHidePost(dispatch, cpId, token, null, onClose)
                                    }
                                  >
                                    Hide Post
                                  </button>
                                </li>
                              </>
                            ) : (
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    handleHidePost(dispatch, cpId, token, null, onClose)
                                  }
                                >
                                  Hide Post
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="post-details mt-3">
                    <div className="post-description">
                      <p>{content}</p>
                    </div>

                    {/* Media: support image/video and carousel for multiple */}
                    {mediaList.length === 1 && (
                      <div className="post-images">
                        {isVideo(mediaList[0]) ? (
                          <video
                            src={mediaList[0]}
                            className="img-fluid rounded w-100"
                            controls
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={mediaList[0]}
                            className="img-fluid rounded w-100"
                            alt="Post"
                          />
                        )}
                      </div>
                    )}

                    {mediaList.length > 1 && (
                      <div
                        id={carouselId}
                        className="carousel slide post-images"
                        data-bs-ride="carousel"
                        data-bs-interval="4000"
                      >
                        <div className="carousel-inner">
                          {mediaList.map((url, idx) => (
                            <div
                              key={idx}
                              className={`carousel-item ${idx === 0 ? 'active' : ''}`}
                            >
                              {isVideo(url) ? (
                                <video
                                  src={url}
                                  className="d-block w-100 rounded"
                                  controls
                                  playsInline
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={url}
                                  className="d-block w-100 rounded"
                                  alt=""
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target={`#${carouselId}`}
                          data-bs-slide="prev"
                        >
                          <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                          />
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target={`#${carouselId}`}
                          data-bs-slide="next"
                        >
                          <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                          />
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="post-stats mt-2">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-1">
                        <button className="btn-simple" onClick={toggleLike}>
                          <FontAwesomeIcon
                            icon={liked ? solidHeart : regularHeart}
                            className={liked ? 'text-danger' : ''}
                          />
                          <span className="ms-1">{likeCount}</span>
                        </button>

                        <button className="btn-simple" onClick={(e) => e.stopPropagation()}>
                          <FontAwesomeIcon icon={regularComment} />
                          <span className="ms-1">{comment_count || 0}</span>
                        </button>

                        <button className="btn-simple" onClick={(e) => e.stopPropagation()}>
                          <FontAwesomeIcon icon={faShare} />
                          <span className="ms-1">{share_count || 0}</span>
                        </button>
                      </div>

                      <button
                        className="btn-simple"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave();
                        }}
                        disabled={saveLoading}
                      >
                        <FontAwesomeIcon icon={saved ? solidBookmark : regularBookmark} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="px-3">
                <hr className="mt-0" />
                <PostComments
                  comments={currentPost?.comments || []}
                  post={currentPost}
                  setPost={setCurrentPost}
                />
              </div>
            </div>

            {comment_permission !== 'no_comment' && (
              <div className="modal-footer d-block">
                <div className="add-comment-cont">
                  <div className="d-flex gap-2">
                    <img
                      src={authedUser?.avatar_url || '/default-avatar.png'}
                      className="img-fluid profile-img"
                      alt={authedUser?.name || 'Me'}
                    />
                    <div className="position-relative w-100">
                      <input
                        type="text"
                        className="form-control pe-5"
                        placeholder={`Comment as ${authedUser?.name || 'you'}`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                      />
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="position-absolute input-submit-icon top-50 end-0 translate-middle-y me-3"
                        onClick={handleCommentSubmit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default ShowPostModal;

