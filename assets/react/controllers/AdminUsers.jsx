import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, CircleCheckBig } from "lucide-react";
import Layout from "../components/Layout";
import Toast from "../components/UI/Toast";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch amenities");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users?.filter(
    (user) =>
      (user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !user.roles.includes("ROLE_ADMIN")
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(data.message);
        setUsers(users.filter((user) => user.id !== id));
      } else {
        setShowToast(true);
        setToastType("error");
        setToastMessage(data.error);
      }
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin h-8 w-8 border-4 border-rose-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <a href="/admin" className="text-rose-500 underline">
            Go back to dashboard
          </a>

          <div className="flex justify-between items-center mb-6 mt-8">
            <h1 className="text-3xl font-medium">Users Management</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-96 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Host
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.roles.includes("ROLE_HOST") && (
                            <CircleCheckBig className="w-6 h-6 text-rose-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {formatDate(new Date(user.createdAt))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 hover:bg-gray-100 rounded-md text-red-600"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
    </Layout>
  );
};

export default UsersAdmin;
