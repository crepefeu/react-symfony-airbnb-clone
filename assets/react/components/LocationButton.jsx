import React from 'react';

const LocationButton = ({ onClick, isLoading }) => {
    return (
        <button
            onClick={onClick}
            className="absolute left-6 bottom-6 bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Use my location"
        >
            {isLoading ? (
                <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            ) : (
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )}
        </button>
    );
};

export default LocationButton;
