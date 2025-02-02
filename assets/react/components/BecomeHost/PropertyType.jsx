import React from 'react';

const PropertyType = ({ formData, setFormData }) => {
  const types = [
    { id: 'house', label: 'House', icon: '🏠' },
    { id: 'apartment', label: 'Apartment', icon: '🏢' },
    { id: 'guesthouse', label: 'Guesthouse', icon: '🏡' },
    { id: 'hotel', label: 'Hotel', icon: '🏨' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {types.map((type) => (
          <button
            key={type.id}
            className={`p-6 border rounded-xl text-left transition-all ${
              formData.propertyType === type.id
                ? 'border-black shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setFormData({ ...formData, propertyType: type.id })}
          >
            <span className="text-3xl mb-4 block">{type.icon}</span>
            <span className="font-medium">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyType;
