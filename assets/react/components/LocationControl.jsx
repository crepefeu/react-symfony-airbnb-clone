import React from 'react';

const LocationControl = ({ onClick }) => {
    return (
        <div className="absolute right-6 bottom-24 flex flex-col gap-2">
            <button
                onClick={onClick}
                className="bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="My location"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </svg>
            </button>
        </div>
    );
};

export default LocationControl;
