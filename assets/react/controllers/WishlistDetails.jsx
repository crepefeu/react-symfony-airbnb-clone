import React from 'react';
import Layout from '../components/Layout';
import WishlistDetailsComponent from '../components/WishlistDetails';

const WishlistDetails = (props) => {
    const breadcrumbs = [
        { label: "Wishlists", href: "/wishlists" },
        { label: props.wishlist?.name || "Not Found" }
    ];

    if (!props.wishlist) {
        return (
            <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-medium mt-4 mb-2">Wishlist not found</h3>
                        <p className="text-gray-500 mb-4">This wishlist might have been removed or doesn't exist.</p>
                        <a href="/wishlists" className="text-rose-600 hover:text-rose-700 font-medium">
                            View all wishlists
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout breadcrumbs={breadcrumbs}>
            <WishlistDetailsComponent wishlist={props.wishlist} />
        </Layout>
    );
};

export default WishlistDetails;
