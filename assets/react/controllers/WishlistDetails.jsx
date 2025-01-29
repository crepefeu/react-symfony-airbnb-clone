import React from 'react';
import WishlistDetailsComponent from '../components/WishlistDetails';

const WishlistDetails = (props) => {
    return <WishlistDetailsComponent wishlist={props.wishlist} />;
};

export default WishlistDetails;
