import React, { useState } from 'react';
import './mediaMessage.css';

const MediaMessage = ({ media, message, from, contactAvatar }) => {
  const [imageError, setImageError] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const getFileIcon = (mediaType) => {
    switch (mediaType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      case 'document':
        return '📄';
      default:
        return '📎';
    }
  };

  const formatFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleImageClick = () => {
    if (media.media_type === 'image') {
      setShowFullImage(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.file_url;
    link.download = media.original_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMediaContent = () => {
    if (!media || !media.media_type) {
      console.error('Media object is invalid:', media);
      return (
        <div className="media-error">
          <span>❌</span>
          <p>Invalid media data</p>
        </div>
      );
    }
    
    
    switch (media.media_type) {
      case 'image':
        return (
          <div className="media-image-container" onClick={handleImageClick}>
            {!imageError ? (
              <img
                src={media.file_url}
                alt={media.original_name}
                className="media-image"
                onError={(e) => {
                  console.error('Image failed to load:', media.file_url, e);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="media-error">
                <span>🖼️</span>
                <p>Image failed to load</p>
                <p>URL: {media.file_url}</p>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="media-video-container">
            <video
              controls
              className="media-video"
              poster={media.thumbnail_url}
            >
              <source src={media.file_url} type={media.mime_type} />
              Your browser does not support the video tag.
            </video>
            {media.duration && (
              <span className="media-duration">{formatDuration(media.duration)}</span>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="media-audio-container">
            <div className="audio-icon">🎵</div>
            <audio controls className="media-audio">
              <source src={media.file_url} type={media.mime_type} />
              Your browser does not support the audio tag.
            </audio>
            {media.duration && (
              <span className="media-duration">{formatDuration(media.duration)}</span>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="media-document-container" onClick={handleDownload}>
            <div className="document-icon">📄</div>
            <div className="document-info">
              <p className="document-name">{media.original_name}</p>
              <p className="document-size">{formatFileSize(media.file_size)}</p>
            </div>
            <div className="download-icon">⬇️</div>
          </div>
        );

      default:
        return (
          <div className="media-unknown">
            <span>{getFileIcon(media.media_type)}</span>
            <p>Unsupported file type</p>
          </div>
        );
    }
  };

  const messageTime = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (from === "me") {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 'calc(100% - 40px)', marginLeft: 'auto' }}>
          <div
            className="p-2 px-3 rounded shadow"
            style={{
              background: '#EDE9FE',
              color: '#222',
              borderRadius: '18px 18px 6px 18px',
              fontSize: 15,
              minWidth: 80,
              maxWidth: 400,
              position: 'relative',
            }}
          >
            {renderMediaContent()}
            {message.body && message.body.trim() && (
              <div className="media-caption mt-2">
                {message.body}
              </div>
            )}
          </div>
          <div className="d-flex align-items-center mt-1" style={{ fontSize: 12, opacity: 0.7 }}>
            <span>{messageTime}</span>
            <span style={{ marginLeft: 6 }}>
              {message.all_read_by_others ? (
                <i className="fa fa-check-double" title="Read" />
              ) : (
                <i className="fa fa-check" title="Sent" />
              )}
            </span>
            <img src={contactAvatar} alt="me" style={{ width: 22, height: 22, borderRadius: '50%', marginLeft: 4 }} />
          </div>
        </div>

        {/* Full Image Modal */}
        {showFullImage && (
          <div className="full-image-overlay" onClick={() => setShowFullImage(false)}>
            <div className="full-image-container">
              <img
                src={media.file_url}
                alt={media.original_name}
                className="full-image"
              />
              <button className="close-full-image" onClick={() => setShowFullImage(false)}>
                ×
              </button>
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: 'calc(100% - 40px)', marginRight: 'auto' }}>
          <div className="d-flex align-items-end">
            <img src={contactAvatar} alt="them" className="rounded-circle me-2" style={{ width: 22, height: 22, marginBottom: 2 }} />
            <div
              className="p-2 px-3 rounded shadow"
              style={{
                background: '#F1F5F9',
                color: '#222',
                fontSize: 15,
                minWidth: 80,
                maxWidth: 400,
                position: 'relative',
              }}
            >
              {renderMediaContent()}
              {message.body && message.body.trim() && (
                <div className="media-caption mt-2">
                  {message.body}
                </div>
              )}
            </div>
          </div>
          <div className="d-flex align-items-center mt-1" style={{ fontSize: 12, opacity: 0.7 }}>
            <span>{messageTime}</span>
          </div>
        </div>

        {/* Full Image Modal */}
        {showFullImage && (
          <div className="full-image-overlay" onClick={() => setShowFullImage(false)}>
            <div className="full-image-container">
              <img
                src={media.file_url}
                alt={media.original_name}
                className="full-image"
              />
              <button className="close-full-image" onClick={() => setShowFullImage(false)}>
                ×
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default MediaMessage;
