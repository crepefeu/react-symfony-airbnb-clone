import React, { useState, useEffect } from 'react';

const Price = ({ formData, setFormData }) => {
  const [priceStats, setPriceStats] = useState({
    min: 0,
    max: 0,
    recommended: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateData = () => {
      if (!formData.latitude || !formData.longitude) {
        setError('Please set your property location first');
        setLoading(false);
        return false;
      }
      if (!formData.bedrooms) {
        setError('Please set the number of bedrooms first');
        setLoading(false);
        return false;
      }
      return true;
    };

    const fetchPriceData = async () => {
      setLoading(true);
      setError(null);

      if (!validateData()) {
        return;
      }

      try {
        const response = await fetch(`/api/properties/bounds?` + 
          new URLSearchParams({
            north: formData.latitude + 0.02, // Roughly 2km radius
            south: formData.latitude - 0.02,
            east: formData.longitude + 0.02,
            west: formData.longitude - 0.02,
            bedrooms: formData.bedrooms
          })
        );

        const data = await response.json();
        
        if (data.properties && data.properties.length > 0) {
          const prices = data.properties.map(p => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

          setPriceStats({
            min: minPrice,
            max: maxPrice,
            recommended: avgPrice,
          });
        } else {
          // Fallback values if no properties found
          setPriceStats({
            min: 80,
            max: 120,
            recommended: 100,
          });
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        // Use fallback values on error
        setPriceStats({
          min: 80,
          max: 120,
          recommended: 100,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [formData.latitude, formData.longitude, formData.bedrooms]);

  const handlePriceChange = (value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setFormData({
      ...formData,
      price: numericValue
    });
  };

  const pricePresets = [
    { label: 'Lower', value: Math.round(priceStats.recommended * 0.8) },
    { label: 'Recommended', value: priceStats.recommended },
    { label: 'Higher', value: Math.round(priceStats.recommended * 1.2) },
  ];

  if (error) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-red-600 bg-red-50 p-6 rounded-xl">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Missing Information</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="font-medium mb-2">Why this information matters</h3>
          <p className="text-gray-600">
            We need your property's location and number of bedrooms to provide accurate price recommendations based on similar properties in your area.
          </p>
        </div>
      </div>
    );
  }

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

      {loading ? (
        <div className="text-center text-gray-500">Loading price recommendations...</div>
      ) : (
        <>
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
              <li>• Properties like yours in this area usually range from {priceStats.min}€ to {priceStats.max}€</li>
              <li>• You can adjust your price anytime</li>
              <li>• Special offers and seasonal adjustments can help you earn more</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Price;
