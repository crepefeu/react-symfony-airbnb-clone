import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12 min-h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
  </div>
);

export default LoadingSpinner;
