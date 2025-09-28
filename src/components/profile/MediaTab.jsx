// import React, { useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchUserMedias,
//   selectMediaItems,
//   selectMediaLoading,
//   selectMediaError,
// } from '../../store/slices/mediaSlice';
// import PhotoLightbox from '../modal/PhotoLightbox';

// const isImage = (item) => {
//   const mime = item.mimeType || item.mime_type || '';
//   const ext = (item.fileType || item.file_type || '').toLowerCase();
//   return (
//     mime.startsWith('image/') ||
//     ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'heic'].includes(ext)
//   );
// };

// const MediaTab = () => {
//   const dispatch = useDispatch();
//   const items = useSelector(selectMediaItems);
//   const loading = useSelector(selectMediaLoading);
//   const error = useSelector(selectMediaError);

//   const [viewerIndex, setViewerIndex] = useState(null);

//   useEffect(() => {
//     dispatch(fetchUserMedias());
//   }, [dispatch]);

//   const photos = useMemo(() => {
//     const list = Array.isArray(items) ? items : [];
//     return list
//       .filter(isImage)
//       .sort(
//         (a, b) =>
//           new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0)
//       );
//   }, [items]);

//   const onRefresh = () => dispatch(fetchUserMedias());

//   const openViewer = (idx) => setViewerIndex(idx);
//   const closeViewer = () => setViewerIndex(null);
//   const prev = () => {
//     if (!photos.length) return;
//     setViewerIndex((i) => (i == null ? i : (i + photos.length - 1) % photos.length));
//   };
//   const next = () => {
//     if (!photos.length) return;
//     setViewerIndex((i) => (i == null ? i : (i + 1) % photos.length));
//   };

//   return (
//     <div>
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <div>
//           <h5 className="mb-0">Photos</h5>
//           <small className="text-muted">
//             {loading ? 'Loading…' : `${photos.length} photo${photos.length === 1 ? '' : 's'}`}
//           </small>
//         </div>
//         <button
//           type="button"
//           className="btn btn-sm btn-outline-secondary"
//           onClick={onRefresh}
//           disabled={loading}
//         >
//           Refresh
//         </button>
//       </div>


//       {loading && (
//         <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2 g-sm-3">
//           {Array.from({ length: 12 }).map((_, idx) => (
//             <div className="col" key={idx}>
//               <div
//                 className="rounded-3 bg-light placeholder w-100"
//                 style={{ aspectRatio: '1 / 1' }}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Empty */}
//       {!loading && photos.length === 0 && (
//         <div className="text-center text-muted py-5">
//           <p>No photos yet.</p>
//         </div>
//       )}

//       {/* Grid */}
//       {!loading && photos.length > 0 && (
//         <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2 g-sm-3">
//           {photos.map((p, idx) => (
//             <div className="col" key={p.uuid || p.id || p.url}>
//               <button
//                 type="button"
//                 className="p-0 border-0 bg-transparent w-100"
//                 style={{ cursor: 'zoom-in' }}
//                 onClick={() => openViewer(idx)}
//                 title={p.fileName || ''}
//               >
//                 <div
//                   className="position-relative overflow-hidden rounded-3 shadow-sm"
//                   style={{ aspectRatio: '1 / 1' }}
//                 >
//                   <img
//                     src={p.url || p.file_url}
//                     alt={p.fileName || 'photo'}
//                     className="w-100 h-100 d-block"
//                     style={{ objectFit: 'cover' }}
//                     loading="lazy"
//                   />
//                 </div>
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Lightbox */}
//       {viewerIndex != null && photos.length > 0 && (
//         <PhotoLightbox
//           items={photos}
//           index={viewerIndex}
//           onClose={closeViewer}
//           onPrev={prev}
//           onNext={next}
//         />
//       )}
//     </div>
//   );
// };

// export default MediaTab;

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserMedias,
  selectMediaItems,
  selectMediaLoading,
  selectMediaError,
} from '../../store/slices/mediaSlice';
import PhotoLightbox from '../modal/PhotoLightbox';

const ROLES_ORDER = ['profile', 'cover', 'primary', 'gallery', 'image', 'video'];

const isImage = (item) => {
  const mime = (item.mimeType || item.mime_type || '').toLowerCase();
  const ext = (item.fileType || item.file_type || '').toLowerCase();
  return (
    mime.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'heic'].includes(ext)
  );
};

const isVideo = (item) => {
  const mime = (item.mimeType || item.mime_type || '').toLowerCase();
  const ext = (item.fileType || item.file_type || '').toLowerCase();
  return mime.startsWith('video/') || ['mp4', 'mov', 'webm', 'm4v', 'ogg'].includes(ext);
};

const titleForRole = (role) => {
  switch (role) {
    case 'profile': return 'Profile Photos';
    case 'cover': return 'Cover Photos';
    case 'primary': return 'Primary Media';
    case 'gallery': return 'Gallery';
    case 'image': return 'Images';
    case 'video': return 'Videos';
    default: return role;
  }
};

const MediaTab = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectMediaItems);
  const loading = useSelector(selectMediaLoading);
  const error = useSelector(selectMediaError);

  // Lightbox state scoped to a role/section
  const [viewer, setViewer] = useState({ role: null, index: null });

  useEffect(() => {
    dispatch(fetchUserMedias());
  }, [dispatch]);

  // Group by role with fallbacks; sort each bucket by date desc
  const grouped = useMemo(() => {
    const base = Object.fromEntries(ROLES_ORDER.map((r) => [r, []]));
    const list = Array.isArray(items) ? items : [];

    for (const m of list) {
      const roleRaw = (m.role || '').toLowerCase();
      let role = ROLES_ORDER.includes(roleRaw) ? roleRaw : null;

      // Fallback roles if api role is missing/unknown
      if (!role) {
        role = isVideo(m) ? 'video' : 'image';
      }

      base[role] = base[role] || []; // safety
      base[role].push(m);
    }

    // sort each bucket newest → oldest
    for (const r of Object.keys(base)) {
      base[r].sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0) -
          new Date(a.createdAt || a.updatedAt || 0)
      );
    }

    return base;
  }, [items]);

  const onRefresh = () => dispatch(fetchUserMedias());

  const openViewer = (role, idx) => setViewer({ role, index: idx });
  const closeViewer = () => setViewer({ role: null, index: null });
  const prev = () => {
    const arr = (grouped[viewer.role] || []).filter(isImage);
    if (!arr.length) return;
    setViewer((v) => ({ ...v, index: (v.index + arr.length - 1) % arr.length }));
  };
  const next = () => {
    const arr = (grouped[viewer.role] || []).filter(isImage);
    if (!arr.length) return;
    setViewer((v) => ({ ...v, index: (v.index + 1) % arr.length }));
  };

  // Render a single section (role)
  const Section = ({ role }) => {
    const itemsForRole = grouped[role] || [];
    if (!itemsForRole.length) return null;

    const isVideoSection = role === 'video';
    const displayItems = isVideoSection ? itemsForRole.filter(isVideo) : itemsForRole.filter(isImage);

    if (!displayItems.length) return null;

    return (
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h6 className="mb-0">{titleForRole(role)}</h6>
          <small className="text-muted">
            {displayItems.length} {isVideoSection ? 'video' : 'photo'}{displayItems.length === 1 ? '' : 's'}
          </small>
        </div>

        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2 g-sm-3">
          {displayItems.map((m, idx) => (
            <div className="col" key={m.uuid || m.id || m.url}>
              {isVideoSection ? (
                <div
                  className="position-relative overflow-hidden rounded-3 shadow-sm w-100"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <video
                    src={m.url || m.file_url}
                    className="w-100 h-100 d-block"
                    style={{ objectFit: 'cover' }}
                    controls
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="p-0 border-0 bg-transparent w-100"
                  style={{ cursor: 'zoom-in' }}
                  onClick={() => openViewer(role, idx)}
                  title={m.fileName || ''}
                >
                  <div
                    className="position-relative overflow-hidden rounded-3 shadow-sm"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <img
                      src={m.url || m.file_url}
                      alt={m.fileName || 'photo'}
                      className="w-100 h-100 d-block"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const viewerImages = viewer.role
    ? (grouped[viewer.role] || []).filter(isImage)
    : [];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="mb-0">Your Media</h5>
          <small className="text-muted">
            {loading ? 'Loading…' : `${(items || []).length} item${(items || []).length === 1 ? '' : 's'}`}
          </small>
          {error && (
            <div className="text-danger ms-2" role="alert">
              {error}
            </div>
          )}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-2 g-sm-3">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div className="col" key={idx}>
              <div
                className="rounded-3 bg-light placeholder w-100"
                style={{ aspectRatio: '1 / 1' }}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && (!items || items.length === 0) && (
        <div className="text-center text-muted py-5">
          <p>No media yet.</p>
        </div>
      )}

      {!loading && items && items.length > 0 && (
        <>
          {ROLES_ORDER.map((role) => (
            <Section key={role} role={role} />
          ))}
        </>
      )}

      {viewer.role && viewer.index != null && viewerImages.length > 0 && (
        <PhotoLightbox
          items={viewerImages}
          index={viewer.index}
          onClose={closeViewer}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
};

export default MediaTab;

