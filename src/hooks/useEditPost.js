import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';
import { updatePost } from '../store/slices/postSlice';
import { apiFetch } from '../lib/apiClient';

const MAX_VIDEO_MB = 50; // adjust to your backend limit

export const useEditPost = (post, onPostUpdated, onClose) => {
  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [commentPermission, setCommentPermission] = useState('no_approval');
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletedMediaUUIDs, setDeletedMediaUUIDs] = useState([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();

  const makeTempId = (file) => `${file.name}-${file.lastModified}-${file.size}`;

  const inferTypeFromServer = (m) => {
    if (m.media_role) return m.media_role; // 'image' | 'video'
    if (m.mime_type?.startsWith?.('video/')) return 'video';
    if (m.mime_type?.startsWith?.('image/')) return 'image';
    const u = (m.file_url || '').toLowerCase();
    if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(u)) return 'video';
    return 'image';
  };

  useEffect(() => {
    if (post) {
      setPostContent(post.content || '');
      setVisibility(post.visibility || 'public');
      setCommentPermission(post.comment_permission || 'no_approval');
      setDeletedMediaUUIDs([]);
      setMediaPreviews(
        (post.media || []).map((m) => ({
          previewUrl: m.file_url,
          uuid: m.uuid,
          uploaded: true,
          existing: true,
          progress: 100,
          type: inferTypeFromServer(m),
        }))
      );
    }
  }, [post]);

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
      console.error('Upload error:', err);
      return false;
    }
  };

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingMedia(true);

    // De-dupe by tempId
    const existingIds = new Set(mediaPreviews.filter(p => p.tempId).map((p) => p.tempId));
    const freshFiles = files.filter((f) => !existingIds.has(makeTempId(f)));
    if (freshFiles.length === 0) {
      setIsUploadingMedia(false);
      e.target.value = '';
      return;
    }

    // Validate videos by size
    const tooBig = freshFiles.filter(
      (f) => f.type.startsWith('video/') && f.size > MAX_VIDEO_MB * 1024 * 1024
    );
    if (tooBig.length) {
      toast.error(`Each video must be <= ${MAX_VIDEO_MB} MB`);
    }
    const validFiles = freshFiles.filter(
      (f) => !(f.type.startsWith('video/') && f.size > MAX_VIDEO_MB * 1024 * 1024)
    );
    if (validFiles.length === 0) {
      setIsUploadingMedia(false);
      e.target.value = '';
      return;
    }

    // Compress images only
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        if (file.type.startsWith('image/')) {
          try {
            return await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true });
          } catch {
            return file;
          }
        }
        return file;
      })
    );

    // Build previews for UI
    const batchTempIds = processedFiles.map(makeTempId);
    const newPreviews = processedFiles.map((file, i) => ({
      tempId: batchTempIds[i],
      file,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      existing: false,
    }));
    setMediaPreviews((prev) => [...prev, ...newPreviews]);

    // Sign URLs
    const mediaObjects = processedFiles.map((file) => ({
      file_name: file.name.split('.').slice(0, -1).join('.'),
      file_type: file.name.split('.').pop(),
      mime_type: file.type,
      file_size: file.size,
      is_primary: false,
      media_role: file.type.startsWith('video/') ? 'video' : 'image',
    }));

    const payload = {
      post_slug: post.slug,
      mediable_type: 'Post',
      medias: mediaObjects,
    };

    const signedUrlResponse = await getSignedUrls(payload);

    if (signedUrlResponse?.success && signedUrlResponse.data?.media_records?.length) {
      const { media_records } = signedUrlResponse.data;

      const success = await uploadFilesToS3(processedFiles, media_records, batchTempIds);
      if (!success) {
        toast.error('Failed to upload');
      }

      // Confirm uploads
      const newUUIDs = media_records.map((r) => r.media.uuid);
      try {
        await apiFetch(`${APP_BASE_URL}/api/media/file-uploaded`, {
          method: 'POST',
          body: JSON.stringify({ media_ids: newUUIDs }),
        });
      } catch (err) {
        console.error('file-uploaded confirm error', err);
      }

      // Attach UUIDs via tempId
      setMediaPreviews((prev) => {
        const updated = [...prev];
        for (let i = 0; i < media_records.length; i++) {
          const uuid = media_records[i].media.uuid;
          const tid = batchTempIds[i];
          const idx = updated.findIndex((p) => p.tempId === tid && !p.existing);
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              uuid,
              uploaded: true,
              progress: 100,
              tempId: undefined,
            };
          }
        }
        return updated;
      });
    }

    setIsUploadingMedia(false);
    e.target.value = '';
  };

  const handleDeleteImage = (indexToRemove) => {
    const removed = mediaPreviews[indexToRemove];

    if (removed?.existing && removed.uuid) {
      setDeletedMediaUUIDs((prev) => [...prev, removed.uuid]);
    }

    if (!removed?.existing && removed?.previewUrl?.startsWith('blob:')) {
      try { URL.revokeObjectURL(removed.previewUrl); } catch {}
    }

    setMediaPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSavePost = async () => {
    if (!post?.slug) return;

    const nothingToSave =
      postContent.trim().length === 0 &&
      mediaPreviews.length === 0 &&
      deletedMediaUUIDs.length === 0;

    if (nothingToSave) return;

    const hasPending = mediaPreviews.some((m) => !m.existing && !m.uploaded);
    if (hasPending) {
      toast.info('Please wait—media is still uploading.');
      return;
    }

    setUploading(true);
    try {
      const requestBody = {
        content: postContent,
        visibility,
        comment_permission: commentPermission,
        deleted_media: deletedMediaUUIDs,
      };

      const data = await apiFetch(`${APP_BASE_URL}/api/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      });
      if (data.success) {
        const incoming = data.data;
        const merged = {
          ...post,
          ...incoming,

          user: incoming.user ?? post.user,
          groups: incoming.groups ?? post.groups,
          group_posts: incoming.group_posts ?? post.group_posts,
          media_urls: incoming.media_urls ?? post.media_urls,
          media: incoming.media ?? post.media,

          like_count: incoming.like_count ?? post.like_count,
          comment_count: incoming.comment_count ?? post.comment_count,
          share_count: incoming.share_count ?? post.share_count,
          liked_by: incoming.liked_by ?? post.liked_by,
          saved_by: incoming.saved_by ?? post.saved_by,
        };

        toast.success('Post updated!');
        setDeletedMediaUUIDs([]);
        dispatch(updatePost(merged));
        onPostUpdated?.(merged);
        onClose?.();
      } else {
        toast.error(data.message || 'Failed to update post');
      }
    } catch (err) {
      console.error('❌ Error saving post:', err);
      toast.error('Error saving post');
    } finally {
      setUploading(false);
    }
  };

  return {
    mediaPreviews,
    uploading,
    postContent,
    visibility,
    commentPermission,
    setPostContent,
    setVisibility,
    setCommentPermission,
    handleMediaChange,
    handleDeleteImage,
    handleSavePost,
    isUploadingMedia,
  };
};
