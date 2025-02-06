import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NoTrips from "../components/Booking/NoTrips";
import TripsSection from "../components/Booking/TripsSection";
import Unauthorized from "../controllers/Unauthorized";
import useAuth from "../hooks/useAuth";

const Trips = () => {
  const breadcrumbs = [{ label: "Trips" }];
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [canceledTrips, setCanceledTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUser, user, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

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
        const { upcomingTrips, pastTrips, canceledTrips } = splitTrips(
          data.trips
        );
        setUpcomingTrips(upcomingTrips);
        setPastTrips(pastTrips);
        setCanceledTrips(canceledTrips);
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
    const upcoming = trips.filter(
      (trip) =>
        new Date(trip.checkOutDate.date) >= currentDate &&
        trip.status !== "canceled"
    );
    const past = trips.filter(
      (trip) =>
        new Date(trip.checkOutDate.date) < currentDate &&
        trip.status !== "canceled"
    );
    const canceled = trips.filter((trip) => trip.status === "canceled");
    return {
      upcomingTrips: upcoming,
      pastTrips: past,
      canceledTrips: canceled,
    };
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!token || !user) {
    return <Unauthorized></Unauthorized>;
  }

  const hasNoTrips =
    upcomingTrips.length === 0 &&
    pastTrips.length === 0 &&
    canceledTrips.length === 0;

  return (
    <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
      <div className="px-4 py-6 m-auto flex flex-col gap-8 max-w-7xl">
        <h1 className="text-3xl font-semibold">Your trips</h1>
        {hasNoTrips ? (
          <NoTrips />
        ) : (
          <div className="space-y-12">
            {upcomingTrips.length > 0 && (
              <TripsSection title="Upcoming" trips={upcomingTrips} />
            )}
            {pastTrips.length > 0 && (
              <TripsSection title="Where you've been" trips={pastTrips} />
            )}
            {canceledTrips.length > 0 && (
              <TripsSection title="Canceled" trips={canceledTrips} />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trips;
