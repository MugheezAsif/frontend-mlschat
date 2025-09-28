import React, { useState } from 'react';
import { usePostDetails } from '../hooks/usePostDetails';
import { approveGroupPost } from '../store/slices/groupsSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getRelativeTime } from '../utils/dateUtils';
import { useDispatch, useSelector } from 'react-redux';
import { handleDeletePost, handleHidePost } from '../utils/deletePost';
import { rejectGroupPost } from '../store/slices/groupsSlice';
import { useSaveToggle } from '../hooks/useSaveToggle';
import EditPostModal from './modal/EditPostModal';
import {
  faHeart as solidHeart,
  faShare,
  faEllipsis,
  faGlobe,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as regularHeart,
  faComment as regularComment,
  faBookmark as regularBookmark,
} from '@fortawesome/free-regular-svg-icons';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import './userPost.css';

const UserPost = ({ post = {}, onClick, page = 'default', groupSlug }) => {
  const isVideo = (url = '') =>
    /\.(mp4|webm|ogg|mov|m4v)$/i.test(url.split('?')[0]);

  const {
    user = {},
    created_at = '',
    content = '',
    media_urls = { others: [] },
    comment_count = 0,
    like_count = 0,
    share_count = 0,
    liked_by = false,
    saved_by = false,
    groups = [],
    id: postId,
    slug,
  } = post;

  const { toggleSave, loading: saveLoading } = useSaveToggle({ post });
  const { toggleLike } = usePostDetails(post, true, false);

  const [editingPost, setEditingPost] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const CHAR_LIMIT = 120;

  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const isOwner = currentUser?.id && user?.id && currentUser.id === user.id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Stable carousel id
  const carouselId = `post-carousel-${postId || slug || 'x'}`;

  return (
    <div id="enhanced-user-post">
      <div className="post-card p-4">
        {/* Post Header */}
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-stack">
              {groups.length > 0 && (
                <div className="group-avatar">
                  {groups[0]?.cover_url ? (
                    <img
                      src={groups[0].cover_url}
                      alt={groups[0]?.name || ''}
                      className="group-avatar-img"
                    />
                  ) : (
                    <div className="group-avatar-placeholder">
                      {(groups[0]?.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              <div className="user-avatar-container">
                <img
                  src={user?.avatar_url || '/default-avatar.png'}
                  className="user-avatar"
                  alt={`${user?.name || 'User'}'s profile`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user?.id) navigate(`/user/${user.id}`);
                  }}
                />
              </div>
            </div>

            <div className="post-meta">
              {groups.length > 0 && (
                <div className="group-info">
                  <span
                    className="group-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (groups[0]?.slug) navigate(`/groups/${groups[0].slug}`);
                    }}
                  >
                    {groups[0]?.name || 'Group'}
                  </span>
                </div>
              )}

              <div className="user-info">
                <h6 className="user-name">{user?.name || 'Unknown User'}</h6>
                <span className="time-text">
                  {created_at ? getRelativeTime(created_at) : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Post Actions Dropdown */}
          <div className="post-actions">
            <div className="dropdown">
              <button
                className="action-button"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faEllipsis} />
              </button>

              <ul className="dropdown-menu enhanced-dropdown">
                {/* Group post approval actions */}
                {page === 'post_approval' && (
                  <>
                    <li>
                      <button
                        className="dropdown-item approve-action"
                        onClick={() =>
                          dispatch(
                            approveGroupPost({
                              groupSlug,
                              postSlug: slug,
                            })
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} className="action-icon" />
                        Approve Post
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item reject-action"
                        onClick={async () => {
                          try {
                            await dispatch(rejectGroupPost({ groupSlug, postSlug: slug })).unwrap();
                          } catch (e) {
                            // Optional: local error handling; slice already toasts
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} className="action-icon" />
                        Reject Post
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                  </>
                )}

                {/* Owner-only actions */}
                {isOwner && (
                  <>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setEditingPost(post)}
                      >
                        Edit Post
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item delete-action"
                        onClick={() => handleDeletePost(dispatch, postId)}
                      >
                        Delete Post
                      </button>
                    </li>
                  </>
                )}

                {/* Non-owner action: Hide Post */}
                {!isOwner && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleHidePost(dispatch, postId, token)}
                    >
                      Hide Post
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="post-content my-3">
          <div className="post-text">
            {content?.length > CHAR_LIMIT ? (
              <p className="post-description">
                {isExpanded ? content : content.slice(0, CHAR_LIMIT) + '...'}{' '}
                <button
                  className="expand-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded((v) => !v);
                  }}
                >
                  {isExpanded ? 'See Less' : 'See More'}
                </button>
              </p>
            ) : (
              <p className="post-description">{content}</p>
            )}
          </div>

          {/* Media Content */}
          {media_urls?.others?.length === 1 && (
            <div className="post-media single-media">
              {isVideo(media_urls.others[0]) ? (
                <video
                  src={media_urls.others[0]}
                  className="media-content"
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={media_urls.others[0]}
                  className="media-content"
                  alt="Post media"
                />
              )}
            </div>
          )}
          {media_urls?.others?.length > 1 && (
            <div
              id={carouselId}
              className="carousel slide post-media carousel-media"
              data-bs-ride="carousel"
              data-bs-interval="4000"
              data-bs-touch="true"
            >
              <div className="carousel-inner">
                {media_urls.others.map((url, idx) => (
                  <div
                    key={idx}
                    className={`carousel-item ${idx === 0 ? 'active' : ''}`}
                  >
                    {isVideo(url) ? (
                      <video
                        src={url}
                        className="d-block w-100 media-content"
                        controls
                        playsInline
                        onPlay={() => {
                          const el = document.getElementById(carouselId);
                          window.bootstrap?.Carousel.getInstance(el)?.pause();
                        }}
                        onPause={() => {
                          const el = document.getElementById(carouselId);
                          window.bootstrap?.Carousel.getInstance(el)?.cycle();
                        }}
                      />
                    ) : (
                      <img
                        src={url}
                        className="d-block w-100 media-content"
                        alt={`Post media ${idx + 1}`}
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
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
        </div>

        {/* Post Stats (default page only) */}
        {page === 'default' && (
          <div className="post-stats">
            <div className="stats-container">
              <div className="interaction-buttons">
                <button
                  className="interaction-button like-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike();
                  }}
                >
                  <FontAwesomeIcon
                    icon={liked_by ? solidHeart : regularHeart}
                    className={`like-icon ${liked_by ? 'liked' : ''}`}
                  />
                  <span className="count">{like_count}</span>
                </button>

                <button className="interaction-button comment-button" onClick={onClick}>
                  <FontAwesomeIcon icon={regularComment} className="comment-icon" />
                  <span className="count">{comment_count}</span>
                </button>

                <button
                  className="interaction-button share-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FontAwesomeIcon icon={faShare} className="share-icon" />
                  <span className="count">{share_count}</span>
                </button>
              </div>

              <button
                className="save-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave();
                }}
                disabled={saveLoading}
              >
                <FontAwesomeIcon
                  icon={saved_by ? solidBookmark : regularBookmark}
                  className={`save-icon ${saved_by ? 'saved' : ''}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <EditPostModal
          open={!!editingPost}
          onClose={() => setEditingPost(null)}
          avatarUrl={user?.avatar_url}
          userName={user?.name}
          onPostCreated={(updatedPost) => {
            console.log('Post updated:', updatedPost);
          }}
          post={editingPost}
        />
      )}
    </div>
  );
};

export default UserPost;
