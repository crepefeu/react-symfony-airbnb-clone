import React from 'react';
import PropTypes from 'prop-types';
import ImageGrid from './ImageGrid';
import AmenitiesSection from './AmenitiesSection';

const PropertyDetails = ({ property }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            
            <div className="flex gap-4 text-gray-600 mb-6">
                <span className="flex items-center gap-2">
                    <i className="fas fa-bed"></i>
                    {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                </span>
                <span className="flex items-center gap-2">
                    <i className="fas fa-bath"></i>
                    {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                </span>
            </div>

            <ImageGrid images={property.images} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">About this place</h2>
                    <div className="text-gray-600 mb-6 whitespace-pre-wrap">{property.description}</div>
                    
                    <AmenitiesSection amenities={property.amenities} />
                </div>

                <div className="border rounded-xl p-6 shadow-lg h-fit sticky top-24">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold">€{property.price}</span>
                        <span className="text-gray-500">per night</span>
                    </div>
                    <button className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors">
                        Reserve
                    </button>
                </div>
            </div>
        </div>
    );
};

PropertyDetails.propTypes = {
    property: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
        amenities: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            category: PropTypes.object.isRequired,
        })).isRequired
    }).isRequired
};

export default PropertyDetails;
