import React, { useState, useRef, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import useAuth from "../../hooks/useAuth";
import Toast from "../UI/Toast";

const TripCard = ({ trip }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="flex flex-col group">
      <div className="relative">
        <a
          href={`/property/${trip.property.id}`}
          className="block bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          <div className="relative">
            <img
              src={trip.property.image}
              alt={trip.property.title}
              className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <StatusBadge status={trip.status} absolute={true} />
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg line-clamp-1">{trip.property.title}</h3>
              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full"
                  src={trip.property.owner.profilePicture}
                  alt=""
                />
              </div>
            </div>

            <div className="space-y-1 text-gray-600">
              <p>
                {formatDate(trip.checkInDate.date)} - {formatDate(trip.checkOutDate.date)}
              </p>
              <p className="text-sm">
                {trip.numberOfGuests} {trip.numberOfGuests === 1 ? 'guest' : 'guests'}
              </p>
            </div>
          </div>
        </a>

        {/* Three dots menu button */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                {trip.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      cancelBooking();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Cancel reservation
                  </button>
                )}
                <a
                  href={`/property/${trip.property.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  View property
                </a>
                {/* Add more menu items here */}
              </div>
            </div>
          )}
        </div>
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

export default TripCard;
