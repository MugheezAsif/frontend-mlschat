import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import NavbarTop from '../components/NavbarTop';
import NavbarMobile from '../components/NavbarMobile';
import { faImage, faTrash, faUsers, faEye, faLock, faGlobe, faShieldAlt, faCheckDouble, faCircleXmark, faMapMarkerAlt, faTag, faFileText } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import '../group.css';
import { apiFetch } from '../lib/apiClient';
import { inviteUsers } from '../api/userInvites';

const CreateNewGroup = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    visibility: 'public',
    post_permission: 'anyone',
    members: [],
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [postSlug, setPostSlug] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedMediaIds, setUploadedMediaIds] = useState([]);
  const [memberInput, setMemberInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!postSlug || uploadedMediaIds.length === 0) {
      toast.error('Image upload not completed');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch(`${APP_BASE_URL}/api/media/file-uploaded`, {
        method: 'POST',
        body: JSON.stringify({ media_ids: uploadedMediaIds }),
      });

      const groupPayload = {
        group_slug: postSlug,
        ...formData,
      };

      const groupData = await apiFetch(`${APP_BASE_URL}/api/group`, {
        method: 'POST',
        body: JSON.stringify(groupPayload),
      });

      if (groupData.success) {
        if (formData.members && formData.members.length > 0) {
          try {
            const inviteResponse = await inviteUsers(formData.members, formData.name);
            console.log('Invite response:', inviteResponse);
            
            if (inviteResponse.success) {
              toast.success(`Group created successfully! ${inviteResponse.data.invited_count} invite(s) sent.`);
            } else {
              toast.success('Group created successfully!');
              toast.warning('Some invites failed to send.');
            }
          } catch (inviteError) {
            console.error('Error sending invites:', inviteError);
            toast.success('Group created successfully!');
            toast.warning('Failed to send invites, but group was created.');
          }
        } else {
          toast.success('Group created successfully!');
        }
        
        navigate('/Groups');
      } else {
        toast.error(groupData.message || 'Group creation failed');
      }

    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m !== email),
    }));
  };

  const handleAddMember = () => {
    const email = memberInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) return;

    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }
    if (formData.members.includes(email)) {
      toast.warning('This email is already added');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, email],
    }));

    setMemberInput('');
  };

  const handleMemberKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && memberInput.trim()) {
      e.preventDefault();
      handleAddMember();
    }
  };

  const handleMemberBlur = () => {
    if (memberInput.trim()) {
      handleAddMember();
    }
  };

  const handleMemberInputChange = (e) => {
    setMemberInput(e.target.value);
  };

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

    const syntheticEvent = {
      target: {
        files: [file]
      }
    };

    handleImageUpload(syntheticEvent);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(0);

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type;
    const fileSize = file.size;
    const fileName = file.name.split('.').slice(0, -1).join('.');

    const payload = {
      mediable_type: 'Group',
      medias: [{
        file_name: fileName,
        file_type: fileExtension,
        mime_type: mimeType,
        file_size: fileSize,
        is_primary: true,
        media_role: 'image',
      }],
    };

    try {
      setUploading(true);
      const signedUrlResponse = await getSignedUrls(payload);

      if (signedUrlResponse?.success && signedUrlResponse?.data?.media_records?.length) {
        const mediaRecord = signedUrlResponse.data.media_records[0];
        setPostSlug(signedUrlResponse.data.slug);
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setUploadedMediaIds([mediaRecord.media.uuid]);

        const success = await uploadFileToS3(file, mediaRecord, (progress) => {
          setUploadProgress(progress);
        });

        if (!success) {
          console.error('Upload to S3 failed');
          toast.error('Something went wrong please try again');
        }
      } else {
        console.error('Failed to get presigned URL');
        toast.error('Something went wrong please try again');
      }
    } catch (err) {
      console.error('Upload process failed:', err);
      toast.error('Something went wrong please try again');
    } finally {
      setUploading(false);
    }
  };

  const getSignedUrls = async (payload) => {
    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/media/get-presigned-url`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data;
    } catch (error) {
      console.error('Error getting signed URLs:', error);
      toast.error('Something went wrong please try again');
      return null;
    }
  };

  const uploadFileToS3 = (file, mediaRecord, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', mediaRecord.presigned_url, true);
      xhr.setRequestHeader('Content-Type', mediaRecord.media.mime_type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && typeof onProgress === 'function') {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log(`Upload successful: ${file.name}`);
          resolve(true);
        } else {
          console.error(`Upload failed: ${file.name}, status ${xhr.status}`);
          toast.error('Something went wrong please try again');
          reject(false);
        }
      };

      xhr.onerror = () => {
        console.error('Upload error occurred');
        toast.error('Something went wrong please try again');
        reject(false);
      };

      xhr.send(file);
    });
  };

  if (!user) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="create-new-group-page">
      <div className="container">
        {/* Header */}
        <div className="create-new-group-header">
          <h1>Create a New Group</h1>
          <p>Name your group, add a cover image, describe its purpose, set permissions, and invite members.</p>
        </div>

        {/* Form */}
        <div className="create-new-group-form">
          {/* Cover Image Section */}
          <div className="form-section">
            <h3 className="form-section-title">Cover Photo</h3>
            <div 
              className={`cover-image-section ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Group Cover" className="preview-image" />
                  <button 
                    className="remove-image-btn"
                    onClick={() => { 
                      setSelectedImage(null); 
                      setPreviewUrl(null); 
                      setUploadProgress(0);
                      setUploadedMediaIds([]);
                      setPostSlug(null);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  
                  {uploading && (
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">{uploadProgress}% uploaded</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="cover-image-upload" onClick={() => document.getElementById('group-cover-input').click()}>
                  <FontAwesomeIcon icon={faImage} className="upload-icon" />
                  <p className="upload-text">Upload Group Cover Image</p>
                  <button className="upload-btn">
                    Choose Image
                  </button>
                  <input 
                    type="file" 
                    id="group-cover-input" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleImageUpload} 
                  />
                  
                  {isDragOver && (
                    <div className="drag-overlay">
                      <div className="drag-overlay-content">
                        <FontAwesomeIcon icon={faImage} size="3x" className="mb-3" />
                        <h5>Drop your image here</h5>
                        <p className="text-muted">Only image files are supported</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faTag} className="me-2" />
                Group Name <span className="required">*</span>
              </label>
              <input 
                className="form-control" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter group name"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faFileText} className="me-2" />
                Description <span className="required">*</span>
              </label>
              <textarea 
                className="form-control" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="What's your group about?"
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faTag} className="me-2" />
                Category <span className="required">*</span>
              </label>
              <select 
                className="form-control" 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                <option value="real_estate">Real Estate</option>
                <option value="entertainment">Entertainment</option>
                <option value="technology">Technology</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                Location
              </label>
              <input 
                className="form-control" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="Add location"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Privacy Settings Section */}
          <div className="form-section">
            <h3 className="form-section-title">Privacy Settings</h3>
            <div className="privacy-settings">
              <div className="privacy-option">
                <input
                  type="radio"
                  id="visibility-public"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === 'public'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="visibility-public" className="privacy-label">
                  <div className="privacy-icon public">
                    <FontAwesomeIcon icon={faGlobe} />
                  </div>
                  <div className="privacy-content">
                    <h6>Public</h6>
                    <span>Anyone can find and join</span>
                  </div>
                </label>
              </div>
              <div className="privacy-option">
                <input
                  type="radio"
                  id="visibility-private"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === 'private'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="visibility-private" className="privacy-label">
                  <div className="privacy-icon private">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <div className="privacy-content">
                    <h6>Private</h6>
                    <span>Request to join visible in search</span>
                  </div>
                </label>
              </div>
              <div className="privacy-option">
                <input
                  type="radio"
                  id="visibility-invite"
                  name="visibility"
                  value="invite_only"
                  checked={formData.visibility === 'invite_only'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="visibility-invite" className="privacy-label">
                  <div className="privacy-icon invite">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div className="privacy-content">
                    <h6>Invite Only</h6>
                    <span>Invite only, hidden from search</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Posting Settings Section */}
          <div className="form-section">
            <h3 className="form-section-title">Posting Settings</h3>
            <div className="posting-settings">
              <div className="posting-option">
                <input
                  type="radio"
                  id="post-permission-anyone"
                  name="post_permission"
                  value="anyone"
                  checked={formData.post_permission === 'anyone'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="post-permission-anyone" className="posting-label">
                  <div className="posting-icon anyone">
                    <FontAwesomeIcon icon={faCheckDouble} />
                  </div>
                  <div className="posting-content">
                    <h6>Anyone can post</h6>
                    <span>Members can post without approval</span>
                  </div>
                </label>
              </div>
              <div className="posting-option">
                <input
                  type="radio"
                  id="post-permission-required"
                  name="post_permission"
                  value="required"
                  checked={formData.post_permission === 'required'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="post-permission-required" className="posting-label">
                  <div className="posting-icon required">
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div className="posting-content">
                    <h6>Posts require approval</h6>
                    <span>Required permission to post</span>
                  </div>
                </label>
              </div>
              <div className="posting-option">
                <input
                  type="radio"
                  id="post-permission-disabled"
                  name="post_permission"
                  value="disabled"
                  checked={formData.post_permission === 'disabled'}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="post-permission-disabled" className="posting-label">
                  <div className="posting-icon disabled">
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </div>
                  <div className="posting-content">
                    <h6>Posting disabled</h6>
                    <span>Only admins can create posts</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div className="form-section">
            <h3 className="form-section-title">Invite Members</h3>
            <p className="text-muted mb-3">Add email addresses to invite people to join this group. Invitation emails will be sent automatically when the group is created.</p>
            <div className="members-section">
              <div className="members-input">
                <input
                  className="form-control"
                  value={memberInput}
                  onChange={handleMemberInputChange}
                  onKeyDown={handleMemberKeyDown}
                  onBlur={handleMemberBlur}
                  placeholder="Add members by email (press Enter to add)"
                  disabled={isSubmitting}
                />
              </div>
              <div className="members-list">
                {formData.members.map((email, index) => (
                  <span key={index} className="member-tag">
                    {email}
                    <button
                      className="remove-member"
                      onClick={() => removeMember(email)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            className="submit-btn" 
            onClick={handleSubmit} 
            disabled={uploading || isSubmitting}
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 
             isSubmitting ? 'Creating Group...' :
             formData.members.length > 0 ? `Create Group & Send ${formData.members.length} Invite(s)` : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewGroup;
