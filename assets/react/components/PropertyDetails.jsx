import React from 'react';
import PropTypes from 'prop-types';
import ImageGrid from './ImageGrid';
import AmenitiesSection from './AmenitiesSection';
import HostInfo from './HostInfo';
import ReviewsList from './ReviewsList';
import ReservationCard from './ReservationCard';

const PropertyDetails = ({ property }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                        <i className="fas fa-star text-yellow-400"></i>
                        {property.averageRating ? 
                            `${property.averageRating.toFixed(1)} · ${property.reviews.length} reviews` : 
                            'New'
                        }
                    </span>
                    <span className="flex items-center gap-2">
                        <i className="fas fa-map-marker-alt"></i>
                        {property.address.city}, {property.address.country}
                    </span>
                </div>
            </div>

            <ImageGrid images={property.images} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
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

                <ReservationCard property={property} />
            </div>
        </div>
    );
};

PropertyDetails.propTypes = {
    property: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
        amenities: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            category: PropTypes.object.isRequired,
        })).isRequired,
        owner: PropTypes.object.isRequired,
        reviews: PropTypes.array.isRequired,
        averageRating: PropTypes.number,
        address: PropTypes.object.isRequired
    }).isRequired
};

export default PropertyDetails;
