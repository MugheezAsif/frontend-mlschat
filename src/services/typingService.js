import { apiFetch } from '../lib/apiClient';

export const startTyping = async (conversationId) => {
  try {
    await apiFetch(`${APP_BASE_URL}/api/chats/typing/start`, {
      method: 'POST',
      body: JSON.stringify({
        conversation_id: conversationId,
      }),
    });
  } catch (error) {
    console.error('Error starting typing indicator:', error);
  }
};

export const stopTyping = async (conversationId) => {
  try {
    await apiFetch(`${APP_BASE_URL}/api/chats/typing/stop`, {
      method: 'POST',
      body: JSON.stringify({
        conversation_id: conversationId,
      }),
    });
  } catch (error) {
    console.error('Error stopping typing indicator:', error);
  }
};
