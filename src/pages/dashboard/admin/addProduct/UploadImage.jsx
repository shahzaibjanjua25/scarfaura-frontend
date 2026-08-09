import React, { useRef, useState } from 'react';
import axios from 'axios';



const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
// console.log("ENV:", import.meta.env);
// console.log("CLOUD:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
// console.log("PRESET:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
// console.log("EMAILJS (control):", import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
const UploadImage = ({
    name = 'images',
    images = [],
    setImages,
    setImage, // optional, keeps older single-image callers working
    required = false,
    max = MAX_IMAGES
}) => {
    const [uploads, setUploads] = useState([]); // [{ id, fileName, percent, status }]
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
        formData.append('file', file);                   // raw file, not base64
        formData.append('upload_preset', UPLOAD_PRESET);

        return axios
            .post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
                onUploadProgress: (e) => {
                    if (e.total) onProgress(Math.round((e.loaded * 100) / e.total));
                }
            })
            .then((res) => res.data.secure_url);
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        setError(null);

        if (!isConfigured) {
            setError('Image uploads are not configured. VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET are missing.');
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
            status: 'uploading'
        }));
        setUploads(batch);

        const setPercent = (id, percent) =>
            setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, percent } : u)));
        const setStatus = (id, status) =>
            setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));

        // Cloudinary handles concurrent uploads fine, so run them in parallel.
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

        const uploaded = results
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value);

        const failed = results
            .map((r, i) => (r.status === 'rejected' ? accepted[i].name : null))
            .filter(Boolean);

        if (uploaded.length > 0) commit([...images, ...uploaded]);
        if (failed.length > 0) {
            console.error('Cloudinary upload failures:', results.filter((r) => r.status === 'rejected'));
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
        <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    Product Images {required && <span className="text-red-500">*</span>}
                </label>
                <span className="text-xs text-gray-500">{images.length} / {max}</span>
            </div>

            {!isConfigured && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                    Cloudinary env vars are missing. Add VITE_CLOUDINARY_CLOUD_NAME and
                    VITE_CLOUDINARY_UPLOAD_PRESET to your .env, then restart the dev server.
                </p>
            )}

            <input
                ref={inputRef}
                type="file"
                name={name}
                id={name}
                multiple
                onChange={handleImageUpload}
                accept="image/*"
                disabled={loading || images.length >= max || !isConfigured}
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-primary file:text-white
                           hover:file:bg-indigo-600
                           focus:outline-none focus:ring-2 focus:ring-primary
                           disabled:opacity-60 disabled:cursor-not-allowed"
            />

            <p className="text-xs text-gray-500">
                Select several files at once. The first image is used as the thumbnail
                on cards and listings — reorder with the arrows.
            </p>

            {uploads.length > 0 && (
                <ul className="space-y-2" role="status">
                    {uploads.map((u) => (
                        <li key={u.id} className="text-xs">
                            <div className="flex justify-between mb-1">
                                <span className="truncate max-w-[70%] text-gray-600">{u.fileName}</span>
                                <span className={
                                    u.status === 'failed' ? 'text-red-600'
                                        : u.status === 'done' ? 'text-green-600'
                                            : 'text-gray-500'
                                }>
                                    {u.status === 'failed' ? 'Failed'
                                        : u.status === 'done' ? 'Done'
                                            : `${u.percent}%`}
                                </span>
                            </div>
                            <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-200 ${u.status === 'failed' ? 'bg-red-500' : 'bg-primary'
                                        }`}
                                    style={{ width: `${u.status === 'done' ? 100 : u.percent}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

            {images.length > 0 && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {images.map((url, index) => (
                        <li
                            key={`${url}-${index}`}
                            className={`relative border rounded-md overflow-hidden bg-gray-50 ${index === 0 ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
                                }`}
                        >
                            <div className="aspect-square">
                                <img
                                    src={url}
                                    alt={index === 0 ? 'Primary product image' : `Product image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {index === 0 && (
                                <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded">
                                    Primary
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => removeAt(index)}
                                aria-label={`Remove image ${index + 1}`}
                                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-gray-700 text-sm shadow hover:bg-red-500 hover:text-white transition-colors"
                            >
                                ×
                            </button>

                            <div className="flex items-center justify-between gap-1 p-1.5 bg-white border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => move(index, index - 1)}
                                    disabled={index === 0}
                                    aria-label={`Move image ${index + 1} earlier`}
                                    className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-100 disabled:opacity-30"
                                >
                                    ←
                                </button>

                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => move(index, 0)}
                                        className="px-2 py-1 text-[11px] text-primary rounded hover:bg-indigo-50"
                                    >
                                        Make primary
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => move(index, index + 1)}
                                    disabled={index === images.length - 1}
                                    aria-label={`Move image ${index + 1} later`}
                                    className="px-2 py-1 text-xs text-gray-600 rounded hover:bg-gray-100 disabled:opacity-30"
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