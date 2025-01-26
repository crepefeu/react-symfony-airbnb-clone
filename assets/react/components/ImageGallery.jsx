import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_IMAGES = [
    'https://placehold.co/800x600?text=No+Image+Available',
    'https://placehold.co/800x600?text=No+Image+Available',
    'https://placehold.co/800x600?text=No+Image+Available',
];

const ImageGallery = ({ images = [] }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const displayImages = images.length > 0 ? images : DEFAULT_IMAGES;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <div className="relative mb-6">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                    src={displayImages[currentImageIndex]}
                    alt={`Property ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>
            
            {displayImages.length > 1 && (
                <>
                    <button 
                        onClick={previousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                        aria-label="Previous image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                        aria-label="Next image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            <div className="flex justify-center gap-2 mt-4">
                {displayImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-rose-500' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

ImageGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string)
};

export default ImageGallery;
