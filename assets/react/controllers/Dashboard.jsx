import React, { useEffect, useState } from "react";
import {
  BookMarked,
  House,
  MessageCircleHeart,
  UsersRound,
  WashingMachine,
} from "lucide-react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import Unauthorized from "../controllers/Unauthorized";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUser, user, token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  useEffect(() => {
    setIsLoading(true);
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch properties trend");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  if (!token || (user && !user.roles.includes("ROLE_ADMIN"))) {
    return <Unauthorized></Unauthorized>;
  }

  const StatCard = ({
    children,
    title,
    total,
    value,
    icon: Icon,
    trend,
    link,
  }) => (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mt-1 mb-3">
              {total} {title}
            </h3>
            {value !== null && (
              <span className="text-gray-600 text-sm mt-1">
                {value} added this last 30 days
              </span>
            )}
            {trend !== null && (
              <p
                className={`mt-1 ${
                  trend > 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {trend > 0 ? "+" : ""}
                {trend.toFixed(2)}% from last 30 days
              </p>
            )}
            {children}
            {link && (
              <a
                href={link.href}
                className="text-rose-500 underline text-sm mt-3 mx-auto block"
              >
                {link.label}
              </a>
            )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats && (
              <>
                <StatCard
                  title="Users"
                  total={stats.users.total}
                  value={stats.users.current}
                  icon={UsersRound}
                  trend={stats.users.trend}
                  link={{
                    label: "Manage users",
                    href: "/admin/users",
                  }}
                />
                <StatCard
                  title="Reviews"
                  total={stats.reviews.total}
                  value={stats.reviews.current}
                  icon={MessageCircleHeart}
                  trend={stats.reviews.trend}
                >
                  <p className={`mt-1 text-gray-700`}>
                    Average rating : {stats.reviews.avgRating.toFixed(2)}
                  </p>
                </StatCard>
                <StatCard
                  title="Properties"
                  total={stats.properties.total}
                  value={stats.properties.current}
                  icon={House}
                  trend={stats.properties.trend}
                  link={{
                    label: "Manage properties",
                    href: "/admin/properties",
                  }}
                />
                <StatCard
                  title="Bookings"
                  total={stats.bookings.total}
                  value={stats.bookings.current}
                  icon={BookMarked}
                  trend={stats.bookings.trend}
                />
                <StatCard
                  title="Amenities"
                  total={stats.amenities.total}
                  value={null}
                  icon={WashingMachine}
                  trend={null}
                  link={{
                    label: "Manage amenities",
                    href: "/admin/amenities",
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
