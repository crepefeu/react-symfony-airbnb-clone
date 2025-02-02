import React from "react";
import BookingCard from "./BookingCard";

const BookingsList = ({ bookings }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10 py-3">
      {bookings.map((booking) => (
        <BookingCard booking={booking} key={booking.id} />
      ))}
    </div>
  );
};

export default BookingsList;
