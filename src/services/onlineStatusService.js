import { apiFetch } from '../lib/apiClient';

export const updateOnlineStatus = async (isOnline, conversationId = null) => {
  try {
    await apiFetch(`${APP_BASE_URL}/api/chats/online-status/update`, {
      method: 'POST',
      body: JSON.stringify({
        is_online: isOnline,
        conversation_id: conversationId,
      }),
    });
  } catch (error) {
    console.error('Error updating online status:', error);
  }
};

export const sendHeartbeat = async (conversationId = null) => {
  try {
    await apiFetch(`${APP_BASE_URL}/api/chats/online-status/heartbeat`, {
      method: 'POST',
      body: JSON.stringify({
        conversation_id: conversationId,
      }),
    });
  } catch (error) {
    console.error('Error sending heartbeat:', error);
  }
};

export const getConversationOnlineStatus = async (conversationId) => {
  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations/${conversationId}/online-status`);
    return data.data;
  } catch (error) {
    console.error('Error getting conversation online status:', error);
    return null;
  }
};

export const getUserOnlineStatus = async (userId) => {
  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/chats/users/${userId}/online-status`);
    return data.data;
  } catch (error) {
    console.error('Error getting user online status:', error);
    return null;
  }
};
