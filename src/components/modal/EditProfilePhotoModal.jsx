import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import getCroppedImg from '../../utils/cropImageHelper';
import { getSignedUrls, confirmMediaUpload } from '../../api/media';
import { uploadFileToS3 } from '../../utils/s3Uploader';
import { useDispatch } from 'react-redux';
import { updateProfilePhoto, updateUserAttribute } from '../../store/slices/authSlice';


const EditProfilePhotoModal = ({ show, handleClose, onSave, onUserUpdate }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef();

  const token = useSelector((s) => s.auth.token);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

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

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageSrc(null);
    inputRef.current.value = null;
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setUploading(true);
      const croppedResult = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const { blob } = croppedResult;
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      const payload = {
        mediable_type: 'User',
        medias: [{
          file_name: 'avatar',
          file_type: 'jpg',
          mime_type: file.type,
          file_size: file.size,
          is_primary: true,
          media_role: 'profile',
        }],
      };

      const signedUrlResponse = await getSignedUrls(payload);

      if (!signedUrlResponse?.success || !signedUrlResponse.data?.media_records?.length) {
        toast.error('Failed to get upload URL');
        return;
      }

      const mediaRecord = signedUrlResponse.data.media_records[0];

      const success = await uploadFileToS3(file, mediaRecord, () => { });
      if (!success) {
        toast.error('Upload failed');
        return;
      }

      const confirmRes = await confirmMediaUpload([mediaRecord.media.uuid]);
      if (!confirmRes) {
        toast.error('Media confirmation failed');
        return;
      }
      if (onUserUpdate) {
        onUserUpdate((prev) => ({ ...prev, avatar_url: mediaRecord.media.file_url }));
      }
      dispatch(updateUserAttribute({ key: "avatar_url", value: mediaRecord.media.file_url }));

      toast.success('Profile photo updated!');
      handleClose();
      if (onSave) onSave(mediaRecord.media);
    } catch (e) {
      console.error('Save failed:', e);
      toast.error('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body 
        className={isDragOver ? 'drag-over' : ''}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!imageSrc && (
          <>
            <Form.Group>
              <Form.Label>Select Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputRef}
                disabled={uploading}
              />
            </Form.Group>
            
            {isDragOver && (
              <div className="drag-overlay">
                <div className="drag-overlay-content">
                  <i className="fas fa-image fa-3x mb-3"></i>
                  <h5>Drop your image here</h5>
                  <p className="text-muted">Only image files are supported</p>
                </div>
              </div>
            )}
          </>
        )}

        {imageSrc && (
          <>
            <div className="crop-container position-relative">
              <div className="cropper-circle-mask">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  showGrid={false}
                  cropShape="rect"
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>
              {uploading && (
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '0.375rem',
                    zIndex: 10
                  }}
                >
                  <div className="text-center text-white">
                    <Spinner animation="border" size="lg" style={{ color: 'white', marginBottom: '10px' }} />
                    <div className="fw-bold">Uploading...</div>
                  </div>
                </div>
              )}
              <button
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow"
                onClick={handleRemoveImage}
                title="Remove Image"
                disabled={uploading}
                style={{ zIndex: 15 }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>


            <div className="mt-3">
              <div className="w-100">
                <label>Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="form-range"
                  disabled={uploading}
                />
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={uploading}>Cancel</Button>
        <Button variant="primary" onClick={handleSave} disabled={!imageSrc || uploading}>
          {uploading ? (
            <>
              <Spinner 
                size="sm" 
                animation="border" 
                style={{ 
                  color: 'white',
                  marginRight: '8px'
                }} 
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

export default EditProfilePhotoModal;
