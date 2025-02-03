import React from 'react';

const Review = ({ formData }) => {
  const propertyTypeIcons = {
    'house': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
    ),
    'apartment': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'hotel': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    // Add more icon mappings as needed, using the same icon as fallback
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Use default house icon if type not found
  const IconComponent = propertyTypeIcons[formData.propertyType] || propertyTypeIcons['house'];

  const addressFields = [
    { label: 'Street', value: `${formData.address?.streetName || ''}`.trim() },
    { label: 'City', value: formData.address?.city },
    { label: 'State', value: formData.address?.state },
    { label: 'Postal Code', value: formData.address?.zipcode },
    { label: 'Country', value: formData.address?.country }
  ].filter(field => field.value); // Only show fields that have values

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Property Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Type</span>
            <div className="flex items-center gap-2">
              {IconComponent}
              <span className="font-medium">{capitalizeFirstLetter(formData.propertyType)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Address</span>
            </div>
            <div className="bg-white rounded-lg divide-y">
              {addressFields.map((field, index) => (
                <div key={field.label} className="p-3 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{field.label}</span>
                  <span className="font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Capacity</span>
            <span className="font-medium">
              {formData.guests} guests · {formData.bedrooms} bedrooms · {formData.bathrooms} bathrooms
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Photos</h3>
        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden relative">
              <img
                src={photo.preview}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-60 rounded-md">
                  <span className="text-white text-sm font-medium flex items-center gap-1">
                    Cover photo
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Amenities</h3>
        <div className="grid grid-cols-2 gap-4">
          {formData.amenities.length > 0 ? (
            formData.amenities.map((amenityId) => {
              // Find the amenity object from the API response in formData
              const amenity = formData.amenitiesData?.find(a => a.id === amenityId);
              return (
                <div key={amenityId} className="flex gap-6">
                  <div 
                    className="w-5 h-5 text-gray-600"
                    dangerouslySetInnerHTML={{ 
                      __html: amenity?.categoryIcon || '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' 
                    }} 
                  />
                  <span>{amenity?.name || 'Unknown Amenity'}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-2">No amenities selected</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Description</h3>
        <h4 className="font-medium mb-2">{formData.title}</h4>
        <p className="text-gray-600">{formData.description}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Price</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Per night</span>
          <span className="text-2xl font-semibold">{formData.price}€</span>
        </div>
      </div>

      <div className="bg-rose-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-2 text-rose-600">Ready to publish?</h3>
        <p className="text-gray-600">
          Make sure all the information is correct. You can always edit these details later.
        </p>
      </div>
    </div>
  );
};

export default Review;
