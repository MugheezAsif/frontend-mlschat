import { apiFetch } from '../lib/apiClient';

export const getSignedUrls = async (payload) => {
  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/media/get-presigned-url`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    console.error('Error getting signed URLs:', error);
    return null;
  }
};

export const confirmMediaUpload = async (mediaIds) => {
  try {
    const data = await apiFetch(`${APP_BASE_URL}/api/media/file-uploaded`, {
      method: 'POST',
      body: JSON.stringify({ media_ids: mediaIds }),
    });
    return data;
  } catch (err) {
    console.error('Media confirmation error:', err);
    return null;
  }
};

