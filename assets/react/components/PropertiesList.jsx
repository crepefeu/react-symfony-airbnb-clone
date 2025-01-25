import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';

const DEFAULT_IMAGE = 'https://a0.muscache.com/im/pictures/miso/Hosting-852899544218333667/original/c627f47e-8ca9-4471-90d4-1fd987dd2362.jpeg'; // Add a default image URL

const PropertiesList = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('/api/properties');
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                const data = await response.json();
                setProperties(data.properties);
            } catch (error) {
                console.error('Error fetching properties:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchProperties();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PropertiesList;
