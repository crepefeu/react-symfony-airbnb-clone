import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import WishlistModal from './WishlistModal';
import LoginModal from './LoginModal';

const PropertyCard = ({ 
  property, 
  onRemoveFromWishlist = null,
  onAddToWishlist = null,
  showWishlistButton = true, // New prop to control wishlist button visibility
  isSaved = false  // New prop to indicate if property is in a wishlist
}) => {
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Add quality parameters to Unsplash URLs
  const processImageUrl = (url) => {
    if (url.includes('unsplash.com')) {
      return `${url}?auto=format&fit=crop&w=800&q=80`;
    }
    return url;
  };

  useEffect(() => {
    console.log('PropertyCard rendered', property);
  }, [property]);

  const images = property.images?.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80"];

  const handlePrevImage = (e) => {
    e.preventDefault();
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    setDirection(1);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
  });

  const slideVariants = {
    enter: (direction) => ({
      x: 0,
      y: direction > 0 ? -20 : 20,
      scale: 0.95,
      zIndex: 0,
      rotateX: direction > 0 ? 10 : -10,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      zIndex: 2,
      rotateX: 0,
    },
    exit: (direction) => ({
      x: 0,
      y: direction > 0 ? 20 : -20,
      scale: 0.95,
      opacity: 0,
      zIndex: 1,
      rotateX: direction > 0 ? -10 : 10,
    }),
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      setIsWishlistModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const renderActionButton = () => {
    if (!showWishlistButton) return null;

    return (
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
        title={property.isInWishlist ? "Saved to wishlist" : "Save to wishlist"}
      >
        <svg
          className={`w-5 h-5 ${property.isInWishlist ? 'text-rose-500' : 'text-gray-600'}`}
          fill={property.isInWishlist ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    );
  };

  return (
    <>
      <div className="relative">
        {renderActionButton()}
        <a
          href={`/property/${property.id}`}
          className="block bg-white transition-shadow group"
        >
          <div
            className="aspect-square relative"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            {...swipeHandlers}
          >
            <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full rounded-lg object-cover absolute inset-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    rotateX: { duration: 0.5 },
                  }}
                  onError={(e) => {
                    e.target.src = "https://www.homelyyours.com/data/propertyPlaceholder.png";
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </AnimatePresence>
              
              {/* Navigation Buttons */}
              {(showControls || images.length > 1) && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-90 transition-opacity z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-90 transition-opacity z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
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
                <p>Host : {property.owner.firstName} {property.owner.lastName}</p>
              </div>
              <div><span className="text-black font-medium">{property.price}€</span> / night</div>
            </div>
          </div>
        </a>
      </div>

      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        propertyId={property.id}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};  

export default PropertyCard;
