import React from "react";

const BookingsSection = ({ title, bookings }) => {
  if (bookings.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <BookingsSection bookings={bookings} />
    </div>
  );
};

export default BookingsSection;
