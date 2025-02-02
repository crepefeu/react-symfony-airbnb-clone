import React from 'react';
import Modal from './Modal';
import { Autocomplete } from '@react-google-maps/api';

const PropertyDetailsModal = ({ 
  isOpen, 
  onClose, 
  location, 
  bedrooms, 
  onLocationChange, 
  onBedroomsChange,
  searchBox,
  onSearchBoxLoad,
  onPlaceChanged 
}) => {
  React.useEffect(() => {
    // Style the autocomplete dropdown
    const stylesheet = document.createElement('style');
    stylesheet.textContent = `
      .pac-container {
        border-radius: 8px;
        margin-top: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
      }
      .pac-item {
        padding: 8px 16px;
        cursor: pointer;
        font-family: inherit;
      }
      .pac-item:hover {
        background-color: #f3f4f6;
      }
      .pac-item-selected {
        background-color: #f3f4f6;
      }
      .pac-icon {
        display: none;
      }
      .pac-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 10px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(stylesheet);

    return () => {
      document.head.removeChild(stylesheet);
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div title="Edit your property details">
        <div className="space-y-6 divide-y divide-gray-200">
          {/* Location Section */}
          <div className="pb-6">
            <h3 className="text-md font-medium mb-4">Where's your place located ?</h3>
            <div className="flex justify-center">
              <div className="w-full">
                <Autocomplete
                  onLoad={onSearchBoxLoad}
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    type="text"
                    defaultValue={location.address}
                    placeholder="Enter your address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-center"
                    style={{
                      height: '50px',
                      fontSize: '16px'
                    }}
                  />
                </Autocomplete>
              </div>
            </div>
          </div>

          {/* Bedrooms Section */}
          <div className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">How many bedrooms ?</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onBedroomsChange(Math.max(1, bedrooms - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-500"
                >
                  <span className="text-lg">-</span>
                </button>
                <span className="text-xl font-medium w-8 text-center">{bedrooms}</span>
                <button
                  onClick={() => onBedroomsChange(Math.min(10, bedrooms + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-500"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PropertyDetailsModal;
