import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const AmenitiesSection = ({ amenities }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const visibleAmenities = amenities.slice(0, 6);
    const remainingCount = Math.max(0, amenities.length - 6);

    const renderAmenityItem = (amenity) => (
        <li key={amenity.id} className="flex items-center gap-3 py-2">
            <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: amenity.category.icon }} />
            <span>{amenity.name}</span>
        </li>
    );

    return (
        <>
            <div className="py-6">
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visibleAmenities.map(renderAmenityItem)}
                </ul>
                {remainingCount > 0 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 px-6 py-2 border border-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Show all {amenities.length} amenities
                    </button>
                )}
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 relative">
                                <div className="flex items-center mb-6">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="absolute left-4 top-4 p-2 hover:bg-gray-100 rounded-full"
                                        style={{ zIndex: 60 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <Dialog.Title className="text-2xl font-semibold w-full text-center">
                                        All amenities
                                    </Dialog.Title>
                                </div>
                                
                                <div className="max-h-[70vh] overflow-y-auto">
                                    {Object.entries(groupAmenitiesByCategory(amenities)).map(([categoryName, items], index, array) => (
                                        <div 
                                            key={categoryName} 
                                            className={`pb-8 ${index !== array.length - 1 ? 'mb-8 border-b border-gray-200' : ''}`}
                                        >
                                            <h4 className="text-lg font-semibold mb-4">{formatCategory(categoryName)}</h4>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {items.map(renderAmenityItem)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

const groupAmenitiesByCategory = (amenities) => {
    return amenities.reduce((acc, amenity) => {
        const categoryName = amenity.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(amenity);
        return acc;
    }, {});
};

const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

AmenitiesSection.propTypes = {
    amenities: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.shape({
            name: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default AmenitiesSection;
