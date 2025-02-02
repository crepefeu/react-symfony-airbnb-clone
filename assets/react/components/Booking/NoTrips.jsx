import React from 'react';

const NoTrips = () => (
  <div className="flex flex-col items-center justify-center py-12 min-h-[80vh]">
    <h3 className="text-xl font-semibold mb-4">No trips booked...yet!</h3>
    <p className="text-gray-600 mb-6">Time to dust off your bags and start planning your next adventure</p>
    <a href="/" className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600">
      Start searching
    </a>
  </div>
);

export default NoTrips;
