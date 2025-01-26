import React from 'react';
import PropTypes from 'prop-types';
import Review from './Review';
import StarRating from './StarRating';

const ReviewsList = ({ reviews, averageRating }) => {
    return (
        <div className="py-8 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-6">
                <StarRating rating={averageRating} size="lg" />
                <h3 className="text-2xl font-semibold">
                    {averageRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
};

ReviewsList.propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        author: PropTypes.object.isRequired
    })).isRequired,
    averageRating: PropTypes.number.isRequired
};

export default ReviewsList;