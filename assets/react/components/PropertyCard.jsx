import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Add quality parameters to Unsplash URLs
  const processImageUrl = (url) => {
    if (url.includes('unsplash.com')) {
      return `${url}?auto=format&fit=crop&w=800&q=80`;
    }
    return url;
  };

  const images = property.images?.length > 0
    ? property.images.map(processImageUrl)
    : ["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"];

  const handlePrevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
  });

  return (
    <a
      href={`/property/${property.id}`}
      className="block bg-white overflow-hidden transition-shadow group"
    >
      <div
        className="aspect-square overflow-hidden relative"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        {...swipeHandlers}
      >
        <div className="relative w-full h-full">
          <img
            src={images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full rounded-lg object-cover"
            onError={(e) => {
              e.target.src = "https://www.homelyyours.com/data/propertyPlaceholder.png";
            }}
          />
          
          {/* Navigation Buttons */}
          {(showControls || images.length > 1) && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}

          {/* Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold truncate">
            {property.address.city}, {property.address.country}
          </h3>
          {property.averageRating && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <svg
                className={`h-4 w-4`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {property.averageRating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="text-gray-600">
          <div className="flex items-center gap-2">
            {property.owner.profilePicture ? (
              <img 
                src={property.owner.profilePicture} 
                alt={`${property.owner.firstName} ${property.owner.lastName}`}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {property.owner.firstName[0]}
                </span>
              </div>
            )}
            <p>Host: {property.owner.firstName} {property.owner.lastName}</p>
          </div>
          <div><span className="text-black font-medium">{property.price}€</span> / night</div>
        </div>
      </div>
    </a>
  );
};

export default PropertyCard;
