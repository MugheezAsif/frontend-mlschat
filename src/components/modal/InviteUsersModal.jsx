import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { inviteUsers } from '../../api/userInvites';
import '../../modal.css';

const InviteUsersModal = ({ open, onClose, onSuccess }) => {
  const [emails, setEmails] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    setError('');
  };

  const addEmailField = () => {
    if (emails.length < 50) {
      setEmails([...emails, '']);
    }
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const validateEmails = () => {
    const validEmails = emails.filter(email => email.trim() !== '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validEmails.filter(email => !emailRegex.test(email));
    
    if (validEmails.length === 0) {
      setError('Please enter at least one email address');
      return false;
    }
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmails()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const validEmails = emails.filter(email => email.trim() !== '');
      const response = await inviteUsers(validEmails);
      
      setSuccess(response.message || 'Invites sent successfully!');
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      // Reset form after successful submission
      setTimeout(() => {
        setEmails(['']);
        setSuccess('');
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to send invites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmails(['']);
      setError('');
      setSuccess('');
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content invite-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Invite Users to MLS Chat
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={handleClose}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="text-muted mb-3">
              Invite your colleagues and friends to join MLS Chat. They'll receive an email with a link to sign up.
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <div className="email-inputs">
              {emails.map((email, index) => (
                <div key={index} className="email-input-group mb-2">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      disabled={loading}
                    />
                    {emails.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeEmailField(index)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {emails.length < 50 && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={addEmailField}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add Another Email
              </button>
            )}

            <div className="mt-3">
              <small className="text-muted">
                You can invite up to 50 users at once. ({emails.length}/50)
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || emails.every(email => email.trim() === '')}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending Invites...
                </>
              ) : (
                'Send Invites'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUsersModal;
