import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from '../utils/axios';
import { format } from 'date-fns';

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">Error Loading Properties</h3>
                    <p className="mt-1 text-sm text-red-700">{message}</p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center w-full">
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Try Again
                </button>
            </div>
        </div>
    </div>
);

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

                {error && <ErrorDisplay message={error} />}

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
