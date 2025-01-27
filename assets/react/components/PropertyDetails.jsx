import React, { useState } from "react";
import PropTypes from "prop-types";
import ImageGrid from "./ImageGrid";
import AmenitiesSection from "./AmenitiesSection";
import HostInfo from "./HostInfo";
import ReviewsList from "./ReviewsList";
import ReservationCard from "./ReservationCard";
import LocationSection from "./LocationSection";
import ReviewsModal from "./ReviewsModal";

const PropertyDetails = ({ property }) => {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-medium mb-4">{property.title}</h1>

      <ImageGrid images={property.images} />

      <div className="flex flex-col my-4">
        <p className="text-2xl font-medium">
          {property.propertyType} - {property.address.city},{" "}
          {property.address.country}
        </p>
        <div className="flex gap-[1px] items-center">
          <p>{property.bedrooms} bedrooms</p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-dot mt-[2px]"
          >
            <circle cx="12.1" cy="12.1" r="1" />
          </svg>

          <p>{property.bathrooms} bathrooms</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <svg
            className={`h-5 w-5`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>

          <button
            className="text-gray-600 underline cursor-pointer bg-transparent"
            onClick={() => setIsReviewsModalOpen(true)}
          >
            {property.reviews.length} reviews
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="flex flex-col md:col-span-2">
          <HostInfo
            host={property.owner}
            propertiesCount={property.owner.properties?.length || 0}
          />

          <div className="py-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <div className="text-gray-600 mb-6 whitespace-pre-wrap">
              {property.description}
            </div>
          </div>

          <AmenitiesSection amenities={property.amenities} />

          {property.reviews.length > 0 && (
            <ReviewsList
              reviews={property.reviews}
              averageRating={property.averageRating}
            />
          )}
        </div>

        <div className="md:col-span-1">
          <ReservationCard property={property} />
        </div>
      </div>

      <div className="mt-8">
        <LocationSection
          latitude={property.latitude}
          longitude={property.longitude}
          city={property.address.city}
          country={property.address.country}
        />
      </div>

      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        reviews={property.reviews}
        averageRating={property.averageRating}
      />
    </div>
  );
};

PropertyDetails.propTypes = {
  property: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    amenities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.object.isRequired,
      })
    ).isRequired,
    owner: PropTypes.object.isRequired,
    reviews: PropTypes.array.isRequired,
    averageRating: PropTypes.number,
    address: PropTypes.object.isRequired,
  }).isRequired,
};

export default PropertyDetails;
