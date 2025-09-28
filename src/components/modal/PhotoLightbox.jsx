import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faUpRightFromSquare,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from '@fortawesome/free-solid-svg-icons';

const PhotoLightbox = ({ items, index, onClose, onPrev, onNext }) => {
  const [scale, setScale] = useState(1);
  const imgRef = useRef(null);

  useEffect(() => setScale(1), [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const preload = (i) => {
      if (i >= 0 && i < items.length) {
        const src = items[i].url || items[i].file_url;
        const img = new Image();
        img.src = src;
      }
    };
    preload(index + 1);
    preload(index - 1);
  }, [index, items]);

  if (index == null) return null;
  const item = items[index];
  if (!item) return null;

  const src = item.url || item.file_url;
  const fileName = item.fileName || item.raw?.file_name || '';
  const createdAt = item.createdAt || item.raw?.created_at;

  return createPortal(
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ background: 'rgba(0,0,0,0.9)', zIndex: 1060 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="d-flex flex-column h-100" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ color: '#fff' }}>
          <div className="d-flex flex-column">
            <strong className="small">{fileName || 'Photo'}</strong>
            {createdAt && <small className="text-light">{new Date(createdAt).toLocaleString()}</small>}
          </div>
          <div className="d-flex gap-2">
            <a
              className="btn btn-sm btn-outline-light"
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original"
            >
              <FontAwesomeIcon icon={faUpRightFromSquare} />
            </a>
            <a className="btn btn-sm btn-outline-light" href={src} download title="Download">
              <FontAwesomeIcon icon={faDownload} />
            </a>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
              title="Zoom in"
            >
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
            </button>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setScale((s) => Math.max(1, s - 0.25))}
              title="Zoom out"
            >
              <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
            </button>
            <button className="btn btn-sm btn-light" onClick={onClose} title="Close">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative">
          <button
            className="btn btn-light position-absolute start-0 ms-3"
            style={{ borderRadius: '999px' }}
            onClick={onPrev}
            aria-label="Previous"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div
            className="d-flex align-items-center justify-content-center"
            style={{ maxWidth: '95vw', maxHeight: '85vh', overflow: 'hidden' }}
          >
            <img
              ref={imgRef}
              src={src}
              alt={fileName || 'photo'}
              className="d-block"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${scale})`,
                transition: 'transform 120ms ease',
              }}
            />
          </div>

          <button
            className="btn btn-light position-absolute end-0 me-3"
            style={{ borderRadius: '999px' }}
            onClick={onNext}
            aria-label="Next"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PhotoLightbox;
