import React from 'react';

const Price = ({ formData, setFormData }) => {
  const handlePriceChange = (value) => {
    // Remove non-numeric characters and convert to number
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData({
      ...formData,
      price: numericValue
    });
  };

  const recommendedPrice = 100; // This could be calculated based on location, amenities, etc.

  const pricePresets = [
    { label: 'Lower', value: recommendedPrice - 20 },
    { label: 'Recommended', value: recommendedPrice },
    { label: 'Higher', value: recommendedPrice + 20 },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl font-light mb-6">
          <input
            type="text"
            value={formData.price ? `${formData.price}` : ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="0"
            className="w-40 text-center focus:outline-none focus:ring-0 border-b-2 border-gray-200 focus:border-gray-600"
          />
          <span className="text-3xl ml-2">€</span>
        </div>
        <p className="text-gray-500">per night</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {pricePresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePriceChange(preset.value.toString())}
            className={`p-4 border rounded-xl transition-all ${
              formData.price === preset.value
                ? 'border-black shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{preset.label}</div>
            <div className="text-2xl">{preset.value}€</div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="font-medium mb-2">Price tips</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Properties like yours in this area usually range from 80€ to 120€</li>
          <li>• You can adjust your price anytime</li>
          <li>• Special offers and seasonal adjustments can help you earn more</li>
        </ul>
      </div>
    </div>
  );
};

export default Price;
