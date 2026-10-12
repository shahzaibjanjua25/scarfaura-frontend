import React, { useRef, useState } from 'react';
import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const UploadImage = ({
  name = 'images',
  images = [],
  setImages,
  setImage,
  required = false,
  max = MAX_IMAGES,
}) => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const isConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);
  const loading = uploads.some((u) => u.status === 'uploading');

  const commit = (next) => {
    setImages(next);
    if (setImage) setImage(next[0] || '');
  };

  const uploadToCloudinary = (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    return axios
      .post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
        onUploadProgress: (e) => {
          if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
      })
      .then((res) => res.data.secure_url);
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setError(null);

    if (!isConfigured) {
      setError(
        'Image uploads are not configured. VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are missing.'
      );
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${max} images.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    const accepted = [];
    const problems = [];

    files.slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        problems.push(`${file.name} is not an image`);
      } else if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name} is over 10 MB`);
      } else {
        accepted.push(file);
      }
    });

    if (files.length > remaining) {
      problems.push(`Only ${remaining} more image${remaining === 1 ? '' : 's'} allowed`);
    }

    if (accepted.length === 0) {
      setError(problems.join(' · '));
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    const batch = accepted.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      fileName: file.name,
      percent: 0,
      status: 'uploading',
    }));
    setUploads(batch);

    const setPercent = (id, percent) =>
      setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, percent } : u)));
    const setStatus = (id, status) =>
      setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));

    const results = await Promise.allSettled(
      accepted.map((file, i) => {
        const { id } = batch[i];
        return uploadToCloudinary(file, (p) => setPercent(id, p))
          .then((url) => {
            setStatus(id, 'done');
            return url;
          })
          .catch((err) => {
            console.error('CLOUDINARY SAYS:', err.response?.data?.error?.message || err.message);
            setStatus(id, 'failed');
            throw err;
          });
      })
    );

    const uploaded = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
    const failed = results
      .map((r, i) => (r.status === 'rejected' ? accepted[i].name : null))
      .filter(Boolean);

    if (uploaded.length > 0) commit([...images, ...uploaded]);
    if (failed.length > 0) {
      problems.push(`Failed to upload: ${failed.join(', ')}`);
    }

    setError(problems.length > 0 ? problems.join(' · ') : null);
    setUploads([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (index) => commit(images.filter((_, i) => i !== index));

  const move = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    commit(next);
  };

  return (
    <div className="ui-root">
      <style>{`
        .ui-root { display: flex; flex-direction: column; gap: 0.85rem; }
        .ui-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .ui-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #241C1E;
        }
        .ui-label .req { color: #5A1A2B; margin-left: 2px; }
        .ui-count {
          font-size: 0.75rem;
          color: #8A7F7B;
          font-variant-numeric: tabular-nums;
        }
        .ui-warn {
          font-size: 0.85rem;
          color: #B91C1C;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 0.7rem 0.9rem;
        }
        .ui-drop {
          position: relative;
          border: 2px dashed #E7DFDA;
          border-radius: 14px;
          background: #FAF7F5;
          padding: 1.5rem 1.25rem;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .ui-drop:hover:not(.ui-drop--disabled) {
          border-color: #5A1A2B;
          background: #FDF9F7;
        }
        .ui-drop--disabled { opacity: 0.55; pointer-events: none; }
        .ui-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .ui-drop-icon {
          width: 2.5rem;
          height: 2.5rem;
          margin: 0 auto 0.65rem;
          border-radius: 50%;
          background: rgba(90,26,43,0.08);
          display: grid;
          place-items: center;
          color: #5A1A2B;
          font-size: 1.25rem;
        }
        .ui-drop-text {
          font-size: 0.9rem;
          color: #241C1E;
          font-weight: 500;
          margin: 0 0 0.25rem;
        }
        .ui-drop-hint {
          font-size: 0.75rem;
          color: #8A7F7B;
          margin: 0;
        }
        .ui-progress-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.55rem; }
        .ui-progress-item { font-size: 0.78rem; }
        .ui-progress-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .ui-progress-name {
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #4B4543;
        }
        .ui-progress-status { font-weight: 600; }
        .ui-progress-status--fail { color: #DC2626; }
        .ui-progress-status--done { color: #059669; }
        .ui-progress-status--up { color: #8A7F7B; }
        .ui-bar {
          height: 4px;
          width: 100%;
          background: #E7DFDA;
          border-radius: 999px;
          overflow: hidden;
        }
        .ui-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.2s;
          background: #5A1A2B;
        }
        .ui-bar-fill--fail { background: #DC2626; }
        .ui-error {
          font-size: 0.85rem;
          color: #B91C1C;
          margin: 0;
        }
        .ui-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
          list-style: none;
          margin: 0;
          padding: 0.35rem 0 0;
        }
        @media (min-width: 480px) {
          .ui-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .ui-thumb {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #F2ECE8;
          border: 1.5px solid #E7DFDA;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ui-thumb--primary {
          border-color: #5A1A2B;
          box-shadow: 0 0 0 1px #5A1A2B;
        }
        .ui-thumb-img {
          aspect-ratio: 1;
          width: 100%;
          object-fit: cover;
          display: block;
        }
        .ui-primary-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: #5A1A2B;
          color: #fff;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.2rem 0.45rem;
          border-radius: 999px;
        }
        .ui-remove {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: none;
          display: grid;
          place-items: center;
          font-size: 1rem;
          color: #4B4543;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: background 0.15s, color 0.15s;
        }
        .ui-remove:hover { background: #DC2626; color: #fff; }
        .ui-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.25rem;
          padding: 0.4rem 0.35rem;
          background: #fff;
          border-top: 1px solid #F2ECE8;
        }
        .ui-ctrl {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          color: #8A7F7B;
          background: none;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .ui-ctrl:hover:not(:disabled) { background: #F2ECE8; color: #241C1E; }
        .ui-ctrl:disabled { opacity: 0.3; cursor: not-allowed; }
        .ui-ctrl--primary {
          font-size: 0.68rem;
          color: #5A1A2B;
        }
        .ui-ctrl--primary:hover { background: rgba(90,26,43,0.08); }
      `}</style>

      <div className="ui-head">
        <label htmlFor={name} className="ui-label">
          Product Images {required && <span className="req">*</span>}
        </label>
        <span className="ui-count">
          {images.length} / {max}
        </span>
      </div>

      {!isConfigured && (
        <p className="ui-warn">
          Cloudinary env vars are missing. Add VITE_CLOUDINARY_CLOUD_NAME and
          VITE_CLOUDINARY_UPLOAD_PRESET to your .env, then restart the dev server.
        </p>
      )}

      <div
        className={`ui-drop ${loading || images.length >= max || !isConfigured ? 'ui-drop--disabled' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          id={name}
          multiple
          onChange={handleImageUpload}
          accept="image/*"
          disabled={loading || images.length >= max || !isConfigured}
          className="ui-input"
        />
        <div className="ui-drop-icon" aria-hidden="true">
          <i className="ri-image-add-line" />
        </div>
        <p className="ui-drop-text">Click or drag images here</p>
        <p className="ui-drop-hint">
          Up to {max} images · first becomes the thumbnail · max 10 MB each
        </p>
      </div>

      {uploads.length > 0 && (
        <ul className="ui-progress-list" role="status">
          {uploads.map((u) => (
            <li key={u.id} className="ui-progress-item">
              <div className="ui-progress-row">
                <span className="ui-progress-name">{u.fileName}</span>
                <span
                  className={`ui-progress-status ${
                    u.status === 'failed'
                      ? 'ui-progress-status--fail'
                      : u.status === 'done'
                        ? 'ui-progress-status--done'
                        : 'ui-progress-status--up'
                  }`}
                >
                  {u.status === 'failed' ? 'Failed' : u.status === 'done' ? 'Done' : `${u.percent}%`}
                </span>
              </div>
              <div className="ui-bar">
                <div
                  className={`ui-bar-fill ${u.status === 'failed' ? 'ui-bar-fill--fail' : ''}`}
                  style={{ width: `${u.status === 'done' ? 100 : u.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="ui-error" role="alert">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="ui-grid">
          {images.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className={`ui-thumb ${index === 0 ? 'ui-thumb--primary' : ''}`}
            >
              <img
                src={url}
                alt={index === 0 ? 'Primary product image' : `Product image ${index + 1}`}
                className="ui-thumb-img"
              />
              {index === 0 && <span className="ui-primary-badge">Primary</span>}
              <button
                type="button"
                className="ui-remove"
                onClick={() => removeAt(index)}
                aria-label={`Remove image ${index + 1}`}
              >
                ×
              </button>
              <div className="ui-controls">
                <button
                  type="button"
                  className="ui-ctrl"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move image ${index + 1} earlier`}
                >
                  ←
                </button>
                {index !== 0 && (
                  <button
                    type="button"
                    className="ui-ctrl ui-ctrl--primary"
                    onClick={() => move(index, 0)}
                  >
                    Make primary
                  </button>
                )}
                <button
                  type="button"
                  className="ui-ctrl"
                  onClick={() => move(index, index + 1)}
                  disabled={index === images.length - 1}
                  aria-label={`Move image ${index + 1} later`}
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadImage;
