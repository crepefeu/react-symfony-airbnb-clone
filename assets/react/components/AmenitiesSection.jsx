import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AmenitiesModal from './AmenitiesModal';

const AmenitiesSection = ({ amenities }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-6 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">What this place offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {amenities.slice(0, 6).map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-4">
            <div 
              className="w-8 h-8 flex items-center justify-center text-gray-600"
              dangerouslySetInnerHTML={{ __html: amenity.icon }}
            />
            <span className="text-lg">{amenity.name}</span>
          </div>
        ))}
      </div>
      {amenities.length > 6 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 border border-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Show all {amenities.length} amenities
        </button>
      )}

      <AmenitiesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amenities={amenities}
      />
    </div>
  );
};

AmenitiesSection.propTypes = {
  amenities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.object.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
};

export default AmenitiesSection;
