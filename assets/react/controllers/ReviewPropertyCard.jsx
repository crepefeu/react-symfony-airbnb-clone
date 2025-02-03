import React, { useEffect, useState } from "react";

const ReviewPropertyCard = ({ propertyId }) => {
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) throw new Error("Property not found");
        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setProperty(null);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (property)
    return (
      <div className="flex gap-10 items-center w-full border-b border-gray-200 px-8 py-6 relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-16 aspect-square object-cover rounded"
        />
        <div className="flex flex-col gap-4 justify-between w-2/3">
          <div className="flex flex-col gap-2">
            <div className="flex gap-10 justify-between items-center">
              <div className="text-gray-600 flex items-center gap-1">
                <img
                  className="w-8 rounded-full aspect-square"
                  src={property.owner.profilePicture}
                  alt={property.owner.firstName}
                />
                <span>
                  {property.owner.firstName} {property.owner.lastName}
                </span>
              </div>
            </div>
            <span className="text-lg font-semibold">{property.title}</span>
          </div>
        </div>
      </div>
    );
};

export default ReviewPropertyCard;
