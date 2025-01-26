import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const Review = ({ review }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString.replace(' ', 'T')).toLocaleDateString(undefined, options);
    };

    return (
        <div className="border-b border-gray-200 py-6 last:border-0">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg text-gray-600">
                        {review.author.firstName.charAt(0)}{review.author.lastName.charAt(0)}
                    </span>
                </div>
                <div>
                    <h4 className="font-semibold">{review.author.firstName}</h4>
                    <p className="text-gray-500 text-sm">
                        {formatDate(review.createdAt)}
                    </p>
                </div>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-gray-600 mt-2">{review.comment}</p>
        </div>
    );
};

Review.propTypes = {
    review: PropTypes.shape({
        rating: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        author: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default Review;