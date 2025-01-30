import React from 'react';
import Layout from './Layout';

const Wishlists = ({ wishlists = [] }) => {
    const isEmpty = wishlists.length === 0;

    const getWishlistCoverImage = (wishlist) => {
        const firstItem = wishlist.wishlistItems[0];
        return firstItem ? firstItem.property.images[0] : null;
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
                <h1 className="text-3xl font-semibold mb-6">Wishlists</h1>
                
                {isEmpty ? (
                    <div className="text-center py-16">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">Create your first wishlist</h3>
                        <p className="text-gray-500">As you search, click the heart icon to save your favorite places and Experiences to a wishlist.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlists.map(wishlist => (
                            <a 
                                key={wishlist.id} 
                                href={`/wishlists/${wishlist.id}`}
                                className="group block"
                            >
                                <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gray-200">
                                    {getWishlistCoverImage(wishlist) ? (
                                        <img 
                                            src={getWishlistCoverImage(wishlist)} 
                                            alt={wishlist.name}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium">{wishlist.name}</h3>
                                    <p className="text-gray-500">{wishlist.wishlistItems.length} saved items</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlists;
