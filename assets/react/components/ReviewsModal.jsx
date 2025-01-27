import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import ReviewsList from './ReviewsList';

const ReviewsModal = ({ isOpen, onClose, reviews, averageRating }) => {
  const [sortBy, setSortBy] = useState('newest');

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full" title={`${reviews.length} reviews · ${averageRating?.toFixed(1)} average`}>
        <div className="flex mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        </div>
        <div className="overflow-y-auto">
          <ReviewsList 
            reviews={sortedReviews} 
            averageRating={averageRating} 
            hideTitle 
            fullWidth
          />
        </div>
      </div>
    </Modal>
  );
};

ReviewsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reviews: PropTypes.array.isRequired,
  averageRating: PropTypes.number,
};

export default ReviewsModal;
