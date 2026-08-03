import React, { useState } from 'react';
import { useDeleteProductMutation, useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../../utils/dateFormater';

const ManageProducts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);

    const { 
        data: { products = [], totalPages, totalProducts } = {}, 
        error, 
        isLoading, 
        refetch 
    } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: '',
        maxPrice: '',
        // age:'',
        page: currentPage,
        limit: productsPerPage
    });

    const [deleteProduct] = useDeleteProductMutation();

    const handleDelete = async (id) => {
        try {
            setDeleteError(null);
            setDeleteSuccess(null);
            
            const { message } = await deleteProduct(id).unwrap();
            setDeleteSuccess(message);
            await refetch();
            
            // Auto-hide success message after 3 seconds
            setTimeout(() => setDeleteSuccess(null), 3000);
        } catch (error) {
            console.error("Failed to delete product:", error);
            setDeleteError(error.data?.message || 'Failed to delete product');
        }
    };

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification Messages */}
            {deleteSuccess && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
                        {deleteSuccess}
                    </div>
                </div>
            )}
            {deleteError && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
                        {deleteError}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>Failed to load products. Please try again later.</p>
                </div>
            )}

            <section className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">All Products</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Showing {startProduct} to {endProduct} of {totalProducts} products
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Link 
                                        to="/shop"
                                        className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-indigo-600 transition-colors"
                                    >
                                        View Shop
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No.
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date Added
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product, index) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {startProduct + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link 
                                                    to={`/shop/${product._id}`}
                                                    className="text-sm font-medium text-primary hover:text-indigo-600"
                                                >
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(product.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-4">
                                                    <Link
                                                        to={`/dashboard/update-product/${product._id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Are you sure you want to delete this product?')) {
                                                                handleDelete(product._id);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary text-white hover:bg-indigo-600'}`}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary text-white hover:bg-indigo-600'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ManageProducts;