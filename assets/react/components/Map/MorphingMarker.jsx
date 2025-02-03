import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MorphingMarker = ({ property, isSelected, onClick }) => {
    const handleMarkerClick = (e) => {
        e.stopPropagation();
        onClick();
    };

    const handleInfoClick = (e) => {
        e.stopPropagation();
        window.location.href = `/property/${property.id}`;
    };

    const handleInfoWindowClick = (e) => {
        e.stopPropagation(); // Prevent map click when clicking the info window
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
                {isSelected ? (
                    <motion.div
                        key="info"
                        initial={{ scale: 0.8, opacity: 0, y: 0 }}
                        animate={{ scale: 1, opacity: 1, y: -10 }}
                        exit={{ scale: 0.8, opacity: 0, y: 0 }}
                        style={{ 
                            position: 'absolute',
                            width: '300px',
                            left: '-150px', // Half of the width
                            bottom: '40px',  // Height of marker + some padding
                            zIndex: 1000,
                        }}
                        onClick={handleInfoClick}
                    >
                        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                            {property.images?.length > 0 && (
                                <div className="relative w-full aspect-[4/3]">
                                    <img 
                                        src={property.images[0]} 
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <p className="text-sm font-semibold text-gray-900">{property.title}</p>
                                <div className="mt-1 text-gray-600 space-y-1">
                                    <p className="text-sm font-medium">{property.price}€ per night</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{property.maxGuests} guests</span>
                                        <span>•</span>
                                        <span>{property.bedrooms} bedrooms</span>
                                        <span>•</span>
                                        <span>{property.bathrooms} baths</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="w-4 h-4 bg-white transform rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-lg"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="marker"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <div 
                            className="
                                px-3 py-2
                                bg-white hover:bg-black hover:text-white
                                rounded-full shadow-md 
                                transition-all duration-200 hover:scale-110
                                cursor-pointer font-medium text-sm
                                border border-gray-200
                                transform -translate-x-1/2
                            "
                            onClick={handleMarkerClick}
                        >
                            {property.price}€
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MorphingMarker;
