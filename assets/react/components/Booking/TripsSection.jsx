import React from 'react';
import TripsList from './TripsList';

const TripsSection = ({ title, trips }) => {
  if (trips.length === 0) return null;
  
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <TripsList trips={trips} />
    </div>
  );
};

export default TripsSection;
