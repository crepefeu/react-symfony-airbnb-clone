import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import { format } from 'date-fns';

const Search = ({ initialSearchParams }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const breadcrumbs = [
        { label: "Search Results" }
    ];

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const params = {
                    location: initialSearchParams.location,
                    guests: initialSearchParams.guests
                };
                
                // Add coordinates if available from initialSearchParams
                if (initialSearchParams.latitude && initialSearchParams.longitude) {
                    params.latitude = initialSearchParams.latitude;
                    params.longitude = initialSearchParams.longitude;
                }

                const response = await axios.get('/api/search', { params });
                setProperties(response.data.properties);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [initialSearchParams]);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch (e) {
            return null;
        }
    };

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold">
                        Search Results for {initialSearchParams.location}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {initialSearchParams.checkIn && initialSearchParams.checkOut ? (
                            <>
                                {formatDate(initialSearchParams.checkIn)} - {formatDate(initialSearchParams.checkOut)}
                                •
                            </>
                        ) : null}
                        {' '}{initialSearchParams.guests} guests
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-center py-8">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {!loading && !error && properties.map((property) => (
                        <div key={property.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <a href={`/property/${property.id}`}>
                                <img 
                                    src={property.images[0]} 
                                    alt={property.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                                    <p className="text-gray-600">{property.location}</p>
                                    <p className="mt-2">
                                        <span className="font-semibold">${property.price}</span> / night
                                    </p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                {!loading && !error && properties.length === 0 && (
                    <div className="text-center py-8">
                        <h2 className="text-xl font-semibold mb-2">No properties found</h2>
                        <p className="text-gray-600">
                            Try adjusting your search criteria
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Search;
