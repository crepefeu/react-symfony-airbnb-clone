import React, { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';
import Filters from './Filters';

const DEFAULT_IMAGE = 'https://a0.muscache.com/im/pictures/miso/Hosting-852899544218333667/original/c627f47e-8ca9-4471-90d4-1fd987dd2362.jpeg'; // Add a default image URL

const PropertiesList = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ maxPrice: '', propertyType: '' });
    const [sortBy, setSortBy] = useState('newest');

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

    useEffect(() => {
        let result = [...properties];

        // Apply filters
        if (filters.maxPrice) {
            result = result.filter(p => p.price <= parseInt(filters.maxPrice));
        }
        if (filters.propertyType) {
            result = result.filter(p => p.propertyType === filters.propertyType);
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

        setFilteredProperties(result);
    }, [properties, filters, sortBy]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12 min-h-screen">
                <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-12 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div>
            <Filters 
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                filters={filters}
                sortBy={sortBy}
            />
            <div className="py-8">
                <div className="px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesList;
