import React from 'react';

const Review = ({ formData }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Property Details</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Type</span>
            <span className="font-medium">{formData.propertyType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location</span>
            <span className="font-medium">{formData.location}</span>
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
            <div key={index} className="aspect-square rounded-lg overflow-hidden">
              <img
                src={photo.preview}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
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
