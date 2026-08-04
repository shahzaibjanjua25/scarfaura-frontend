import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import RatingStars from '../../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import "./SingleProduct.css"

/* ------------------------------------------------------------------
   Image gallery with enhanced UI
-------------------------------------------------------------------*/
const ProductGallery = ({ images, productName }) => {
    const [index, setIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const touchStartX = useRef(null);
    const thumbsRef = useRef(null);

    const total = images.length;
    const hasMultiple = total > 1;

    useEffect(() => {
        setIndex(0);
    }, [images]);

    const goTo = (next) => {
        if (total === 0) return;
        setIndex(((next % total) + total) % total);
    };

    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    useEffect(() => {
        const strip = thumbsRef.current;
        if (!strip) return;
        const active = strip.children[index];
        if (active) {
            active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [index]);

    const handleKeyDown = (e) => {
        if (!hasMultiple) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) delta > 0 ? prev() : next();
        touchStartX.current = null;
    };

    if (total === 0) {
        return (
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-400 mt-2 block">No image available</span>
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-24">
            {/* Main image with glassmorphism effect */}
            <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-xl"
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label={`${productName} images`}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <AnimatePresence mode="wait">
                    {images.map((url, i) => (
                        i === index && (
                            <motion.img
                                key={url + i}
                                src={url}
                                alt={`${productName} — image ${i + 1} of ${total}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )
                    ))}
                </AnimatePresence>

                {/* Image counter badge */}
                {hasMultiple && (
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {index + 1} / {total}
                    </div>
                )}

                {/* Navigation buttons with hover animation */}
                {hasMultiple && (
                    <>
                        <motion.button
                            type="button"
                            onClick={prev}
                            aria-label="Previous image"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={next}
                            aria-label="Next image"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: isHovering ? 1 : 0, x: isHovering ? 0 : 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </>
                )}
            </div>

            {/* Thumbnails with scroll indicator */}
            {hasMultiple && (
                <div className="relative mt-4">
                    <div
                        ref={thumbsRef}
                        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth hide-scrollbar"
                        role="tablist"
                        aria-label="Choose image"
                    >
                        {images.map((url, i) => (
                            <motion.button
                                key={url + i}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`Show image ${i + 1}`}
                                onClick={() => setIndex(i)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${i === index
                                        ? 'border-primary shadow-lg scale-105'
                                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                                    }`}
                            >
                                <img
                                    src={url}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                                {i === index && (
                                    <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-xl" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                    {/* Gradient fade indicators */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
                </div>
            )}
        </div>
    );
};

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { data, error, isLoading } = useFetchProductByIdQuery(id);

    useEffect(() => {
        if (error) {
            console.error('Product Fetch Error:', error?.data?.message || error.error);
        }
    }, [error]);

    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];

    const galleryImages = useMemo(() => {
        if (Array.isArray(singleProduct.images) && singleProduct.images.length > 0) {
            return singleProduct.images.filter(Boolean);
        }
        return singleProduct.image ? [singleProduct.image] : [];
    }, [singleProduct.images, singleProduct.image]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success('🎉 Item added to cart successfully!');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse"></div>
                    </div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-500">Error loading product details. Please try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const categories = singleProduct.categories?.length
        ? singleProduct.categories
        : (singleProduct.category ? [singleProduct.category] : []);

    const discount = singleProduct.oldPrice
        ? Math.round(((singleProduct.oldPrice - singleProduct.price) / singleProduct.oldPrice) * 100)
        : 0;

    return (
        <>
            {/* Enhanced Breadcrumb */}
            <section className="relative bg-gradient-to-r from-primary-light via-primary/5 to-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
                            {singleProduct.name}
                        </h1>
                        <nav className="flex items-center space-x-2 text-sm mt-2 md:mt-0">
                            <Link to="/" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Home
                            </Link>
                            <span className="text-gray-300">/</span>
                            <Link to="/shop" className="text-gray-500 hover:text-primary transition-colors">Shop</Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-primary font-medium truncate max-w-[200px]">{singleProduct.name}</span>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Main Product Section */}
            <section className="py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        {/* Gallery */}
                        <div className="w-full lg:w-1/2">
                            <ProductGallery
                                images={galleryImages}
                                productName={singleProduct.name || 'Product'}
                            />
                        </div>

                        {/* Product Details */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            {/* Product Name with badge */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 leading-tight">
                                    {singleProduct.name}
                                </h1>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl md:text-4xl font-bold text-primary">
                                    PKR {singleProduct.price}
                                </span>
                                {singleProduct.oldPrice && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            PKR {singleProduct.oldPrice}
                                        </span>
                                        {discount > 0 && (
                                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                                -{discount}%
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {singleProduct.description}
                                </p>
                            </div>

                            {/* Product Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                {/* Categories */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.length > 0 ? (
                                            categories.map((cat, index) => (
                                                <Link
                                                    key={index}
                                                    to="/shop"
                                                    state={{ category: cat }}
                                                    className="group inline-flex items-center gap-1 bg-gray-50 hover:bg-primary/10 text-gray-700 hover:text-primary px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border border-gray-200 hover:border-primary/20"
                                                >
                                                    {cat}
                                                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">No categories</span>
                                        )}
                                    </div>
                                </div>

                                {/* Color */}
                                {singleProduct.color && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Color</h3>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-md"
                                                style={{ backgroundColor: getColorHex(singleProduct.color) }}
                                            />
                                            <span className="text-gray-700 font-medium capitalize">{singleProduct.color}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Rating</h3>
                                <div className="flex items-center gap-4">
                                    <RatingStars rating={singleProduct.rating} />
                                    <span className="text-sm text-gray-500">
                                        ({productReviews.length} reviews)
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAddToCart(singleProduct)}
                                className="w-full py-4 px-8 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Cart
                            </motion.button>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-400">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Secure Checkout
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    30-Day Returns
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-8 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                        <ReviewsCard productReviews={productReviews} />
                    </div>
                </div>
            </section>
        </>
    );
};

// Helper function to get hex color for the color swatch
const getColorHex = (colorValue) => {
    const colorMap = {
        'brown': '#8B7355',
        'black': '#1A1A1A',
        'maroon': '#800000',
        'zinc': '#71717A',
        'navy blue': '#1B2A4A',
        'white': '#F5F5F5',
        'skin': '#E8C5B0',
        'burgundy': '#900020',
        'purple': '#6B3FA0',
        'grey': '#808080',
        'plum': '#8E4585',
        'red': '#DC2626',
        'gold': '#D4AF37',
        'blue': '#2563EB',
        'silver': '#C0C0C0',
        'beige': '#F5F5DC',
        'green': '#16A34A',
        'sagegreen': '#9CAF88',
        'pink': '#f107de'
    };
    return colorMap[colorValue?.toLowerCase()] || '#CCCCCC';
};

export default SingleProduct;