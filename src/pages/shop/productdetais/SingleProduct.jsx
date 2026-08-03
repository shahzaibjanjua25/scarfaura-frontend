import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import RatingStars from '../../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';
import { toast } from "react-toastify";

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Fetch product by ID using the hook
    const { data, error, isLoading } = useFetchProductByIdQuery(id);

    useEffect(() => {
        if (error) {
            console.error('Product Fetch Error:', error?.data?.message || error.error);
        }
    }, [error]);

    // Destructure and rename fields for clarity
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        alert('Item added to cart successfully!');

    };

    if (isLoading) return <p>Loading product details...</p>;
    if (error) return <p>Error loading product details.</p>;

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
                <div className="flex flex-col items-center md:flex-row gap-8">
                    {/* Product Image */}
                    <div className="w-full md:w-1/2">
                        <img
                            src={singleProduct.image}
                            alt={singleProduct.name}
                            className="rounded-md w-full h-auto"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2">
                        <h3 className="text-2xl font-semibold mb-4">{singleProduct.name}</h3>
                        <p className="text-xl text-primary mb-4">
                            PKR {singleProduct.price}{' '}
                            {singleProduct.oldPrice && <s>PKR {singleProduct.oldPrice}</s>}
                        </p>
                        <p className="text-gray-700 mb-4">{singleProduct.description}</p>

                        <div className="flex flex-col space-y-2">
                            <p><strong>Category:</strong> {singleProduct.category}</p>
                            <p><strong>Color:</strong> {singleProduct.color}</p>
                            <p><strong>Age:</strong> {singleProduct.age} years</p>
                            <div className='flex gap-1 items-center'>
                                <strong>Rating:</strong>
                                <RatingStars rating={singleProduct.rating} />
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(singleProduct);
                            }}
                            className="mt-6 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>

            {/* Display Reviews */}
            <section className="section__container mt-8">
                <ReviewsCard productReviews={productReviews} />
            </section>
        </>
    );
};

export default SingleProduct;
