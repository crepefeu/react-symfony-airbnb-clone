import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import useAuth from '../hooks/useAuth';

const Wishlists = () => {
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, wishlistId: null });
    const { token } = useAuth();

    useEffect(() => {
        const fetchWishlists = async () => {
            try {
                const response = await fetch('/api/wishlists', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch wishlists');
                }

                const data = await response.json();
                setWishlists(data.wishlists || []);
            } catch (error) {
                console.error('Error fetching wishlists:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchWishlists();
        }
    }, [token]);

    const getWishlistImages = (wishlist) => {
        const items = wishlist.wishlistItems;
        if (!items?.length) return [];

        // Return up to 4 images for the collage
        return items.slice(0, 4).map(item => 
            item?.property?.propertyMedias?.[0]?.mediaUrl || null
        ).filter(Boolean);
    };

    const handleDelete = async (wishlistId) => {
        try {
            const response = await fetch(`/api/wishlists/${wishlistId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete wishlist');
            }

            setWishlists(wishlists.filter(w => w.id !== wishlistId));
            setDeleteModal({ show: false, wishlistId: null });
        } catch (error) {
            console.error('Error deleting wishlist:', error);
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-2xl"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const isEmpty = wishlists.length === 0;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-semibold mb-8">Wishlists</h1>
                
                {isEmpty ? (
                    <div className="text-center py-16 px-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-medium mb-3">No wishlists yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">As you explore, click the heart icon to save your favorite properties to a wishlist. Your lists will show up here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlists.map(wishlist => {
                            const images = getWishlistImages(wishlist);
                            return (
                                <div key={wishlist.id} className="relative group">
                                    <a href={`/wishlists/${wishlist.id}`} className="block">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                                            {images.length > 0 ? (
                                                <div className="grid grid-cols-2 grid-rows-2 h-full">
                                                    {images.length === 1 ? (
                                                        <div className="col-span-2 row-span-2">
                                                            <img src={images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                        </div>
                                                    ) : (
                                                        images.map((img, idx) => (
                                                            <div key={idx} className={`relative ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
                                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 group-hover:to-black/60 transition-all"></div>
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h3 className="text-xl font-semibold mb-1">{wishlist.name}</h3>
                                                <p className="text-sm text-white/90">{wishlist.wishlistItems.length} items</p>
                                            </div>
                                        </div>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDeleteModal({ show: true, wishlistId: wishlist.id });
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                            <h3 className="text-lg font-semibold mb-4">Delete Wishlist</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this wishlist? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setDeleteModal({ show: false, wishlistId: null })}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteModal.wishlistId)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlists;
