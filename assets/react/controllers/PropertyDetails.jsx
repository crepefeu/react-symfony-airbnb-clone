import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PropertyDetails from '../components/PropertyDetails';

export default function({ propertyId }) {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/properties/${propertyId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Property not found');
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

    const breadcrumbs = property ? [
        { label: 'Properties', href: '/' },
        { label: property.title }
    ] : [];

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <a href="/" className="text-rose-500 hover:underline">Return to homepage</a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <PropertyDetails property={property} />
        </Layout>
    );
}
