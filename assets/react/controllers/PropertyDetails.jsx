import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ImageGrid from "../components/ImageGrid";
import AmenitiesSection from "../components/AmenitiesSection";
import HostInfo from "../components/HostInfo";
import ReviewsList from "../components/ReviewsList";
import ReservationCard from "../components/ReservationCard";
import LocationSection from "../components/LocationSection";
import ReviewsModal from "../components/ReviewsModal";
import PropertyHeader from "../components/Property/PropertyHeader";
import PropertyDescription from "../components/Property/PropertyDescription";

const PropertyDetails = ({ propertyId }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) throw new Error("Property not found");
        const data = await response.json();
        setProperty(data.property);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading || !property) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <a href="/" className="text-rose-500 hover:underline">
            Return to homepage
          </a>
        </div>
      </Layout>
    );
  }

  const breadcrumbs = [
    { label: "Properties", href: "/" },
    { label: property.title },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-medium mb-4">{property.title}</h1>

        <div className="mb-8">
          <ImageGrid images={property.images} />
        </div>

        <PropertyHeader
          {...property}
          onShowReviews={() => setIsReviewsModalOpen(true)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col md:col-span-2">
            <HostInfo
              host={property.owner}
              propertiesCount={property.owner.properties?.length || 0}
            />

            <PropertyDescription description={property.description} />

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
    </Layout>
  );
};

export default PropertyDetails;
