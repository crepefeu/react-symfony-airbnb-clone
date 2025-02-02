import React from 'react';

const PropertyHeader = ({ title, propertyType, address, maxGuests, bedrooms, bathrooms, reviews, onShowReviews }) => {
  return (
    <div className="flex flex-col my-4">
      <p className="text-2xl font-medium">
        {propertyType} in {address.city}, {address.country}
      </p>
      <div className="flex items-center">
        <p>{maxGuests} guests</p>
        <svg className="lucide lucide-dot mt-[2px] w-5 h-5">
          <circle cx="12.1" cy="12.1" r="1" />
        </svg>
        <p>{bedrooms} bedrooms</p>
        <svg className="lucide lucide-dot mt-[2px] w-5 h-5">
          <circle cx="12.1" cy="12.1" r="1" />
        </svg>
        <p>{bathrooms} bathrooms</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <button 
          className="text-gray-600 underline cursor-pointer bg-transparent"
          onClick={onShowReviews}
        >
          {reviews.length} reviews
        </button>
      </div>
    </div>
  );
};

export default PropertyHeader;
