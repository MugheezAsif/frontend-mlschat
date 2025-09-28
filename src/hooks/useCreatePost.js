import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { addPost, addGroupPost } from '../store/slices/postSlice';
import { apiFetch } from '../lib/apiClient';

const MAX_VIDEO_MB = 20; // adjust to your backend limit

export const useCreatePost = (onPostCreated, onClose, type = 'post', slug, group) => {
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [postSlug, setPostSlug] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [uploadedMediaIds, setUploadedMediaIds] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [commentPermission, setCommentPermission] = useState('no_approval');

  const dispatch = useDispatch();
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

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter out duplicates by tempId
    const existingIds = new Set(mediaPreviews.map((m) => m.tempId));
    const freshFiles = files.filter((f) => !existingIds.has(makeTempId(f)));
    if (freshFiles.length === 0) return;

    // Validate video sizes
    const tooBigVideos = freshFiles.filter(
      (f) => f.type.startsWith('video/') && f.size > MAX_VIDEO_MB * 1024 * 1024
    );
    if (tooBigVideos.length) {
      toast.error(`Each video must be <= ${MAX_VIDEO_MB} MB`);
    }
    const validFiles = freshFiles.filter(
      (f) => !(f.type.startsWith('video/') && f.size > MAX_VIDEO_MB * 1024 * 1024)
    );
    if (validFiles.length === 0) return;

    // Compress images but not videos
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        if (file.type.startsWith('image/')) {
          const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
          try {
            return await imageCompression(file, options);
          } catch (err) {
            console.error(`Compression failed for ${file.name}`, err);
            return file;
          }
        }
        return file;
      })
    );

    // Build previews
    const batchTempIds = processedFiles.map(makeTempId);
    const newPreviews = processedFiles.map((file, i) => ({
      tempId: batchTempIds[i],
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      uuid: null,
    }));

    setMediaPreviews((prev) => [...prev, ...newPreviews]);
    setUploading(true);

    // Build media objects for signing
    const mediaObjects = processedFiles.map((file, index) => ({
      file_name: file.name.split('.').slice(0, -1).join('.'),
      file_type: file.name.split('.').pop(),
      mime_type: file.type,
      file_size: file.size,
      is_primary: mediaPreviews.length === 0 && index === 0,
      media_role: file.type.startsWith('video/') ? 'video' : 'image',
    }));

    const payload = {
      mediable_type: 'Post',
      medias: mediaObjects,
      ...(postSlug ? { post_slug: postSlug, slug: postSlug } : {}),
    };

    try {
      const signedUrlResponse = await getSignedUrls(payload);

      if (signedUrlResponse?.success && signedUrlResponse?.data?.media_records?.length) {
        const { media_records, slug: newSlug } = signedUrlResponse.data;

        if (!postSlug && newSlug) setPostSlug(newSlug);

        // Attach UUIDs to previews via tempId order mapping
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

        const success = await uploadFilesToS3(processedFiles, media_records, batchTempIds);
        if (!success) console.error('Upload failed');
      } else {
        console.error('Failed to get signed URLs');
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (indexToRemove) => {
    setMediaPreviews((prev) => {
      const removed = prev[indexToRemove];
      const updated = prev.filter((_, i) => i !== indexToRemove);
      if (removed?.uuid) {
        setUploadedMediaIds((ids) => ids.filter((id) => id !== removed.uuid));
      }
      return updated;
    });
  };

  const handleSavePost = async () => {
    // allow text-only, media-only, or both
    if (!postContent.trim() && uploadedMediaIds.length === 0) return;

    const slugToUse = postSlug || null;

    // Confirm uploaded media
    if (uploadedMediaIds.length > 0) {
      try {
        await apiFetch(`${APP_BASE_URL}/api/media/file-uploaded`, {
          method: 'POST',
          body: JSON.stringify({ media_ids: uploadedMediaIds }),
        });
      } catch (error) {
        console.error('Error confirming media upload:', error);
      }
    }

    const payload =
      type === 'group'
        ? { group_slug: slug, post_slug: slugToUse, content: postContent, visibility, comment_permission: commentPermission }
        : { post_slug: slugToUse, content: postContent, visibility, comment_permission: commentPermission };

    try {
      const data = await apiFetch(`${APP_BASE_URL}/api/posts`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data.success) {
        toast.success('Post created!');
        data.data.user = user;

        if (type === 'group') {
          if (group?.settings?.post_permission_required === false) {
            dispatch(addGroupPost(data.data));
          }
        } else {
          dispatch(addPost(data.data));
        }

        // Reset state
        setMediaPreviews([]);
        setUploading(false);
        setPostSlug(null);
        setPostContent('');
        setUploadedMediaIds([]);
        setVisibility('public');
        setCommentPermission('no_approval');

        if (typeof onClose === 'function') onClose(false);
        if (typeof onPostCreated === 'function') onPostCreated();
      } else {
        console.error('❌ Failed to create post:', data.message);
      }
    } catch (err) {
      console.error('❌ Error creating post:', err);
    }
  };

  return {
    mediaPreviews,
    uploading,
    postSlug,
    postContent,
    uploadedMediaIds,
    visibility,
    commentPermission,
    setMediaPreviews,
    setUploading,
    setPostSlug,
    setPostContent,
    setUploadedMediaIds,
    setVisibility,
    setCommentPermission,
    handleMediaChange, // renamed
    handleDeleteImage,
    handleSavePost,
  };
};
