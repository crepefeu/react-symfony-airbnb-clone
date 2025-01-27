import React from 'react';

const ZoomControl = ({ onZoomIn, onZoomOut }) => {
    return (
        <div className="absolute right-6 top-6 flex flex-col shadow-xl bg-white rounded-md h-24 w-10">
            <button
                onClick={onZoomIn}
                className="bg-white px-1 py-3 w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Zoom in"
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
            <hr className=''/>
            <button
                onClick={onZoomOut}
                className="bg-white px-1 py-3 w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Zoom out"
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>
        </div>
    );
};

export default ZoomControl;
