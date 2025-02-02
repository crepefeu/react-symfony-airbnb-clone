import React from 'react';
import Layout from '../components/Layout';
import WishlistsComponent from '../components/Wishlists';

const Wishlists = () => {
    const breadcrumbs = [{ label: "Wishlists" }];

    return (
        <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
            <WishlistsComponent />
        </Layout>
    );
};

export default Wishlists;
