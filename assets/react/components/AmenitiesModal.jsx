import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const AmenitiesModal = ({ isOpen, onClose, amenities }) => {
  const groupedAmenities = useMemo(() => {
    return amenities.reduce((acc, amenity) => {
      const category = amenity.category.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {});
  }, [amenities]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full" title="What this place offers">
        <div className="space-y-8">
          {Object.entries(groupedAmenities).map(([category, items]) => (
            <div key={category} className="border-b last:border-b-0 pb-8 last:pb-0">
              <h3 className="text-xl font-semibold mb-6 capitalize">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-4">
                    <div 
                      className="w-8 h-8 flex items-center justify-center text-gray-600"
                      dangerouslySetInnerHTML={{ __html: amenity.icon }}
                    />
                    <span className="text-lg">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

AmenitiesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  amenities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
};

export default AmenitiesModal;
