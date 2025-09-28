import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiFetch } from '../lib/apiClient';

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 100;
const MAX_AUDIO_MB = 50;
const MAX_DOCUMENT_MB = 20;

export const useChatMediaUpload = (conversationId, onUploadComplete, onError) => {
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedMediaIds, setUploadedMediaIds] = useState([]);

  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);

  const makeTempId = (file) => `${file.name}-${file.lastModified}-${file.size}`;

  const getSignedUrls = async (payload) => {
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

  const uploadFilesToS3 = async (files, mediaRecords, tempIds) => {
    try {
      const uploadPromises = mediaRecords.map((record, index) => {
        const file = files[index];
        const url = record.presigned_url;
        const tid = tempIds[index];

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', url, true);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setMediaPreviews((prev) =>
                prev.map((item) => (item.tempId === tid ? { ...item, progress: percent } : item))
              );
            }
          };

          xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error('Upload failed')));
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(file);
        });
      });

      await Promise.all(uploadPromises);
      return true;
    } catch (err) {
      console.error('Upload to S3 error:', err);
      return false;
    }
  };

  const getMediaTypeFromMime = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const validateFile = (file) => {
    const mediaType = getMediaTypeFromMime(file.type);
    const maxSizes = {
      image: MAX_IMAGE_MB * 1024 * 1024,
      video: MAX_VIDEO_MB * 1024 * 1024,
      audio: MAX_AUDIO_MB * 1024 * 1024,
      document: MAX_DOCUMENT_MB * 1024 * 1024,
    };

    if (file.size > maxSizes[mediaType]) {
      throw new Error(`${file.name}: File too large (max ${maxSizes[mediaType] / (1024 * 1024)}MB)`);
    }

    return mediaType;
  };

  const handleMediaUpload = async (files) => {
    if (!files || files.length === 0) return;
    if (!conversationId) {
      onError?.('No conversation selected');
      return;
    }
    
    if (!user || !token) {
      onError?.('User not authenticated');
      return;
    }

    setUploading(true);

    try {
      // Validate files
      const processedFiles = [];
      const errors = [];

      Array.from(files).forEach(file => {
        try {
          const mediaType = validateFile(file);
          processedFiles.push({ file, mediaType, tempId: makeTempId(file) });
        } catch (error) {
          errors.push(error.message);
        }
      });

      if (errors.length > 0) {
        toast.error('Some files were rejected:\n' + errors.join('\n'));
        if (processedFiles.length === 0) {
          setUploading(false);
          return;
        }
      }

      // Create previews
      const newPreviews = processedFiles.map(({ file, mediaType, tempId }) => ({
        file,
        mediaType,
        tempId,
        preview: mediaType === 'image' ? URL.createObjectURL(file) : null,
        progress: 0,
        uploaded: false,
        uuid: null,
      }));

      setMediaPreviews((prev) => [...prev, ...newPreviews]);

      // Build media objects for signing
      const mediaObjects = processedFiles.map(({ file, mediaType }) => ({
        file_name: file.name.split('.').slice(0, -1).join('.'),
        file_type: file.name.split('.').pop(),
        mime_type: file.type,
        file_size: file.size,
        is_primary: false,
        media_role: mediaType,
      }));

      const payload = {
        mediable_type: 'ChatMessage',
        conversation_id: conversationId,
        medias: mediaObjects,
      };

      // Get presigned URLs
      const signedUrlResponse = await getSignedUrls(payload);

      if (signedUrlResponse?.success && signedUrlResponse?.data?.media_records?.length) {
        const { media_records } = signedUrlResponse.data;
        const batchTempIds = processedFiles.map(p => p.tempId);

        // Update previews with UUIDs
        setMediaPreviews((prev) => {
          const updated = [...prev];
          for (let i = 0; i < media_records.length; i++) {
            const uuid = media_records[i].media.uuid;
            const tid = batchTempIds[i];
            const idx = updated.findIndex((p) => p.tempId === tid && p.uuid === null);
            if (idx !== -1) updated[idx] = { ...updated[idx], uuid };
          }
          return updated;
        });

        // Collect UUIDs
        const mediaIds = media_records.map((r) => r.media.uuid);
        setUploadedMediaIds((prev) => [...prev, ...mediaIds]);

        // Upload to S3
        const success = await uploadFilesToS3(
          processedFiles.map(p => p.file),
          media_records,
          batchTempIds
        );

        if (!success) {
          throw new Error('Upload to S3 failed');
        }

        // Confirm uploads
        try {
          await apiFetch(`${APP_BASE_URL}/api/media/file-uploaded`, {
            method: 'POST',
            body: JSON.stringify({ media_ids: mediaIds }),
          });

          // Update previews to show uploaded status
          setMediaPreviews((prev) => {
            return prev.map((item) => {
              if (mediaIds.includes(item.uuid)) {
                return { ...item, uploaded: true, progress: 100 };
              }
              return item;
            });
          });

          onUploadComplete?.(mediaIds);
          toast.success('Media uploaded successfully!');
        } catch (err) {
          console.error('file-uploaded confirm error', err);
          throw new Error('Failed to confirm upload');
        }
      } else {
        throw new Error('Failed to get presigned URLs');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error.message || 'Upload failed');
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = (tempId) => {
    setMediaPreviews((prev) => {
      const updated = prev.filter((item) => item.tempId !== tempId);
      
      // Clean up object URLs
      const removed = prev.find((item) => item.tempId === tempId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return updated;
    });
  };

  const clearAll = () => {
    // Clean up all object URLs
    mediaPreviews.forEach(item => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });
    
    setMediaPreviews([]);
    setUploadedMediaIds([]);
    setUploading(false);
  };

  return {
    mediaPreviews,
    uploading,
    uploadedMediaIds,
    handleMediaUpload,
    removeMedia,
    clearAll,
  };
};
