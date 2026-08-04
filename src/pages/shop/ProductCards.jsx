import React from 'react'
import RatingStars from '../../components/RatingStars'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <div 
                    key={index} 
                    className="product__card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className='relative overflow-hidden'>
                        <Link to={`/shop/${product._id}`}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className='max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300'
                            />
                        </Link>

                        <div className='hover:block absolute top-3 right-3'>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product)
                                }}
                                className="bg-primary p-2 rounded-full hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                            >
                                <i className="ri-shopping-cart-2-line text-white text-sm"></i>
                            </button>
                        </div>

                        {/* Optional: Add discount badge if oldPrice exists */}
                        {product.oldPrice && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                            </div>
                        )}
                    </div>
                    
                    <div className="product__card__content p-4">
                        <h4 className="font-medium text-gray-800 text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                            <Link to={`/shop/${product._id}`}>
                                {product.name}
                            </Link>
                        </h4>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="text-primary font-bold text-lg">
                                PKR {product.price}
                            </span>
                            {product.oldPrice && (
                                <span className="text-gray-400 text-sm line-through">
                                    PKR {product.oldPrice}
                                </span>
                            )}
                        </div>
                        <div className="mt-1.5">
                            <RatingStars rating={product.rating} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductCards