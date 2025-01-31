import React from "react";
import TripCard from "./TripCard";

const TripsList = ({ trips }) => {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 gap-8 py-8">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export default TripsList;
