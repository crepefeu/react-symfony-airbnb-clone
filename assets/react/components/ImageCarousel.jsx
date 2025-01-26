import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ImageCarousel = ({ images, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const previousImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center" onClick={onClose}>
            <button 
                onClick={onClose}
                className="fixed top-4 left-4 z-[70] p-2 text-white hover:bg-white/10 rounded-full"
                aria-label="Close carousel"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div 
                className="relative w-full h-full flex items-center justify-center"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={previousImage}
                    className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-full"
                    aria-label="Previous image"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <img
                    src={images[currentIndex]}
                    alt={`Property view ${currentIndex + 1}`}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                />

                <button
                    onClick={nextImage}
                    className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-full"
                    aria-label="Next image"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

ImageCarousel.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number,
    onClose: PropTypes.func.isRequired
};

export default ImageCarousel;
