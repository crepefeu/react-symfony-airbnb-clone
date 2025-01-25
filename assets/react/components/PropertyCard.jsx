import React from 'react';

const PLACEHOLDER_IMAGE = 'https://a0.muscache.com/im/pictures/2a5aa8aa-c3c3-4f49-a94c-f1d335500e8f.jpg';

const PropertyCard = ({ property }) => {
    const handleImageError = (e) => {
        e.target.src = "https://www.homelyyours.com/data/propertyPlaceholder.png";
    };

    const imageUrl = property.images?.length > 0 
        ? property.images[0] 
        : "https://www.homelyyours.com/data/propertyPlaceholder.png";

    return (
        <a 
            href={`/property/${property.id}`}
            className="block border bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                    src={imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold truncate">{property.title}</h3>
                <p className="text-gray-600">{property.price}€ / night</p>
                <div className="text-sm text-gray-500 mt-1">
                    {property.address?.city}, {property.address?.country}
                </div>
            </div>
        </a>
    );
};

export default PropertyCard;
