import { apiFetch } from '../lib/apiClient';

export const inviteUsers = async (emails, groupName = null) => {
  try {
    const payload = { emails };
    if (groupName) {
      payload.group_name = groupName;
    }
    
    const data = await apiFetch(`${APP_BASE_URL}/api/users/invite`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.error('Error sending invites:', error);
    throw error;
  }
};
