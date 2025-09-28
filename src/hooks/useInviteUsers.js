import { useState } from 'react';
import { inviteUsers } from '../api/userInvites';

export const useInviteUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const sendInvites = async (emails) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await inviteUsers(emails);
      setSuccess(response.message || 'Invites sent successfully!');
      return response;
    } catch (err) {
      setError(err.message || 'Failed to send invites. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    loading,
    error,
    success,
    sendInvites,
    clearMessages
  };
};
