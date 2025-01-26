import React, { useState } from "react";
import PropTypes from "prop-types";
import FullScreenGallery from "./FullScreenGallery";

const DEFAULT_IMAGES = Array(5).fill(
  "https://placehold.co/800x600?text=No+Image+Available"
);

const ImageGrid = ({ images = [] }) => {
  const [showAllImages, setShowAllImages] = useState(false);
  const displayImages = images.length > 0 ? images : DEFAULT_IMAGES;

  if (showAllImages) {
    return (
      <FullScreenGallery
        images={displayImages}
        onClose={() => setShowAllImages(false)}
      />
    );
  }

  return (
    <div className="relative grid grid-cols-4 gap-2 rounded-lg overflow-hidden h-[50vh] mb-8">
      <div className="col-span-2 row-span-2 relative">
        <img
          src={displayImages[0]}
          alt="Main property view"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative">
        <img
          src={displayImages[1]}
          alt="Property view 2"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative">
        <img
          src={displayImages[2]}
          alt="Property view 3"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative">
        <img
          src={displayImages[3]}
          alt="Property view 4"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative">
        <img
          src={displayImages[4]}
          alt="Property view 5"
          className="w-full h-full object-cover"
        />
      </div>
      <button
        onClick={() => setShowAllImages(true)}
        className="flex items-center gap-4 absolute bottom-4 right-4 border border-black text-sm bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      >
        Show all photos
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-images"
          >
            <path d="M18 22H4a2 2 0 0 1-2-2V6" />
            <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
            <circle cx="12" cy="8" r="2" />
            <rect width="16" height="16" x="6" y="2" rx="2" />
          </svg>
        </span>
      </button>
    </div>
  );
};

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ImageGrid;
