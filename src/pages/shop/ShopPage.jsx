import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const filters = {
    categories: [
        'all',
        'Printed Hijabs',
        'Chiffon Hijabs',
        'Modal Hijabs',
        'Jersey Hijabs',
        'Deer Prints',
        'Leoprd Prints',
        'Brown',
        'Chiffon',
        'Dark Brown'
    ],
    colors: ['all', 'brown', 'black', 'maroon', 'zinc', 'navy blue', 'white', 'skin', 'burgundy', 'purple', 'grey', 'plum', 'red', 'gold', 'blue', 'silver', 'beige', 'green', 'sagegreen'],
    priceRanges: [
        { label: 'PKR 550', min: 0, max: 550 },
        { label: 'PKR 800 - PKR 1500', min: 800, max: 1500 },
        { label: 'PKR 1500 - PKR 3000', min: 1500, max: 3000 },
        { label: 'PKR 3000 and above', min: 3000, max: Infinity }
    ],
    // age: ['all', '1-2', '3-4', '5-6', '7-8', '9-10'] // COMMENTED OUT
};

const ShopPage = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [filtersState, setFiltersState] = useState({
        category: location.state?.category || 'all',
        color: 'all',
        // age: 'all', // COMMENTED OUT
        priceRange: ''
    });

    const [mobileFilterOpen, setMobileFilterOpen] = useState({
        category: false,
        color: false,
        price: false,
        // age: false // COMMENTED OUT
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    const { category, color, priceRange } = filtersState; // Removed age
    const [minPrice, maxPrice] = priceRange ? priceRange.split('-').map(Number) : [NaN, NaN];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ FIX: Safely extract data with proper defaults
    const {
        data,
        error,
        isLoading
    } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        color: color !== 'all' ? color : '',
        // age: age !== 'all' ? age : '', // COMMENTED OUT
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: productsPerPage
    });

    // ✅ FIX: Ensure products is always an array
    const products = data?.products || [];
    const totalPages = data?.totalPages || 1;
    const totalProducts = data?.totalProducts || 0;

    useEffect(() => {
        if (location.state?.category && location.state.category !== filtersState.category) {
            setFiltersState(prev => ({
                ...prev,
                category: location.state.category
            }));
            setCurrentPage(1);
        }
    }, [location.state]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const clearFilters = () => {
        setFiltersState({
            category: 'all',
            color: 'all',
            // age: 'all', // COMMENTED OUT
            priceRange: ''
        });
        setCurrentPage(1);
    };

    const toggleMobileFilter = (filterName) => {
        setMobileFilterOpen(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    // ✅ FIX: Add debug logging to see what the API returns
    console.log('🔍 API Response:', data);
    console.log('📦 Products:', products);
    console.log('📊 Total Products:', totalProducts);

    if (isLoading) return (
        <div className="section__container">
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="section__container">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-8 max-w-2xl mx-auto">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">API Connection Failed</h3>
                        <p className="text-sm text-red-700 mt-2">
                            {error?.data?.message || error?.message || 'Failed to load products'}
                        </p>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ✅ FIX: Check if products is an array before calculating
    const productCount = Array.isArray(products) ? products.length : 0;
    const startProduct = productCount > 0 ? (currentPage - 1) * productsPerPage + 1 : 0;
    const endProduct = productCount > 0 ? startProduct + productCount - 1 : 0;

    return (
        <>
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Shop Page</h2>
                <p className="section__subheader">
                    Discover the Hottest Picks: Elevate Your Style with Our Curated
                    Collection of Trending Women's hijab Fashion Products.
                </p>
            </section>
            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    {/* left side */}
                    {isMobile ? (
                        <div className="w-full">
                            <div className="mb-4">
                                <button
                                    onClick={() => toggleMobileFilter('category')}
                                    className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-md"
                                >
                                    <span>Category</span>
                                    <svg
                                        className={`w-5 h-5 transform transition-transform ${mobileFilterOpen.category ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {mobileFilterOpen.category && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        {filters.categories.map((cat) => (
                                            <div key={cat} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    id={`mobile-cat-${cat}`}
                                                    name="mobile-category"
                                                    checked={category === cat}
                                                    onChange={() => {
                                                        setFiltersState(prev => ({ ...prev, category: cat }));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`mobile-cat-${cat}`} className="capitalize">
                                                    {cat}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <button
                                    onClick={() => toggleMobileFilter('color')}
                                    className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-md"
                                >
                                    <span>Color</span>
                                    <svg
                                        className={`w-5 h-5 transform transition-transform ${mobileFilterOpen.color ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {mobileFilterOpen.color && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        {filters.colors.map((col) => (
                                            <div key={col} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    id={`mobile-col-${col}`}
                                                    name="mobile-color"
                                                    checked={color === col}
                                                    onChange={() => {
                                                        setFiltersState(prev => ({ ...prev, color: col }));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`mobile-col-${col}`} className="capitalize">
                                                    {col}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <button
                                    onClick={() => toggleMobileFilter('price')}
                                    className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-md"
                                >
                                    <span>Price Range</span>
                                    <svg
                                        className={`w-5 h-5 transform transition-transform ${mobileFilterOpen.price ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {mobileFilterOpen.price && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        {filters.priceRanges.map((range, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    id={`mobile-price-${index}`}
                                                    name="mobile-price"
                                                    checked={priceRange === `${range.min}-${range.max}`}
                                                    onChange={() => {
                                                        setFiltersState(prev => ({ ...prev, priceRange: `${range.min}-${range.max}` }));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`mobile-price-${index}`}>
                                                    {range.label}
                                                </label>
                                            </div>
                                        ))}
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="radio"
                                                id="mobile-price-all"
                                                name="mobile-price"
                                                checked={priceRange === ''}
                                                onChange={() => {
                                                    setFiltersState(prev => ({ ...prev, priceRange: '' }));
                                                    setCurrentPage(1);
                                                }}
                                                className="mr-2"
                                            />
                                            <label htmlFor="mobile-price-all">All Prices</label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* AGE FILTER - COMMENTED OUT */}
                            {/* <div className="mb-4">
                                <button
                                    onClick={() => toggleMobileFilter('age')}
                                    className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-md"
                                >
                                    <span>Age</span>
                                    <svg
                                        className={`w-5 h-5 transform transition-transform ${mobileFilterOpen.age ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {mobileFilterOpen.age && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        {filters.age.map((ageValue) => (
                                            <div key={ageValue} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    id={`mobile-age-${ageValue}`}
                                                    name="mobile-age"
                                                    checked={age === ageValue}
                                                    onChange={() => {
                                                        setFiltersState(prev => ({ ...prev, age: ageValue }));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={`mobile-age-${ageValue}`}>
                                                    {ageValue === 'all' ? 'all' : `${ageValue} years`}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div> */}

                            <button
                                onClick={clearFilters}
                                className="w-full p-3 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <ShopFiltering
                            filters={{ ...filters }} // Removed ages from here
                            filtersState={filtersState}
                            setFiltersState={setFiltersState}
                            clearFilters={clearFilters}
                        />
                    )}

                    {/* right side */}
                    <div className="flex-1">
                        <h3 className='text-xl font-medium mb-4'>Showing {startProduct} to {endProduct} of {totalProducts} products</h3>
                        {Array.isArray(products) && products.length > 0 ? (
                            <>
                                <ProductCards products={products} />
                                {/* Pagination controls */}
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {totalPages > 1 && [...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md mx-1`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Try adjusting your filters to find what you're looking for.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;