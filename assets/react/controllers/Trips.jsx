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
        <div>
          <h2 className="text-xl font-semibold">Trips</h2>
          {upcomingTrips.length > 0 ? (
            <TripsList trips={upcomingTrips} />
          ) : (
            <div className="border-0 border-gray-300 rounded-lg px-5 py-3 flex flex-col items-center gap-2">
              <svg
                height="200px"
                width="200px"
                version="1.1"
                id="Layer_1"
                viewBox="0 0 512 512"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g transform="translate(1 1)">
                    {" "}
                    <g>
                      {" "}
                      <polygon
                        style="fill:#fda4af;"
                        points="50.2,122.733 118.467,122.733 118.467,97.133 50.2,97.133 "
                      ></polygon>{" "}
                      <polygon
                        style="fill:#fda4af;"
                        points="391.533,122.733 459.8,122.733 459.8,97.133 391.533,97.133 "
                      ></polygon>{" "}
                    </g>{" "}
                    <path
                      style="fill:#FFFFFF;"
                      d="M212.333,464.067H24.6c-9.387,0-17.067-7.68-17.067-17.067V139.8c0-9.387,7.68-17.067,17.067-17.067 h187.733c9.387,0,17.067,7.68,17.067,17.067V447C229.4,456.387,221.72,464.067,212.333,464.067"
                    ></path>{" "}
                    <path
                      style="fill:#fda4af;"
                      d="M485.4,464.067H297.667c-9.387,0-17.067-7.68-17.067-17.067V139.8 c0-9.387,7.68-17.067,17.067-17.067H485.4c9.387,0,17.067,7.68,17.067,17.067V447C502.467,456.387,494.787,464.067,485.4,464.067"
                    ></path>{" "}
                    <path
                      style="fill:#ffe4e6;"
                      d="M459.8,464.067H50.2c-9.387,0-17.067-7.68-17.067-17.067V139.8c0-9.387,7.68-17.067,17.067-17.067 h409.6c9.387,0,17.067,7.68,17.067,17.067V447C476.867,456.387,469.187,464.067,459.8,464.067"
                    ></path>{" "}
                    <g>
                      {" "}
                      <path
                        style="fill:#f43f5e;"
                        d="M485.4,472.6H24.6C10.093,472.6-1,460.653-1,447V139.8c0-14.507,11.947-25.6,25.6-25.6h460.8 c14.507,0,25.6,11.947,25.6,25.6V447C511,460.653,499.053,472.6,485.4,472.6z M24.6,131.267c-5.12,0-8.533,4.267-8.533,8.533V447 c0,5.12,4.267,8.533,8.533,8.533h460.8c5.12,0,8.533-4.267,8.533-8.533V139.8c0-5.12-4.267-8.533-8.533-8.533H24.6z"
                      ></path>{" "}
                      <path
                        style="fill:#f43f5e;"
                        d="M340.333,131.267H169.667c-5.12,0-8.533-3.413-8.533-8.533V64.707 c0-15.36,11.947-27.307,27.307-27.307h133.12c15.36,0,27.307,11.947,27.307,27.307v58.027 C348.867,127.853,345.453,131.267,340.333,131.267z M178.2,114.2h153.6V64.707c0-5.973-4.267-10.24-10.24-10.24H188.44 c-5.973,0-10.24,4.267-10.24,10.24V114.2z"
                      ></path>{" "}
                      <path
                        style="fill:#f43f5e;"
                        d="M75.8,472.6c-5.12,0-8.533-3.413-8.533-8.533V122.733c0-5.12,3.413-8.533,8.533-8.533 c5.12,0,8.533,3.413,8.533,8.533v341.333C84.333,469.187,80.92,472.6,75.8,472.6z"
                      ></path>{" "}
                      <path
                        style="fill:#f43f5e;"
                        d="M434.2,472.6c-5.12,0-8.533-3.413-8.533-8.533V122.733c0-5.12,3.413-8.533,8.533-8.533 c5.12,0,8.533,3.413,8.533,8.533v341.333C442.733,469.187,439.32,472.6,434.2,472.6z"
                      ></path>{" "}
                      <path
                        style="fill:#f43f5e;"
                        d="M118.467,131.267H50.2c-5.12,0-8.533-3.413-8.533-8.533v-25.6c0-5.12,3.413-8.533,8.533-8.533 h68.267c5.12,0,8.533,3.413,8.533,8.533v25.6C127,127.853,123.587,131.267,118.467,131.267z M58.733,114.2h51.2v-8.533h-51.2 V114.2z"
                      ></path>{" "}
                      <path
                        style="fill:#f43f5e;"
                        d="M459.8,131.267h-68.267c-5.12,0-8.533-3.413-8.533-8.533v-25.6c0-5.12,3.413-8.533,8.533-8.533 H459.8c5.12,0,8.533,3.413,8.533,8.533v25.6C468.333,127.853,464.92,131.267,459.8,131.267z M400.067,114.2h51.2v-8.533h-51.2 V114.2z"
                      ></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <span className="text-gray-800">
                No trip booked for the moment
              </span>
              <span className="text-sm text-gray-500">
                Pack your bags and embark on a new adventure
              </span>
              <a href="/" className="bg-rose-500 text-white px-2 py-1 rounded">
                Search
              </a>
            </div>
          )}
        </div>
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
