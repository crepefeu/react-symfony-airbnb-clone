import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ImageCarousel from './ImageCarousel';

const FullScreenGallery = ({ images = [], onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white p-4">
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Close gallery"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* First image - large */}
                <div 
                    className="aspect-[2/1] cursor-pointer w-full"
                    onClick={() => setSelectedImageIndex(0)}
                >
                    <img 
                        src={images[0]}
                        alt="Main property view"
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>

                {/* Remaining images - 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                    {images.slice(1).map((image, index) => (
                        <div 
                            key={index + 1}
                            className="aspect-square cursor-pointer"
                            onClick={() => setSelectedImageIndex(index + 1)}
                        >
                            <img 
                                src={image}
                                alt={`Property view ${index + 2}`}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {selectedImageIndex !== null && (
                <ImageCarousel
                    images={images}
                    initialIndex={selectedImageIndex}
                    onClose={() => setSelectedImageIndex(null)}
                />
            )}
        </div>
    );
};

FullScreenGallery.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    onClose: PropTypes.func.isRequired
};

export default FullScreenGallery;
