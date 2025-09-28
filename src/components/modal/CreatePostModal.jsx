import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useCreatePost } from '../../hooks/useCreatePost';
import '../../modal.css';

const CreatePostModal = ({ open, onClose, userName, avatarUrl, onPostCreated, page, slug, group, autoTrigger }) => {
  const {
    mediaPreviews,
    uploading,
    postContent,
    visibility,
    commentPermission,
    setPostContent,
    setVisibility,
    setCommentPermission,
    handleMediaChange,
    handleDeleteImage,
    handleSavePost,
  } = useCreatePost(onPostCreated, onClose, page, slug, group);

  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (autoTrigger === 'photo' && fileInputRef.current) {
      // delay to ensure modal fully mounted
      setTimeout(() => fileInputRef.current && fileInputRef.current.click(), 100);
    }
    if (autoTrigger === 'video' && videoFileInputRef.current) {
      setTimeout(() => videoFileInputRef.current && videoFileInputRef.current.click(), 100);
    }
  }, [open, autoTrigger]);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const syntheticEvent = {
      target: {
        files: files
      }
    };

    handleMediaChange(syntheticEvent);
  };

  if (!open) return null;

  function formatVisibility(value) {
    return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  }

  function formatCommentPermission(value) {
    switch(value) {
      case 'no_approval':
        return 'No Approval Required';
      case 'approval_required':
        return 'Approval Required';
      case 'no_comment':
        return 'No Comments';
      default:
        return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    }
  }

  const disableSave =
    uploading ||
    (postContent.trim().length === 0 && mediaPreviews.length === 0) ||
    mediaPreviews.some((p) => (p.progress ?? 0) < 100);

  return (
    <div
      className="modal fade show d-block"
      id="createPostModal"
      tabIndex={-1}
      aria-labelledby="createPostModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered border-0">
        <div className="modal-content border-0 p-2">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="createPostModalLabel">Create Post</h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onClose(false)}
              disabled={uploading}
            />
          </div>

          <div 
            className={`modal-body ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="user-info d-flex align-items-center">
              <img src={avatarUrl} className="img-fluid user-profile" alt="Profile" />
              <div className="info-cont ms-3">
                <h6 className="name mb-1">{userName}</h6>
                <div className="d-flex gap-2 flex-wrap">
                  <div className="dropdown">
                    <span className="visibility-badge dropdown-toggle" data-bs-toggle="dropdown">
                      {formatVisibility(visibility)}
                    </span>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" value="public" onClick={(e) => setVisibility(e.target.value)}>Public</button></li>
                      <li><button className="dropdown-item" value="friends" onClick={(e) => setVisibility(e.target.value)}>Friends</button></li>
                      <li><button className="dropdown-item" value="only_me" onClick={(e) => setVisibility(e.target.value)}>Only Me</button></li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <span className="visibility-badge dropdown-toggle" data-bs-toggle="dropdown">
                      {formatCommentPermission(commentPermission)}
                    </span>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" value="no_approval" onClick={(e) => setCommentPermission(e.target.value)}>No Approval Required</button></li>
                      <li><button className="dropdown-item" value="approval_required" onClick={(e) => setCommentPermission(e.target.value)}>Approval Required</button></li>
                      <li><button className="dropdown-item" value="no_comment" onClick={(e) => setCommentPermission(e.target.value)}>No Comments</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="post-text my-3">
              <textarea
                rows={5}
                placeholder={`What's on your mind, ${userName}?`}
                className="form-control"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>

            {isDragOver && (
              <div className="drag-overlay">
                <div className="drag-overlay-content">
                  <FontAwesomeIcon icon={faImages} size="3x" className="mb-3" />
                  <h5>Drop your media here</h5>
                  <p className="text-muted">Images and videos are supported</p>
                </div>
              </div>
            )}

            <div className="card-basic p-2 px-3 mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <p className="m-0">Add to your post</p>
                <div>
                  <button
                    className="btn-simple p-0 px-1 me-2"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faImages} />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleMediaChange(e);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  />

                  <button
                    className="btn-simple p-0 px-1"
                    onClick={() => videoFileInputRef.current && videoFileInputRef.current.click()}
                    type="button"
                    aria-label="Attach video"
                  >
                    <FontAwesomeIcon icon={faVideo} />
                  </button>

                  <input
                    type="file"
                    ref={videoFileInputRef}
                    accept="video/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleMediaChange(e);
                      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
                    }}
                  />
                </div>
              </div>
            </div>

            {mediaPreviews.length > 0 && (
              <div className="media-preview d-flex flex-wrap gap-2 mb-3">
                {mediaPreviews.map((media, idx) => (
                  <div className="media-single position-relative" key={media.tempId || idx}>
                    {media.type === 'video' ? (
                      <video
                        src={media.previewUrl}
                        className="img-fluid media-img"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={media.previewUrl}
                        alt={`preview-${idx}`}
                        className="img-fluid media-img"
                      />
                    )}

                    <button
                      onClick={() => handleDeleteImage(idx)}
                      className="media-delete-btn"
                      type="button"
                      aria-label="Remove media"
                      disabled={uploading}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                    {(media.progress ?? 0) < 100 && (
                      <>
                        <div className="progress-bar" style={{ width: `${media.progress}%` }}></div>
                        <div className="progress-percentage">{media.progress}%</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn-main btn-solid w-100"
              onClick={handleSavePost}
              disabled={disableSave}
            >
              {uploading ? 'Uploading...' : 'Save Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
