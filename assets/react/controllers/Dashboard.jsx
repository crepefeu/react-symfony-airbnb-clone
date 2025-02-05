import React, { useEffect, useState } from "react";
import { Building, WashingMachine } from "lucide-react";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [propertiesStats, setPropertiesStats] = useState(null);
  const [amenitiesStats, setAmenitiesStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchPropertiesStats = async () => {
      try {
        const response = await fetch("/api/admin/property/trend", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch properties trend");
        }
        const data = await response.json();
        setPropertiesStats({
          total: data.total,
          current: data.trend.current,
          trend: data.trend.trend,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertiesStats();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchAmenities = async () => {
      try {
        const response = await fetch("/api/amenities", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch amenities");
        }
        const data = await response.json();
        setAmenitiesStats({ total: data.amenities.length });
        console.log("amenities", data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  const StatCard = ({ title, total, value, icon: Icon, trend, link }) => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mt-1 mb-3">
              {total} {title}
            </h3>
            {value && (
              <span className="text-gray-600 text-sm mt-1">
                {value} added this last 30 days
              </span>
            )}
            {trend && (
              <p
                className={`text-sm mt-1 ${
                  trend > 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend}% from last 30 days
              </p>
            )}
            <a
              href={link.href}
              className="text-rose-500 underline text-sm mt-3 mx-auto block"
            >
              {link.label}
            </a>
          </div>
          <div className="p-4 bg-rose-100 rounded-full">
            <Icon className="w-6 h-6 text-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-medium mb-8">Dashboard Overview</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {propertiesStats && (
              <StatCard
                title="Properties"
                total={propertiesStats.total}
                value={propertiesStats.current}
                icon={Building}
                trend={propertiesStats.trend}
                link={{
                  label: "See all properties",
                  href: "/admin/properties",
                }}
              />
            )}
            {amenitiesStats && (
              <StatCard
                title="Amenities"
                total={amenitiesStats.total}
                icon={WashingMachine}
                link={{
                  label: "See all amenities",
                  href: "/admin/amenities",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
