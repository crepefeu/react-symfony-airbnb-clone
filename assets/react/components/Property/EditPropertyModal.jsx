import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

const EditPropertyModal = ({ isOpen, onClose, property, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    address: {
      streetName: '',
      streetNumber: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    amenities: [],
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        address: { ...property.address },
        amenities: property.amenities.map(a => a.id),
      });
    }
  }, [property]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleInputChange = (e, field, isNumeric = false) => {
    const value = isNumeric ? parseFloat(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: e.target.value }
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div title="Edit Property">
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange(e, 'title')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange(e, 'description')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per night</label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange(e, 'price', true)}
                    className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Guests</label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxGuests}
                  onChange={(e) => handleInputChange(e, 'maxGuests', true)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange(e, 'bedrooms', true)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange(e, 'bathrooms', true)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Name</label>
                  <input
                    type="text"
                    value={formData.address.streetName}
                    onChange={(e) => handleAddressChange(e, 'streetName')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Number</label>
                  <input
                    type="text"
                    value={formData.address.streetNumber}
                    onChange={(e) => handleAddressChange(e, 'streetNumber')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange(e, 'city')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange(e, 'state')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={formData.address.zipcode}
                    onChange={(e) => handleAddressChange(e, 'zipcode')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleAddressChange(e, 'country')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditPropertyModal;
