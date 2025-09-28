import React, { useRef, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { confirmMediaUpload, getSignedUrls } from '../../api/media';
import { uploadFileToS3 } from '../../utils/s3Uploader';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserAttribute } from '../../store/slices/authSlice';
import './editCoverPhotoModal.css';


const EditCoverPhotoModal = ({
  show,
  handleClose,
  onSave,
  media_role = 'cover',
  mediable_type = 'User',
  currentGroup,
  onUserUpdate
}) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef();
  const selectedFileRef = useRef(null);

  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();

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

    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    selectedFileRef.current = file;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    selectedFileRef.current = file;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    fileInputRef.current.value = null;
    selectedFileRef.current = null;
    setUploadProgress(0);
  };

  const handleSave = async () => {
    const file = selectedFileRef.current;
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type;
    const fileSize = file.size;
    const fileName = file.name.split('.').slice(0, -1).join('.');

    const payload = {
      mediable_type: mediable_type,
      ...(mediable_type === 'Group' && { group_slug: currentGroup?.slug }),
      medias: [
        {
          file_name: fileName,
          file_type: fileExtension,
          mime_type: mimeType,
          file_size: fileSize,
          is_primary: true,
          media_role: media_role,
        },
      ],
    };

    try {
      setUploading(true);
      const signedUrlResponse = await getSignedUrls(payload);

      if (
        signedUrlResponse?.success &&
        signedUrlResponse?.data?.media_records?.length
      ) {
        const mediaRecord = signedUrlResponse.data.media_records[0];

        const success = await uploadFileToS3(file, mediaRecord, (progress) =>
          setUploadProgress(progress)
        );

        if (!success) {
          toast.error('Upload failed');
          return;
        }

        const confirmRes = await confirmMediaUpload(
          [mediaRecord.media.uuid]
        );

        if (!confirmRes) {
          toast.error('Media confirmation failed');
          return;
        }

        if (mediable_type === 'User') {
          if (onUserUpdate) {
            onUserUpdate((prev) => ({ ...prev, cover_photo_url: mediaRecord.media.file_url }));
          }
          dispatch(updateUserAttribute({ key: "cover_photo_url", value: mediaRecord.media.file_url }));
        }

        toast.success('Cover photo updated!');

        if (onSave) {
          onSave(mediaRecord.media);
        }

      } else {
        toast.error('Failed to get signed upload URL');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Something went wrong');
    } finally {
      setUploading(false);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Cover Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body 
        className={isDragOver ? 'drag-over' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="position-relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="form-control mb-3"
            disabled={uploading}
            style={{
              opacity: uploading ? 0.6 : 1,
              cursor: uploading ? 'not-allowed' : 'pointer'
            }}
          />
          {/* {uploading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center cover-photo-file-input-overlay">
              <Spinner animation="border" size="sm" className="file-input-spinner" />
            </div>
          )} */}
        </div>

        {isDragOver && !preview && (
          <div className="drag-overlay">
            <div className="drag-overlay-content">
              <i className="fas fa-image fa-3x mb-3"></i>
              <h5>Drop your image here</h5>
              <p className="text-muted">Only image files are supported</p>
            </div>
          </div>
        )}

        {preview && (
          <div className="position-relative">
            <img
              src={preview}
              alt="Preview"
              className={`img-fluid rounded cover-photo-preview ${uploading ? 'uploading' : ''}`}
              style={{
                maxHeight: '300px',
                objectFit: 'cover',
                width: '100%'
              }}
            />
            {uploading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center cover-photo-upload-overlay">
                <div className="text-center text-white">
                  <Spinner animation="border" size="lg" className="upload-overlay-spinner" />
                  <div className="fw-bold">Uploading...</div>
                  <div className="small">{uploadProgress}%</div>
                </div>
              </div>
            )}
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow cover-photo-remove-btn"
              onClick={handleRemoveImage}
              title="Remove Image"
              disabled={uploading}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            {/* {uploading && (
              <div className="progress mt-3 cover-photo-upload-progress">
                <div
                  className="progress-bar cover-photo-progress-bar"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )} */}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!preview || uploading}
        >
          {uploading ? (
            <>
              <Spinner 
                animation="border" 
                size="sm" 
                className="upload-spinner"
              /> 
              Uploading...
            </>
          ) : (
            'Save'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCoverPhotoModal;
