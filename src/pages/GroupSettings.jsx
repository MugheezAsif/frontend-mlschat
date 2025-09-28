import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchGroupById, updateGroupSettings } from '../store/slices/groupsSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faUsers,
  faEye,
  faLock,
  faGlobe,
  faMapMarkerAlt,
  faEdit,
  faSave,
  faArrowLeft,
  faImage,
  faShieldAlt,
  faLocationDot,
  faTag,
  faFileText
} from '@fortawesome/free-solid-svg-icons';

import EditCoverPhotoModal from '../components/modal/EditCoverPhotoModal';
import 'bootstrap/dist/css/bootstrap.min.css';

const GroupSettings = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const slug = id;
  const { currentGroup, loading } = useSelector((s) => s.groups);

  const [form, setForm] = useState({
    name: '',
    description: '',
    visibility: 'public',
    category: '',
    location: '',
    post_permission: 'anyone',
    cover_url: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) dispatch(fetchGroupById(slug));
  }, [slug, dispatch]);
  useEffect(() => {
    if (!currentGroup) return;
    const s = currentGroup.settings || {};

    let postPermission = 'anyone';
    if (s.allow_posting === false) postPermission = 'disabled';
    else if (s.allow_posting === true && s.post_permission_required === true) postPermission = 'required';

    setForm({
      name: currentGroup.name || '',
      description: currentGroup.description || '',
      visibility: currentGroup.visibility || 'public',
      category: currentGroup.category || '',
      location: currentGroup.location || '',
      post_permission: postPermission,
      cover_url: currentGroup.cover_url || '',
    });
  }, [currentGroup]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.name.trim()) {
      errors.name = 'Group name is required';
    }
    if (!form.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!form.category) {
      errors.category = 'Category is required';
    }
    if (!form.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    const payload = {
      name: form.name,
      description: form.description,
      visibility: form.visibility,
      category: form.category,
      location: form.location,
      cover_url: form.cover_url || null,
      post_permission: form.post_permission, // Send directly as expected by backend
    };

    dispatch(updateGroupSettings({ slug, settings: payload }))
      .unwrap()
      .then(() => navigate(`/group/${slug}`))
      .catch((err) => {
        console.error('Failed to update group:', err);
        setIsSubmitting(false);
      });
  };

  const getVisibilityIcon = () => {
    switch (form.visibility) {
      case 'private': return <FontAwesomeIcon icon={faLock} />;
      case 'invite_only': return <FontAwesomeIcon icon={faUsers} />;
      default: return <FontAwesomeIcon icon={faGlobe} />;
    }
  };

  const getVisibilityText = () => {
    switch (form.visibility) {
      case 'private': return 'Private Group';
      case 'invite_only': return 'Invite Only';
      default: return 'Public Group';
    }
  };

  const getPostPermissionText = () => {
    switch (form.post_permission) {
      case 'required': return 'Posts require approval';
      case 'disabled': return 'Posting disabled';
      default: return 'Everyone can post';
    }
  };

  if (loading || !currentGroup) {
    return (
      <div className="group-settings-loading">
        <div className="group-settings-spinner"></div>
        <p>Loading group settings...</p>
      </div>
    );
  }

  return (
    <div className="group-settings-page">
      {/* Header Section */}
      <div className="group-settings-header">
        <div className="container">
          <div className="header-content">
            <button
              className="btn btn-back"
              onClick={() => navigate(`/group/${slug}`)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Group
            </button>
            <div className="header-title">
              <FontAwesomeIcon icon={faCog} className="header-icon" />
              <h1>Group Settings</h1>
            </div>
            <p className="header-subtitle">
              Manage your group's appearance, privacy, and permissions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="group-settings-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="settings-container">
                {/* Cover Photo Section */}
                <div className="settings-section cover-section">
                  <div className="section-header">
                    <FontAwesomeIcon icon={faImage} className="section-icon" />
                    <h3>Cover Photo</h3>
                    <p>Choose a cover image that represents your group</p>
                  </div>
                  <div className="cover-preview">
                    {form.cover_url ? (
                      <div className="cover-image-container">
                        <img
                          src={form.cover_url}
                          alt="Group Cover"
                          className="cover-preview-image"
                        />
                        <div className="cover-overlay">
                          <button
                            type="button"
                            className="btn btn-edit-cover"
                            onClick={() => setShowModal(true)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                            Change Cover
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="cover-placeholder">
                        <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
                        <p>No cover image set</p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setShowModal(true)}
                        >
                          <FontAwesomeIcon icon={faImage} className="me-2" />
                          Add Cover Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information Section */}
                <div className="settings-section">
                  <div className="section-header">
                    <FontAwesomeIcon icon={faFileText} className="section-icon" />
                    <h3>Basic Information</h3>
                    <p>Update your group's name, description, and category</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faTag} className="me-2" />
                      Group Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${validationErrors.name ? 'is-invalid' : ''}`}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter group name"
                      required
                    />
                    {validationErrors.name && (
                      <div className="invalid-feedback">{validationErrors.name}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faFileText} className="me-2" />
                      Description <span className="required">*</span>
                    </label>
                    <textarea
                      className={`form-control form-control-lg ${validationErrors.description ? 'is-invalid' : ''}`}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe what your group is about..."
                      required
                    />
                    {validationErrors.description && (
                      <div className="invalid-feedback">{validationErrors.description}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faTag} className="me-2" />
                      Category <span className="required">*</span>
                    </label>
                    <select
                      className={`form-control form-control-lg ${validationErrors.category ? 'is-invalid' : ''}`}
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="real_estate">Real Estate</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="technology">Technology</option>
                      <option value="sports">Sports</option>
                      <option value="business">Business</option>
                      <option value="education">Education</option>
                    </select>
                    {validationErrors.category && (
                      <div className="invalid-feedback">{validationErrors.category}</div>
                    )}
                  </div>
                </div>

                {/* Privacy & Visibility Section */}
                <div className="settings-section">
                  <div className="section-header">
                    <FontAwesomeIcon icon={faShieldAlt} className="section-icon" />
                    <h3>Privacy & Visibility</h3>
                    <p>Control who can see and join your group</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faEye} className="me-2" />
                      Visibility
                    </label>
                    <div className="visibility-options">
                      <div className="visibility-option">
                        <input
                          type="radio"
                          id="visibility-public"
                          name="visibility"
                          value="public"
                          checked={form.visibility === 'public'}
                          onChange={handleChange}
                        />
                        <label htmlFor="visibility-public" className="visibility-label">
                          <div className="visibility-icon public">
                            <FontAwesomeIcon icon={faGlobe} />
                          </div>
                          <div className="visibility-content">
                            <h5>Public</h5>
                            <p>Anyone can see and join this group</p>
                          </div>
                        </label>
                      </div>
                      <div className="visibility-option">
                        <input
                          type="radio"
                          id="visibility-private"
                          name="visibility"
                          value="private"
                          checked={form.visibility === 'private'}
                          onChange={handleChange}
                        />
                        <label htmlFor="visibility-private" className="visibility-label">
                          <div className="visibility-icon private">
                            <FontAwesomeIcon icon={faLock} />
                          </div>
                          <div className="visibility-content">
                            <h5>Private</h5>
                            <p>Only members can see this group</p>
                          </div>
                        </label>
                      </div>
                      <div className="visibility-option">
                        <input
                          type="radio"
                          id="visibility-invite"
                          name="visibility"
                          value="invite_only"
                          checked={form.visibility === 'invite_only'}
                          onChange={handleChange}
                        />
                        <label htmlFor="visibility-invite" className="visibility-label">
                          <div className="visibility-icon invite">
                            <FontAwesomeIcon icon={faUsers} />
                          </div>
                          <div className="visibility-content">
                            <h5>Invite Only</h5>
                            <p>Only invited users can join</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Permissions Section */}
                <div className="settings-section">
                  <div className="section-header">
                    <FontAwesomeIcon icon={faLocationDot} className="section-icon" />
                    <h3>Location & Permissions</h3>
                    <p>Set location and control posting permissions</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      Location <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${validationErrors.location ? 'is-invalid' : ''}`}
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, NY or Online"
                      required
                    />
                    {validationErrors.location && (
                      <div className="invalid-feedback">{validationErrors.location}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                      Post Permission
                    </label>
                    <div className="permission-options">
                      <div className="permission-option">
                        <input
                          type="radio"
                          id="permission-anyone"
                          name="post_permission"
                          value="anyone"
                          checked={form.post_permission === 'anyone'}
                          onChange={handleChange}
                        />
                        <label htmlFor="permission-anyone" className="permission-label">
                          <div className="permission-icon anyone">
                            <FontAwesomeIcon icon={faUsers} />
                          </div>
                          <div className="permission-content">
                            <h5>Everyone can post</h5>
                            <p>Members can post without approval</p>
                          </div>
                        </label>
                      </div>
                      <div className="permission-option">
                        <input
                          type="radio"
                          id="permission-required"
                          name="post_permission"
                          value="required"
                          checked={form.post_permission === 'required'}
                          onChange={handleChange}
                        />
                        <label htmlFor="permission-required" className="permission-label">
                          <div className="permission-icon required">
                            <FontAwesomeIcon icon={faShieldAlt} />
                          </div>
                          <div className="permission-content">
                            <h5>Posts require approval</h5>
                            <p>Admins must approve posts before they appear</p>
                          </div>
                        </label>
                      </div>
                      <div className="permission-option">
                        <input
                          type="radio"
                          id="permission-disabled"
                          name="post_permission"
                          value="disabled"
                          checked={form.post_permission === 'disabled'}
                          onChange={handleChange}
                        />
                        <label htmlFor="permission-disabled" className="permission-label">
                          <div className="permission-icon disabled">
                            <FontAwesomeIcon icon={faLock} />
                          </div>
                          <div className="permission-content">
                            <h5>Posting disabled</h5>
                            <p>Only admins can create posts</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button Section */}
                <div className="settings-section save-section">
                  <div className="save-actions">
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={() => navigate(`/group/${slug}`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-lg btn-save"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCoverPhotoModal
        currentGroup={currentGroup}
        show={showModal}
        media_role="image"
        mediable_type="Group"
        handleClose={() => setShowModal(false)}
        onSave={(media) => {
          setForm((f) => ({ ...f, cover_url: media.file_url }));
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default GroupSettings;
