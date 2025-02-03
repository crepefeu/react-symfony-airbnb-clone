import React, { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import useAuth from "../../hooks/useAuth";
import Toast from "../UI/Toast";
import StarRating from "../StarRating";

const TripCard = ({ trip }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const { token } = useAuth();

  const user = JSON.parse(localStorage.getItem("user"));

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const cancelBooking = async () => {
    const response = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId: trip.id }),
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
        <button
          className="bg-rose-500 text-white w-full py-1 rounded hover:bg-rose-600"
          onClick={() => cancelBooking()}
        >
          Cancel
        </button>
      )}
      {trip.status == "finished" && !trip.review.id && (
        <a
          href={`/review/${trip.property.id}/${user.id}/new`}
          className="bg-rose-500 text-white w-full py-1 rounded hover:bg-rose-600 text-center"
        >
          Leave a review
        </a>
      )}
      {trip.status == "finished" && trip.review.id && (
        <div className="border border-gray-200 rounded py-3 w-full px-4 relative shadow">
          <p className="text-gray-500 text-xs mb-2 ml-1">
            {formatDate(trip.review.createdAt.date)}
          </p>
          <StarRating rating={trip.review.rating} />
          <p className="text-gray-600 mt-2 ml-1">{trip.review.comment}</p>
          <div className="flex gap-2 absolute top-2 right-2">
            <a
              className="bg-blue-100 text-white p-1 rounded hover:bg-blue-200 text-center w-6"
              href={`/review/${trip.property.id}/${trip.review.id}/edit`}
            >
              <svg
                viewBox="0 0 24 24"
                id="edit"
                class="icon glyph"
                fill="#3b82f6"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M20.71,3.29a2.91,2.91,0,0,0-2.2-.84,3.25,3.25,0,0,0-2.17,1L7.46,12.29s0,0,0,0a.62.62,0,0,0-.11.17,1,1,0,0,0-.1.18l0,0L6,16.72A1,1,0,0,0,7,18a.9.9,0,0,0,.28,0l4-1.17,0,0,.18-.1a.62.62,0,0,0,.17-.11l0,0,8.87-8.88a3.25,3.25,0,0,0,1-2.17A2.91,2.91,0,0,0,20.71,3.29Z"></path>
                  <path
                    d="M21,22H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"
                    fill="#3b82f6"
                  ></path>
                </g>
              </svg>
            </a>
            <a
              className="bg-red-100 text-white p-1 rounded hover:bg-red-200 text-center w-6"
              href={`/review/${trip.review.id}/delete`}
            >
              <svg
                fill="#ef4444"
                viewBox="0 0 24 24"
                id="delete-alt"
                class="icon glyph"
                stroke="#ef4444"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M17,4V5H15V4H9V5H7V4A2,2,0,0,1,9,2h6A2,2,0,0,1,17,4Z"></path>
                  <path d="M20,6H4A1,1,0,0,0,4,8H5V20a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V8h1a1,1,0,0,0,0-2ZM11,17a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Zm4,0a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Z"></path>
                </g>
              </svg>{" "}
            </a>
          </div>
        </div>
      )}
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

export default TripCard;
