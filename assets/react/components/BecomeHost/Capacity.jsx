import React from 'react';

const Capacity = ({ formData, setFormData }) => {
  const handleIncrement = (field) => {
    setFormData({
      ...formData,
      [field]: formData[field] + 1
    });
  };

  const handleDecrement = (field) => {
    if (formData[field] > 1) {
      setFormData({
        ...formData,
        [field]: formData[field] - 1
      });
    }
  };

  const capacityFields = [
    { id: 'guests', label: 'Guests', max: 16 },
    { id: 'bedrooms', label: 'Bedrooms', max: 8 },
    { id: 'bathrooms', label: 'Bathrooms', max: 8 },
  ];

  return (
    <div className="space-y-8">
      {capacityFields.map((field) => (
        <div key={field.id} className="flex items-center justify-between pb-6 border-b">
          <span className="text-lg">{field.label}</span>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => handleDecrement(field.id)}
              className={`p-2 rounded-full border ${
                formData[field.id] <= 1 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-400 text-gray-600 hover:border-gray-600'
              }`}
              disabled={formData[field.id] <= 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center">{formData[field.id]}</span>
            <button
              type="button"
              onClick={() => handleIncrement(field.id)}
              className={`p-2 rounded-full border ${
                formData[field.id] >= field.max
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-400 text-gray-600 hover:border-gray-600'
              }`}
              disabled={formData[field.id] >= field.max}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Capacity;
