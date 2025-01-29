import React from 'react';
import Layout from './Layout';
import PropertyCard from './PropertyCard';

const WishlistDetails = ({ wishlist }) => {
    const items = wishlist?.wishlistItems || [];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold">{wishlist.name}</h1>
                        <p className="text-gray-500 mt-1">
                            {items.length} saved items
                        </p>
                    </div>
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">No places saved yet</h3>
                        <p className="text-gray-500">As you search, click the heart icon to save your favorite places to this wishlist.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map(item => (
                            <PropertyCard 
                                key={item.id} 
                                property={item.property} 
                                showHeartButton 
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WishlistDetails;
