import React, { useEffect, useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import Layout from "../components/Layout";
import Toast from "../components/UI/Toast";

const PropertiesAdmin = () => {
  const [properties, setProperties] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/property/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(data.message);
        setProperties(properties.filter((property) => property.id !== id));
      } else {
        setShowToast(true);
        setToastType("error");
        setToastMessage(data.error);
      }
    } catch (error) {
      setError("Failed to delete property");
    }
  };

  const filteredProperties = properties?.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-3xl font-medium">Properties Management</h1>
            <a
              href="/become-a-host"
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-96 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                  {filteredProperties?.map((property) => (
                    <>
                      <tr key={property.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {property.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {property.address.streetName}, {property.address.city}{" "}
                          {property.address.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {property.price}$
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {property.propertyType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {formatDate(new Date(property.createdAt))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 hover:bg-gray-100 rounded-md text-red-600"
                              onClick={() => handleDelete(property.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
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

export default PropertiesAdmin;
