import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating, size = 'base' }) => {
    const stars = [];
    const sizeClasses = {
        'sm': 'w-3 h-3',
        'base': 'w-4 h-4',
        'lg': 'w-5 h-5'
    };

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <svg
                key={i}
                className={`${sizeClasses[size]} ${i <= rating ? 'text-black' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        );
    }

    return (
        <div className="flex gap-0.5">
            {stars}
        </div>
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['sm', 'base', 'lg'])
};

export default StarRating;
