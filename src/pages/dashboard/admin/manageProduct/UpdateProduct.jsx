import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import TextInput from '../addProduct/TextInput';
import UploadImage from '../addProduct/UploadImage';
import SelectInput from '../addProduct/SelectInput';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';

const categories = [
    { label: 'Printed Hijabs', value: 'Printed Hijabs' },
    { label: 'Geo569rgette Hijabs', value: 'Geo569rgette Hijabs' },
    { label: 'Modal Hijabs', value: 'Modal Hijabs' },
    { label: 'Jersey Hijabs', value: 'Jersey Hijabs' },
    { label: 'Deer Prints', value: 'Deer Prints' },
    { label: 'Leopard Prints', value: 'Leopard Prints' }
];

const colors = [
    { label: 'Select Color', value: '' },
    { label: 'Black', value: 'black' },
    { label: 'Brown', value: 'brown' },
    { label: 'Maroon', value: 'maroon' },
    { label: 'Zinc', value: 'zinc' },
    { label: 'Navy Blue', value: 'navy blue' },
    { label: 'White', value: 'white' },
    { label: 'Skin', value: 'skin' },
    { label: 'Burgundy', value: 'burgundy' },
    { label: 'Purple', value: 'purple' },
    { label: 'Grey', value: 'grey' },
    { label: 'Plum', value: 'plum' },
    { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' },
    { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' },
    { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' },
    { label: 'Sage Green', value: 'sagegreen' },
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        categories: [], // ✅ Changed to array for multi-select
        color: '',
        price: '',
        oldPrice: '',
        description: '',
        image: ''
    });

    const [newImage, setNewImage] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const { data: productData, isLoading, error, refetch } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData?.product) {
            const { name, categories, color, price, oldPrice, description, image } = productData.product;
            setProduct({
                name: name || '',
                // ✅ Handle both array and single category
                categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
                color: color || '',
                price: price || '',
                oldPrice: oldPrice || '',
                description: description || '',
                image: image || ''
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle category toggle (multi-select)
    const handleCategoryToggle = (categoryValue) => {
        setProduct(prev => {
            const currentCategories = prev.categories || [];
            if (currentCategories.includes(categoryValue)) {
                // Remove category
                const updated = currentCategories.filter(c => c !== categoryValue);
                return { ...prev, categories: updated };
            } else {
                // Add category
                return { ...prev, categories: [...currentCategories, categoryValue] };
            }
        });
    };

    const handleImageChange = (image) => {
        setNewImage(image);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, categories, color, price, oldPrice, description } = product;

        // ✅ Check if at least one category is selected
        if (!name || !categories || categories.length === 0 || !price || !description) {
            setNotification({ show: true, type: 'error', message: 'Please fill in all required fields and select at least one category' });
            return;
        }

        // ✅ Color is only required if "Geo569rgette Hijabs" is selected
        const isColorRequired = categories.includes('Geo569rgette Hijabs');
        if (isColorRequired && !color) {
            setNotification({ show: true, type: 'error', message: 'Color is required for Geo569rgette Hijabs category' });
            return;
        }

        try {
            const updatedProduct = {
                ...product,
                categories: product.categories, // ✅ Send as array
                image: newImage || product.image,
                author: user?._id
            };

            await updateProduct({ id, ...updatedProduct }).unwrap();
            setNotification({ show: true, type: 'success', message: 'Product updated successfully!' });

            setTimeout(() => navigate('/dashboard/manage-products'), 1500);
        } catch (err) {
            console.error('Update failed:', err);
            setNotification({
                show: true,
                type: 'error',
                message: err.data?.message || 'Update failed. Try again.'
            });
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><div className="loader" /></div>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                Error loading product: {error.message}
            </div>
        );
    }

    const isColorRequired = product.categories.includes('Geo569rgette Hijabs');

    return (
        <div className="container mx-auto mt-8 px-4">
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {notification.message}
                    <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4">×</button>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Update Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                <TextInput label="Product Name" name="name" value={product.name} onChange={handleChange} required />

                {/* ✅ Multi-category selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label key={category.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                                <input
                                    type="checkbox"
                                    checked={product.categories.includes(category.value)}
                                    onChange={() => handleCategoryToggle(category.value)}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{category.label}</span>
                            </label>
                        ))}
                    </div>
                    {product.categories.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {product.categories.length} category{product.categories.length > 1 ? 'ies' : ''} selected
                        </p>
                    )}
                </div>

                {/* Color field with conditional required indicator */}
                <div>
                    <SelectInput
                        label="Color"
                        name="color"
                        value={product.color}
                        onChange={handleChange}
                        options={colors}
                        required={isColorRequired}
                    />
                    {isColorRequired && (
                        <p className="text-xs text-amber-600 mt-1">
                            ⚠️ Color is required when "Geo569rgette Hijabs" is selected
                        </p>
                    )}
                    {product.categories.length > 0 && !isColorRequired && (
                        <p className="text-xs text-gray-400 mt-1">
                            ℹ️ Color is optional for selected categories
                        </p>
                    )}
                </div>

                <TextInput label="Price" name="price" type="number" value={product.price} onChange={handleChange} required />
                <TextInput label="Old Price" name="oldPrice" type="number" value={product.oldPrice} onChange={handleChange} />

                <UploadImage value={newImage || product.image} setImage={handleImageChange} />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        rows={6}
                        name="description"
                        id="description"
                        value={product.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>

                <button type="submit" disabled={isUpdating} className="w-full bg-primary text-white py-3 px-4 rounded-md">
                    {isUpdating ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;