import React, { useEffect, useState } from 'react';

const PropertyDetails = ({ propertyId }) => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`/api/properties/${propertyId}`);
                if (!response.ok) throw new Error('Property not found');
                const data = await response.json();
                setProperty(data.property);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);

    if (loading) return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
    </div>;

    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    if (!property) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                {property.images?.map((image, index) => (
                    <img 
                        key={index}
                        src={image}
                        alt={`Property ${index + 1}`}
                        className={`w-full h-64 object-cover rounded-lg ${index === 0 ? 'col-span-2' : ''}`}
                    />
                ))}
            </div>

            {/* Property Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-semibold mb-4">About this place</h2>
                    <p className="text-gray-600 mb-6">{property.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                    <ul className="grid grid-cols-2 gap-2">
                        {property.amenities?.map((amenity, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="text-gray-600">✓</span> {amenity}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Booking Card */}
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

export default PropertyDetails;
