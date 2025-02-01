import React from 'react';

const PropertyDescription = ({ description }) => {
  return (
    <div className="py-6 border-t border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">About this place</h2>
      <div className="text-gray-600 mb-6 whitespace-pre-wrap">
        {description}
      </div>
    </div>
  );
};

export default PropertyDescription;
