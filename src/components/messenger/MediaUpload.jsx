import React, { useRef, useState } from 'react';
import { useChatMediaUpload } from '../../hooks/useChatMediaUpload';
import './mediaUpload.css';

const MediaUpload = ({ onMediaSelect, onClose, conversationId }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  
  const { 
    mediaPreviews, 
    uploading, 
    uploadedMediaIds, 
    handleMediaUpload, 
    removeMedia, 
    clearAll 
  } = useChatMediaUpload(
    conversationId,
    (mediaIds) => {
      // Media upload completed successfully
      console.log('Media uploaded:', mediaIds);
    },
    (error) => {
      console.error('Media upload error:', error);
    }
  );

  const allowedTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
    audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  };

  const maxSizes = {
    image: 10 * 1024 * 1024, // 10MB
    video: 100 * 1024 * 1024, // 100MB
    audio: 50 * 1024 * 1024, // 50MB
    document: 20 * 1024 * 1024 // 20MB
  };

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      handleMediaUpload(files);
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };


  const handleSend = async () => {
    if (uploadedMediaIds.length > 0 && !isSending && !uploading) {
      setIsSending(true);
      try {
        await onMediaSelect(uploadedMediaIds);
        clearAll();
        onClose();
      } catch (error) {
        console.error('Error sending media:', error);
        // Keep modal open on error so user can retry
      } finally {
        setIsSending(false);
      }
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
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

  return (
    <div className="media-upload-overlay" onClick={onClose}>
      <div className={`media-upload-modal ${isSending ? 'sending' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="media-upload-header">
          <h5>Send Media</h5>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={isSending}
          >
            ×
          </button>
        </div>
        
        {/* Loading Overlay */}
        {(isSending || uploading) && (
          <div className="media-upload-loading-overlay">
            <div className="loading-content">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h6>{uploading ? 'Uploading Media...' : 'Sending Message...'}</h6>
              <p className="text-muted">
                {uploading 
                  ? 'Please wait while your files are being uploaded' 
                  : 'Please wait while your message is being sent'
                }
              </p>
            </div>
          </div>
        )}

        <div className="media-upload-content">
          {mediaPreviews.length === 0 ? (
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📎</div>
              <p>Click to select files or drag and drop</p>
              <p className="upload-hint">
                Images (10MB), Videos (100MB), Audio (50MB), Documents (20MB)
              </p>
            </div>
          ) : (
            <div className="selected-files">
              <h6>Selected Files ({mediaPreviews.length})</h6>
              <div className="files-grid">
                {mediaPreviews.map((fileData, index) => (
                  <div key={fileData.tempId || index} className="file-item">
                    {fileData.preview ? (
                      <img src={fileData.preview} alt="Preview" className="file-preview" />
                    ) : (
                      <div className="file-icon">{getFileIcon(fileData.mediaType)}</div>
                    )}
                    <div className="file-info">
                      <p className="file-name">{fileData.file.name}</p>
                      <p className="file-size">{formatFileSize(fileData.file.size)}</p>
                      {fileData.progress < 100 && !fileData.uploaded && (
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${fileData.progress}%` }}
                          ></div>
                        </div>
                      )}
                      {fileData.uploaded && (
                        <p className="upload-status text-success">✓ Uploaded</p>
                      )}
                    </div>
                    <button 
                      className="remove-file" 
                      onClick={() => removeMedia(fileData.tempId)}
                      disabled={uploading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={Object.values(allowedTypes).flat().join(',')}
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="media-upload-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isSending || uploading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSend}
            disabled={uploadedMediaIds.length === 0 || isSending || uploading}
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sending...
              </>
            ) : uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              `Send (${uploadedMediaIds.length})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
