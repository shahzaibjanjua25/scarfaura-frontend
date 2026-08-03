import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Printed Hijabs', value: 'Printed Hijabs' },
    { label: 'Chiffon Hijabs', value: 'Chiffon Hijabs' },
    { label: 'Modal Hijabs', value: 'Modal Hijabs' },
    { label: 'Jersey Hijabs', value: 'Jersey Hijabs' },
    { label: 'Deer Prints', value: 'Deer Prints' },
    { label: 'Leopard Prints', value: 'Leopard Prints' },
    { label: 'Brown', value: 'Women-shirts' },
    { label: 'Chiffon', value: 'Women-casuals' },
    { label: 'Dark Skin', value: 'Dark Skin' }
];

// Updated colors with all your colors
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
    { label: 'Sage Green', value: 'sagegreen' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        oldPrice: '',
        description: ''
    });
    const [image, setImage] = useState('');
    const [addProduct, { isLoading }] = useAddProductMutation();
    const navigate = useNavigate();
    const [dialog, setDialog] = useState({
        show: false,
        type: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Check if color is required based on category
    const isColorRequired = product.category === 'Chiffon Hijabs';

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validate based on category
        if (!product.name || !product.category || !product.price ||
            !product.description || !image) {
            setDialog({
                show: true,
                type: 'error',
                message: 'Please fill in all required fields including the image.'
            });
            return;
        }

        // ✅ Only validate color if category is Chiffon Hijabs
        if (isColorRequired && !product.color) {
            setDialog({
                show: true,
                type: 'error',
                message: 'Color is required for Chiffon Hijabs category. Please select a color.'
            });
            return;
        }

        try {
            const productData = {
                ...product,
                image,
                author: user?._id,
                price: Number(product.price),
                oldPrice: product.oldPrice ? Number(product.oldPrice) : null
            };

            await addProduct(productData).unwrap();
            setDialog({
                show: true,
                type: 'success',
                message: 'Product added successfully! Redirecting to shop...'
            });

            setTimeout(() => {
                setProduct({
                    name: '',
                    category: '',
                    color: '',
                    price: '',
                    oldPrice: '',
                    description: ''
                });
                setImage('');
                navigate("/shop");
            }, 2000);
        } catch (err) {
            setDialog({
                show: true,
                type: 'error',
                message: err.data?.message || 'Failed to add product. Please try again.'
            });
        }
    };

    const closeDialog = () => {
        setDialog(prev => ({ ...prev, show: false }));
    };

    return (
        <div className="container mx-auto mt-8 px-4">
            {/* Notification Dialog */}
            {dialog.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto border-t-4 ${dialog.type === 'success' ? 'border-green-500' : 'border-red-500'
                        }`}>
                        <h3 className={`text-xl font-semibold ${dialog.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {dialog.type === 'success' ? 'Success!' : 'Error'}
                        </h3>
                        <p className="mt-2 mb-4">{dialog.message}</p>
                        <button
                            onClick={closeDialog}
                            className={`w-full py-2 rounded-md ${dialog.type === 'success'
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                } text-white transition-colors`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Mustart Yellow"
                    value={product.name}
                    onChange={handleChange}
                    required
                />

                <SelectInput
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                    required
                />

                {/* ✅ Color field with conditional required indicator */}
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
                            ⚠️ Color is required for Chiffon Hijabs category
                        </p>
                    )}
                    {!isColorRequired && product.category && (
                        <p className="text-xs text-gray-400 mt-1">
                            ℹ️ Color is optional for this category
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        label="Current Price (PKR)"
                        name="price"
                        type="number"
                        placeholder="1200"
                        value={product.price}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        required
                    />

                    <TextInput
                        label="Old Price (PKR) - Optional"
                        name="oldPrice"
                        type="number"
                        placeholder="1500"
                        value={product.oldPrice}
                        onChange={handleChange}
                        min="0"
                        step="1"
                    />
                </div>

                <UploadImage
                    setImage={setImage}
                    required
                />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        rows={6}
                        name="description"
                        id="description"
                        value={product.description}
                        placeholder="Write a product description"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding Product...
                            </span>
                        ) : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;