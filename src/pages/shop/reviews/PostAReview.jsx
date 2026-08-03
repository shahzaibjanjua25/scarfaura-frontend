import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewApi';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { toast } from 'react-toastify';
import { RiStarFill, RiStarLine, RiCloseLine, RiCheckLine } from 'react-icons/ri';

const PostAReview = ({ isModalOpen, handleClose }) => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [postReview] = usePostReviewMutation();
    const { refetch } = useFetchProductByIdQuery(id, { skip: !id });

    const handleRating = (value) => {
        setRating(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!rating) {
            toast.warning('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.warning('Please write a review');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const newComment = {
                comment: comment.trim(),
                rating,
                userId: user?._id,
                productId: id
            };

            await postReview(newComment).unwrap();
            toast.success('Review posted successfully!');
            setRating(0);
            setComment('');
            await refetch();
        } catch (err) {
            console.error('Failed to post review:', err);
            toast.error(err.data?.message || 'Failed to post review. Please try again.');
        } finally {
            setIsSubmitting(false);
            handleClose();
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close review modal"
                >
                    <RiCloseLine size={24} />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Share Your Experience</h2>
                    
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">How would you rate this product?</p>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRating(star)}
                                    className="focus:outline-none"
                                    aria-label={`Rate ${star} star`}
                                >
                                    {rating >= star ? (
                                        <RiStarFill className="text-yellow-500 w-8 h-8" />
                                    ) : (
                                        <RiStarLine className="text-yellow-500 w-8 h-8" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            id="review-text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Share details about your experience with this product..."
                            aria-describedby="review-help"
                        />
                        <p id="review-help" className="mt-1 text-sm text-gray-500">
                            Minimum 10 characters
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting || !rating || !comment.trim()}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Posting...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <RiCheckLine className="mr-1" />
                                    Submit Review
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostAReview;