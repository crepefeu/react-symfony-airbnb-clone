import React, { useState, useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

const Amenities = ({ formData, setFormData }) => {
  const [amenities, setAmenities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await fetch('/api/amenities');
      const data = await response.json();
      setAmenities(data.amenities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setLoading(false);
    }
  };

  const handleSearch = debounce((term) => {
    const filtered = amenities.filter(amenity => 
      amenity.name.toLowerCase().includes(term.toLowerCase()) ||
      (typeof amenity.category === 'string' 
        ? amenity.category 
        : amenity.category.name).toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAmenities(filtered);
  }, 300);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId],
      // Store the full amenities data for the review step
      amenitiesData: amenities
    }));
  };

  const groupedAmenities = useMemo(() => {
    if (searchTerm) {
      // When searching, show filtered results in a single list
      const filtered = amenities.filter(amenity => 
        amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        amenity.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { "Search Results": filtered };
    }

    // Group amenities by category
    return amenities.reduce((acc, amenity) => {
      const category = amenity.categoryName;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {});
  }, [amenities, searchTerm]);

  if (loading) {
    return <div>Loading amenities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search amenities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-8">
        {Object.entries(groupedAmenities).map(([category, items]) => (
          <div key={category} className="border-b last:border-b-0 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-8 h-8 flex items-center justify-center text-gray-600"
                dangerouslySetInnerHTML={{ 
                  __html: items[0]?.category?.icon || '' 
                }} 
              />
              <h3 className="text-xl font-semibold capitalize">{category}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(amenity => (
                <div
                  key={amenity.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.amenities.includes(amenity.id)
                      ? 'border-rose-600 bg-rose-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAmenityToggle(amenity.id)}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="peer sr-only" // Hide default checkbox but keep functionality
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center
                      ${formData.amenities.includes(amenity.id)
                        ? 'bg-rose-600 border-rose-600'
                        : 'border-gray-300 peer-hover:border-gray-400'
                      }`}
                    >
                      {formData.amenities.includes(amenity.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-900">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Amenities;
