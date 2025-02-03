import React from 'react';

const GuestPicker = ({ guests, onChange, maxGuests, onClose }) => {
  const handleChange = (type, value) => {
    onChange({
      ...guests,
      [type]: Math.max(0, value)
    });
  };

  const currentGuests = {
    adults: guests?.adults || 0,
    children: guests?.children || 0
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Who's coming?</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Adults</div>
            <div className="text-sm text-gray-500">Ages 13 or above</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              onClick={() => handleChange('adults', currentGuests.adults - 1)}
              disabled={currentGuests.adults <= 0}
            >
              -
            </button>
            <span>{currentGuests.adults}</span>
            <button
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              onClick={() => handleChange('adults', currentGuests.adults + 1)}
              disabled={currentGuests.adults + currentGuests.children >= maxGuests}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Children</div>
            <div className="text-sm text-gray-500">Ages 2-12</div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              onClick={() => handleChange('children', currentGuests.children - 1)}
              disabled={currentGuests.children <= 0}
            >
              -
            </button>
            <span>{currentGuests.children}</span>
            <button
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              onClick={() => handleChange('children', currentGuests.children + 1)}
              disabled={currentGuests.adults + currentGuests.children >= maxGuests}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestPicker;