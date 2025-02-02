import React from "react";
import StatusBadge from "./StatusBadge";

const TripCard = ({ trip }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };
  return (
    <div className="flex flex-col gap-2 items-center">
      <a
        href={`/property/${trip.property.id}`}
        className="block bg-white group"
      >
        <div className="aspect-square relative shadow rounded-lg overflow-hidden">
          <div className="relative w-full">
            <img
              src={trip.property.image}
              alt={trip.property.title}
              className="w-full aspect-square object-cover"
            />
            <div className="bg-white/90 absolute left-0 bottom-0 w-full px-3 py-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">
                  {formatDate(trip.checkInDate.date)} -{" "}
                  {formatDate(trip.checkOutDate.date)}
                </span>
                <span className="text-gray-600 text-sm font-semibold">
                  {trip.numberOfGuests} guests
                </span>
              </div>
              <hr className="border-b-0 border-gray-300 w-full" />
              <h3 className="font-semibold truncate">{trip.property.title}</h3>
              <div className="text-gray-600 flex items-center gap-1">
                <img
                  className="w-6 rounded-full aspect-square"
                  src={trip.property.owner.profilePicture}
                  alt=""
                />
                <span>
                  {trip.property.owner.firstName} {trip.property.owner.lastName}
                </span>
              </div>
            </div>
            <StatusBadge status={trip.status} absolute={true} />
          </div>
        </div>
      </a>
      {trip.status == "pending" && (
        <button className="bg-rose-500 text-white w-full py-1 rounded">
          Cancel
        </button>
      )}
    </div>
  );
};

export default TripCard;
