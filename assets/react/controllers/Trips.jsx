import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NoTrips from "../components/Booking/NoTrips";
import TripsSection from "../components/Booking/TripsSection";

const Trips = () => {
  const breadcrumbs = [{ label: "Trips" }];
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
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
        const { upcomingTrips, pastTrips } = splitTrips(data.trips);
        setUpcomingTrips(upcomingTrips);
        setPastTrips(pastTrips);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const splitTrips = (trips) => {
    const currentDate = new Date();
    const upcomingTrips = trips.filter(
      (trip) => new Date(trip.checkOutDate.date) >= currentDate
    );
    const pastTrips = trips.filter(
      (trip) => new Date(trip.checkOutDate.date) < currentDate
    );
    return { upcomingTrips, pastTrips };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hasNoTrips = upcomingTrips.length === 0 && pastTrips.length === 0;

  return (
    <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
      <div className="px-4 py-6 m-auto flex flex-col gap-3 max-w-7xl">
        {hasNoTrips ? (
          <NoTrips />
        ) : (
          <>
            <TripsSection title="Upcoming Trips" trips={upcomingTrips} />
            {upcomingTrips.length > 0 && pastTrips.length > 0 && <hr className="mb-3" />}
            <TripsSection title="Past Trips" trips={pastTrips} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Trips;
