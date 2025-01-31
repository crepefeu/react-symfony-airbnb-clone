import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import TripsList from "../components/Booking/TripsList";

const Trips = () => {
  const breadcrumbs = [{ label: "Trips" }];
  const { token } = useAuth();
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
    return (
      <div className="flex justify-center items-center py-12 min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="px-4 py-6 m-auto flex flex-col gap-3 max-w-7xl">
        {upcomingTrips.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Upcoming Trip</h2>
            <TripsList trips={upcomingTrips}></TripsList>
          </div>
        )}
        {upcomingTrips.length > 0 && pastTrips.length > 0 && (
          <hr className="mb-3" />
        )}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Past Trip</h2>
            <TripsList trips={pastTrips}></TripsList>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trips;
