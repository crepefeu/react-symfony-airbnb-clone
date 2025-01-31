import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const Bookings = () => {
  const breadcrumbs = [{ label: "Trips" }];
  const { token } = useAuth();
  const [bookings, setBookings] = useState();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/bookings/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.bookings);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      }
    };

    fetchBookings();
  }, []);

  return <Layout breadcrumbs={breadcrumbs}></Layout>;
};

export default Bookings;
