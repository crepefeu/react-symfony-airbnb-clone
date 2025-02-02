import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import BookingsSection from "../components/Booking/BookingsSection";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NoBookings from "../components/Booking/NoBookings";

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

  const noBookings =
    bookingsToValidate.length < 1 &&
    upcomingBookings.length < 1 &&
    pastBookings.length < 1;

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {isLoading ? (
        <LoadingSpinner />
      ) : noBookings ? (
        <NoBookings />
      ) : (
        <div className="px-4 py-6 m-auto flex flex-col gap-3 max-w-7xl">
          <BookingsSection
            title="Booking to validate"
            bookings={bookingsToValidate}
          />
          <BookingsSection
            title="Upcoming booking"
            bookings={upcomingBookings}
          />
          <BookingsSection title="Past bookings" bookings={pastBookings} />
        </div>
      )}
    </Layout>
  );
};

export default Bookings;
