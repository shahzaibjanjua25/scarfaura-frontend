import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import RatingStars from '../../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import { toast } from "react-toastify";

/* ------------------------------------------------------------------
   Image gallery
   Works with the new `images` array and falls back to the legacy
   single `image` string, so it renders correctly either way.
-------------------------------------------------------------------*/
const ProductGallery = ({ images, productName }) => {
    const [index, setIndex] = useState(0);
    const touchStartX = useRef(null);
    const thumbsRef = useRef(null);

    const total = images.length;
    const hasMultiple = total > 1;

    // Reset when navigating to a different product
    useEffect(() => {
        setIndex(0);
    }, [images]);

    const goTo = (next) => {
        if (total === 0) return;
        setIndex(((next % total) + total) % total); // wraps both directions
    };

    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    // Keep the active thumbnail scrolled into view
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
            <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-gray-400">No image available</span>
            </div>
        );
    }

    return (
        <div className="sticky top-24">
            {/* Main image */}
            <div
                className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label={`${productName} images`}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((url, i) => (
                    <img
                        key={url + i}
                        src={url}
                        alt={`${productName} — image ${i + 1} of ${total}`}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        aria-hidden={i !== index}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    />
                ))}

                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {index + 1} / {total}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {hasMultiple && (
                <div
                    ref={thumbsRef}
                    className="mt-3 flex gap-2.5 overflow-x-auto pb-1 scroll-smooth"
                    role="tablist"
                    aria-label="Choose image"
                >
                    {images.map((url, i) => (
                        <button
                            key={url + i}
                            type="button"
                            role="tab"
                            aria-selected={i === index}
                            aria-label={`Show image ${i + 1}`}
                            onClick={() => setIndex(i)}
                            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                                i === index
                                    ? 'border-primary opacity-100'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={url}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
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

    // Prefer the images array; fall back to the legacy single image.
    const galleryImages = useMemo(() => {
        if (Array.isArray(singleProduct.images) && singleProduct.images.length > 0) {
            return singleProduct.images.filter(Boolean);
        }
        return singleProduct.image ? [singleProduct.image] : [];
    }, [singleProduct.images, singleProduct.image]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success('Item added to cart successfully!');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600">Loading product details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading product details. Please try again.</p>
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
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Single Product Page</h2>
                <div className="section__subheader space-x-2">
                    <span className='hover:text-primary'><Link to="/">home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">shop</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>{singleProduct.name}</span>
                </div>
            </section>

            <section className="section__container mt-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Gallery */}
                    <div className="w-full lg:w-1/2">
                        <ProductGallery
                            images={galleryImages}
                            productName={singleProduct.name || 'Product'}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-3">
                            {singleProduct.name}
                        </h1>

                        <div className="flex items-center flex-wrap gap-3 mb-4">
                            <span className="text-2xl font-bold text-primary">
                                PKR {singleProduct.price}
                            </span>
                            {singleProduct.oldPrice && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">
                                        PKR {singleProduct.oldPrice}
                                    </span>
                                    {discount > 0 && (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-semibold">
                                            {discount}% OFF
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <p className="text-gray-600 leading-relaxed mb-4">
                                {singleProduct.description}
                            </p>
                        </div>

                        <div className="space-y-3 border-t border-gray-200 pt-4 mt-4">
                            <div>
                                <span className="text-sm font-medium text-gray-500">Categories</span>
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    {categories.length > 0 ? (
                                        categories.map((cat, index) => (
                                            <Link
                                                key={index}
                                                to="/shop"
                                                state={{ category: cat }}
                                                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                                            >
                                                {cat}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-sm">No categories</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-500">Color</span>
                                <div className="mt-1.5">
                                    {singleProduct.color ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-6 h-6 rounded-full border border-gray-300"
                                                style={{ backgroundColor: getColorHex(singleProduct.color) }}
                                            />
                                            <span className="text-gray-700 capitalize">{singleProduct.color}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">N/A</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="text-sm font-medium text-gray-500">Rating</span>
                                <div className="mt-1.5">
                                    <RatingStars rating={singleProduct.rating} />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleAddToCart(singleProduct)}
                            className="mt-6 w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>

            <section className="section__container mt-8">
                <ReviewsCard productReviews={productReviews} />
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