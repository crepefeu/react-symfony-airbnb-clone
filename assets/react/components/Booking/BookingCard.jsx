import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import useAuth from "../../hooks/useAuth";
import Toast from "../UI/Toast";

const BookingCard = ({ booking }) => {
  const { token } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const confirmBooking = async () => {
    const response = await fetch("/api/bookings/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId: booking.id }),
    });
    const data = await response.json();

    if (response.ok) {
      setShowToast(true);
      setToastMessage(data.message);
      setToastType("success");
    } else {
      setShowToast(true);
      setToastMessage(data.error);
      setToastType("error");
    }
  };

  const cancelBooking = async () => {
    const response = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId: booking.id }),
    });
    const data = await response.json();

    if (response.ok) {
      setShowToast(true);
      setToastMessage(data.message);
      setToastType("success");
    } else {
      setShowToast(true);
      setToastMessage(data.error);
      setToastType("error");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center w-full relative">
      <div className="flex flex-col gap-3">
        <div className="flex gap-10 items-center w-full border border-gray-200 rounded-xl px-8 py-6 relative">
          <img
            src={booking.property.image}
            alt={booking.property.title}
            className="w-1/3 aspect-square object-cover rounded"
          />
          <div className="flex flex-col gap-4 justify-between w-2/3">
            <div className="flex flex-col gap-2">
              <div className="flex gap-10 justify-between items-center">
                <div className="text-gray-600 flex items-center gap-1">
                  <img
                    className="w-8 rounded-full aspect-square"
                    src={booking.guest.profilePicture}
                    alt=""
                  />
                  <span>
                    {booking.guest.firstName} {booking.guest.lastName}
                  </span>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <span className="text-lg font-semibold">
                {booking.property.title}
              </span>
            </div>
            <hr />
            <div className="flex flex-col gap-1">
              <span className=" text-gray-600 font-semibold">
                {formatDate(booking.checkInDate.date)} -{" "}
                {formatDate(booking.checkOutDate.date)}
              </span>
              <span className="text-gray-600">
                {booking.numberOfGuests} guests - {booking.totalPrice} €
              </span>
            </div>
          </div>
        </div>
        {booking.status == "pending" && (
          <div className="flex gap-4">
            <button
              onClick={() => confirmBooking()}
              className="bg-rose-500 text-white py-1 rounded w-1/2 font-semibold hover:bg-rose-600 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => cancelBooking()}
              className="bg-gray-200 text-gray-800 py-1 rounded w-1/2 font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          onClose={() => setShowToast(false)}
          onClick={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default BookingCard;
