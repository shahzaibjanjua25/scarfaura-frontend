import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'Printed Hijabs', value: 'Printed Hijabs' },
    { label: 'Georgette  Hijabs', value: 'Georgette  Hijabs' },
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
    { label: 'Sage Green', value: 'sagegreen' }
];

const emptyProduct = {
    name: '',
    categories: [],
    color: '',
    price: '',
    oldPrice: '',
    description: ''
};

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);
    const [product, setProduct] = useState(emptyProduct);
    const [images, setImages] = useState([]);
    const [addProduct, { isLoading }] = useAddProductMutation();
    const navigate = useNavigate();
    const [dialog, setDialog] = useState({ show: false, type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryToggle = (categoryValue) => {
        setProduct((prev) => {
            const current = prev.categories || [];
            return {
                ...prev,
                categories: current.includes(categoryValue)
                    ? current.filter((c) => c !== categoryValue)
                    : [...current, categoryValue]
            };
        });
    };

    const makePrimaryCategory = (categoryValue) => {
        setProduct((prev) => ({
            ...prev,
            categories: [categoryValue, ...prev.categories.filter((c) => c !== categoryValue)]
        }));
    };

    const isColorRequired = product.categories.includes('Georgette  Hijabs');

    const showError = (message) => setDialog({ show: true, type: 'error', message });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.name || product.categories.length === 0 || !product.price ||
            !product.description || images.length === 0) {
            showError('Please fill in all required fields, select at least one category, and upload at least one image.');
            return;
        }

        if (isColorRequired && !product.color) {
            showError('Color is required when "Georgette  Hijabs" category is selected.');
            return;
        }

        if (!user?._id) {
            showError('Your session has expired. Please sign in again.');
            return;
        }

        const productData = {
            name: product.name.trim(),
            category: product.categories[0],   // primary, single string
            categories: product.categories,     // full list, array
            color: product.color || undefined,
            price: Number(product.price),
            oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
            description: product.description.trim(),
            images,                             // full list, array
            image: images[0],                   // legacy field, single string
            author: user._id
        };

        /* ---------------- DEBUG: payload shape ----------------
           Confirms what leaves the browser. If these say `true`,
           the frontend is correct and any string/array mismatch in
           the database is happening in productsApi.js or on the
           server. Delete this block once the issue is resolved. */
        console.log('--- OUTGOING PRODUCT PAYLOAD ---');
        console.log('categories:', productData.categories,
            '| isArray:', Array.isArray(productData.categories),
            '| length:', productData.categories.length);
        console.log('images:', productData.images,
            '| isArray:', Array.isArray(productData.images),
            '| length:', productData.images.length);
        console.log('category (string):', productData.category);
        console.log('image (string):', productData.image);
        console.log('JSON as sent:', JSON.stringify(productData));
        /* ------------------------------------------------------ */

        try {
            const result = await addProduct(productData).unwrap();

            /* ---------------- DEBUG: what came back -------------- */
            console.log('--- SERVER RESPONSE ---');
            console.log('full response:', result);
            console.log('stored categories:', result?.product?.categories,
                '| isArray:', Array.isArray(result?.product?.categories));
            console.log('stored images:', result?.product?.images,
                '| isArray:', Array.isArray(result?.product?.images));
            /* ---------------------------------------------------- */

            const savedCategories = result?.product?.categories || [];
            if (savedCategories.length !== product.categories.length) {
                console.warn(
                    'MISMATCH — sent', product.categories.length, 'categories:', product.categories,
                    'but server stored', savedCategories.length + ':', savedCategories
                );
            }

            const savedImages = result?.product?.images || [];
            if (savedImages.length !== images.length) {
                console.warn(
                    'MISMATCH — sent', images.length, 'images but server stored', savedImages.length
                );
            }

            setDialog({
                show: true,
                type: 'success',
                message: 'Product added successfully! Redirecting to shop...'
            });

            setTimeout(() => {
                setProduct(emptyProduct);
                setImages([]);
                navigate('/shop');
            }, 2000);
        } catch (err) {
            console.error('Add product error:', err);
            console.error('Server said:', err.data);
            showError(err.data?.message || 'Failed to add product. Please try again.');
        }
    };

    const closeDialog = () => setDialog((prev) => ({ ...prev, show: false }));

    return (
        <div className="container mx-auto mt-8 px-4">
            {dialog.show && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    role="alertdialog"
                    aria-modal="true"
                >
                    <div className={`bg-white p-6 rounded-lg shadow-lg max-w-sm w-full border-t-4 ${
                        dialog.type === 'success' ? 'border-green-500' : 'border-red-500'
                    }`}>
                        <h3 className={`text-xl font-semibold ${
                            dialog.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {dialog.type === 'success' ? 'Success!' : 'Error'}
                        </h3>
                        <p className="mt-2 mb-4 text-gray-700">{dialog.message}</p>
                        <button
                            onClick={closeDialog}
                            className={`w-full py-2 rounded-md text-white transition-colors ${
                                dialog.type === 'success'
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                            }`}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Mustard Yellow"
                    value={product.name}
                    onChange={handleChange}
                    required
                />

                <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                        Categories <span className="text-red-500">*</span>
                    </legend>

                    <div className="space-y-1 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {categories.map((category) => {
                            const checked = product.categories.includes(category.value);
                            const isPrimary = product.categories[0] === category.value;

                            return (
                                <div
                                    key={category.value}
                                    className="flex items-center justify-between gap-2 py-1"
                                >
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleCategoryToggle(category.value)}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span>{category.label}</span>
                                    </label>

                                    {checked && (
                                        isPrimary ? (
                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                                Primary
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => makePrimaryCategory(category.value)}
                                                className="text-[11px] text-gray-500 hover:text-indigo-600 underline"
                                            >
                                                Make primary
                                            </button>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {product.categories.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {product.categories.length}{' '}
                            {product.categories.length === 1 ? 'category' : 'categories'} selected
                            {' — '}
                            <span className="text-gray-600">{product.categories.join(', ')}</span>
                        </p>
                    )}
                </fieldset>

                <div>
                    <SelectInput
                        label="Color"
                        name="color"
                        value={product.color}
                        onChange={handleChange}
                        options={colors}
                        required={isColorRequired}
                    />
                    {isColorRequired ? (
                        <p className="text-xs text-amber-600 mt-1">
                            Color is required when "Georgette  Hijabs" is selected
                        </p>
                    ) : product.categories.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                            Color is optional for the selected categories
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
                    images={images}
                    setImages={setImages}
                    required
                />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
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
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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