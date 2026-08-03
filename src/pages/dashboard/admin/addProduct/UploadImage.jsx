import React, { useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, setImage, required = false }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [error, setError] = useState(null);

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadSingleImage = async (base64) => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await axios.post(`${getBaseUrl()}/uploadImage`, { image: base64 });
            const imageUrl = res.data;
            setUrl(imageUrl);
            setImage(imageUrl);
        } catch (error) {
            console.error('Image upload failed:', error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            const base64 = await convertBase64(files[0]);
            await uploadSingleImage(base64);
        } catch (err) {
            console.error('Image conversion failed:', err);
            setError('Invalid image file. Please try another.');
        }
    };

    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                Upload Image {required && <span className="text-red-500">*</span>}
            </label>
            
            <input
                type="file"
                name={name}
                id={name}
                onChange={handleImageUpload}
                accept="image/*"
                className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary file:text-white
                          hover:file:bg-indigo-600
                          focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
            />
            
            {loading && (
                <div className="flex items-center text-sm text-blue-600">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading image...
                </div>
            )}
            
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            
            {url && (
                <div className="mt-2">
                    <p className="text-sm text-green-600 mb-2">Image uploaded successfully!</p>
                    <div className="max-w-xs border rounded-md overflow-hidden">
                        <img 
                            src={url} 
                            alt="Uploaded preview" 
                            className="w-full h-auto object-contain"
                            onError={() => setError('Failed to load image preview')}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadImage;