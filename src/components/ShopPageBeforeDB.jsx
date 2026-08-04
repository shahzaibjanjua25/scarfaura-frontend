import React, { useState, useEffect } from 'react';
import productsData from '../../data/products.json';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';

const filters = {
    categories: [
        'all',
        'Printed Hijabs',
        'Chiffon Hijabs',
        'Modal Hijabs',
        'Jersey Hijabs',
        'Deer Prints',
        'Leopard Prints'
    ],
    colors: ['all', 'brown', 'black', 'maroon', 'zinc', 'navy blue', 'white', 'skin', 'burgundy', 'purple', 'grey', 'plum', 'red', 'gold', 'blue', 'silver', 'beige', 'green', 'sagegreen'],
    priceRanges: [
        { label: 'PKR 550', min: 0, max: 550 },
        { label: 'PKR 800 - PKR 1500', min: 800, max: 1500 },
        { label: 'PKR 1500 - PKR 3000', min: 1500, max: 3000 },
        { label: 'PKR 3000 and above', min: 3000, max: Infinity }
    ],
};

const ShopPage = () => {
    const [products, setProducts] = useState(productsData);
    const [filtersState, setFiltersState] = useState({
        categories: ['all'], // ✅ Changed to array for multi-select
        color: 'all',
        priceRange: ''
    });

    // ShopPage.jsx - Updated applyFilters
    const applyFilters = () => {
        let filteredProducts = productsData;

        // ✅ Filter by multiple categories
        if (filtersState.categories && !filtersState.categories.includes('all')) {
            filteredProducts = filteredProducts.filter(
                product => {
                    // Check if product has categories array
                    const productCategories = product.categories || [product.category];
                    return productCategories.some(cat => filtersState.categories.includes(cat));
                }
            );
        }

        // Filter by color
        if (filtersState.color && filtersState.color !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.color === filtersState.color
            );
        }

        // Filter by price range
        if (filtersState.priceRange) {
            const [minPrice, maxPrice] = filtersState.priceRange.split('-').map(Number);
            filteredProducts = filteredProducts.filter(
                product => product.price >= minPrice && product.price <= maxPrice
            );
        }

        setProducts(filteredProducts);
    };

    useEffect(() => {
        applyFilters();
    }, [filtersState]);

    const clearFilters = () => {
        setFiltersState({
            categories: ['all'],
            color: 'all',
            priceRange: ''
        });
    };

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
                    <ShopFiltering
                        filters={filters}
                        filtersState={filtersState}
                        setFiltersState={setFiltersState}
                        clearFilters={clearFilters}
                    />

                    {/* right side */}
                    <div>
                        <h3 className='text-xl font-medium mb-4'>Products Available: {products.length}</h3>
                        <ProductCards products={products} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;