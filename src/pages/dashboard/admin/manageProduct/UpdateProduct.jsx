import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import TextInput from '../addProduct/TextInput';
import UploadImage from '../addProduct/UploadImage';
import SelectInput from '../addProduct/SelectInput';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';

const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Tops and tees', value: 'Tops and tees' },
    { label: 'Shirts and polos', value: 'Shirts and polos' },
    { label: 'Bottoms', value: 'Bottoms' },
    { label: 'Jacket and coats', value: 'Jacket and coats' },
    { label: 'New Arrivals (Boys)', value: 'New Arrivals (Boys)' },
    { label: 'New Arrivals (Girls)', value: 'New Arrivals (Girls)' },
    { label: 'Kids Shirts', value: 'kids-shirts' },
    { label: 'Kids Casuals', value: 'kids-casuals' },
    { label: 'Sweatshirts and hoodies', value: 'Sweatshirts and hoodies' }
];

const colors = [
    { label: 'Select Color', value: '' },
    { label: 'Black', value: 'black' },
    { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' },
    { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' },
    { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' }
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        oldPrice: '',
        age: '',
        description: '',
        image: ''
    });

    const [newImage, setNewImage] = useState(null);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const { data: productData, isLoading, error, refetch } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData?.product) {
            const { name, category, color, price, oldPrice, age, description, image } = productData.product;
            setProduct({
                name: name || '',
                category: category || '',
                color: color || '',
                price: price || '',
                oldPrice: oldPrice || '',
                age: age || '',
                description: description || '',
                image: image || ''
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (image) => {
        setNewImage(image);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, category, color, price, oldPrice, age, description } = product;

        if (!name || !category || !color || !price || !oldPrice || !age || !description) {
            setNotification({ show: true, type: 'error', message: 'Please fill in all required fields' });
            return;
        }

        try {
            const updatedProduct = {
                ...product,
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

    return (
        <div className="container mx-auto mt-8 px-4">
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                    <button onClick={() => setNotification({ ...notification, show: false })} className="ml-4">×</button>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Update Product</h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                <TextInput label="Product Name" name="name" value={product.name} onChange={handleChange} required />
                <SelectInput label="Category" name="category" value={product.category} onChange={handleChange} options={categories} required />
                <SelectInput label="Color" name="color" value={product.color} onChange={handleChange} options={colors} required />

                <TextInput label="Price" name="price" type="number" value={product.price} onChange={handleChange} required />
                <TextInput label="Old Price" name="oldPrice" type="number" value={product.oldPrice} onChange={handleChange} required />
                <TextInput label="Age" name="age" type="number" value={product.age} onChange={handleChange} required />

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
