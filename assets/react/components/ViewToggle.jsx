import React from 'react';
import { useView } from '../contexts/ViewContext';

const ViewToggle = () => {
    const { isMapView, setIsMapView } = useView();

    return (
        <button
            onClick={() => setIsMapView(!isMapView)}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50 
                      bg-gray-900 text-white px-6 py-3 rounded-full
                      shadow-lg hover:shadow-xl transition-all duration-300
                      flex items-center space-x-2"
        >
            <span className="font-medium">
                {isMapView ? 'Show list' : 'Show map'}
            </span>
            {isMapView ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            )}
        </button>
    );
};

export default ViewToggle;
