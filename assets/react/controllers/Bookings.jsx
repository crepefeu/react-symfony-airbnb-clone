import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import TripsList from "../components/Booking/TripsList";
import BookingsList from "../components/Booking/BookingsList";

const Bookings = () => {
  const breadcrumbs = [{ label: "Manage bookings" }];
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingsToValidate, setBookingsToValidate] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings/manage", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookingsToValidate(getBookingsToValidate(data.bookings));
        setUpcomingBookings(getUpcomingBookings(data.bookings));
        setPastBookings(getPastBookings(data.bookings));
        console.log(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const sortBookings = (bookings) => {
    return bookings.sort(
      (a, b) => new Date(b.checkInDate.date) - new Date(a.checkInDate.date)
    );
  };

  const getBookingsToValidate = (bookings) => {
    return sortBookings(
      bookings.filter((booking) => booking.status == "pending")
    );
  };

  const getUpcomingBookings = (bookings) => {
    return sortBookings(
      bookings.filter(
        (booking) =>
          booking.status != "pending" &&
          new Date(booking.checkOutDate.date) >= new Date()
      )
    );
  };

  const getPastBookings = (bookings) => {
    return sortBookings(
      bookings.filter(
        (booking) =>
          booking.status != "pending" &&
          new Date(booking.checkInDate.date) < new Date()
      )
    );
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {isLoading && (
        <div className="flex justify-center items-center py-12 min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      {!isLoading && (
        <div className="px-4 py-6 m-auto flex flex-col gap-3 max-w-7xl">
          <h2 className="text-lg font-semibold text-gray-900">
            Booking to validate
          </h2>
          <BookingsList bookings={bookingsToValidate} />
          <h2 className="text-lg font-semibold text-gray-900 mt-8">
            Upcoming booking
          </h2>
          <BookingsList bookings={upcomingBookings} />
          <h2 className="text-lg font-semibold text-gray-900 mt-8">
            Past booking
          </h2>
          <BookingsList bookings={pastBookings} />
        </div>
      )}
    </Layout>
  );
};

export default Bookings;
