import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Layout from "../components/Layout";
import Toast from "../components/UI/Toast";
import Modal from "../components/Modal";

const AmenitiesAdmin = () => {
  const [amenities, setAmenities] = useState([]);
  const [amenityCategories, setAmenityCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch("/api/amenities", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch amenities");
        }
        const data = await response.json();
        setAmenities(data.amenities);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        setError("Failed to load amenities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  useEffect(() => {
    const fetchAmenityCategories = async () => {
      try {
        const response = await fetch("/api/amenities/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch amenity categories");
        }
        const data = await response.json();
        console.log(data);
        setAmenityCategories(data.categories);
      } catch (error) {
        console.error("Error fetching amenities:", error);
        setError("Failed to load amenities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenityCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/amenities/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setShowModal(false);
      setToastType("success");
      setToastMessage(data.message);
      setShowToast(true);
    } else {
      setToastType("error");
      setToastMessage(data.error);
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/amenity/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setShowToast(true);
        setToastType("success");
        setToastMessage(data.message);
        setAmenities(amenities.filter((amenity) => amenity.id !== id));
      } else {
        setShowToast(true);
        setToastType("error");
        setToastMessage(data.error);
      }
    } catch (error) {
      setError("Failed to delete amenity");
    }
  };

  const filteredAmenities = amenities?.filter(
    (amenity) =>
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amenity.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-medium">Amenities Management</h1>
            <button
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search amenities..."
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAmenities?.map((amenity) => (
                    <tr key={amenity.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {amenity.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <span className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html:
                                amenity.categoryIcon ||
                                amenity.category?.icon ||
                                '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
                            }}
                          />
                          {amenity.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded-md">
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded-md text-red-600"
                            onClick={() => handleDelete(amenity.id)}
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
      {showModal && (
        <Modal onClose={() => setShowModal(false)} isOpen={showModal}>
          <div title="Add amenity">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amenity Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter amenity name"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select a category</option>
                  {amenityCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5"
                          dangerouslySetInnerHTML={{ __html: category.icon }}
                        />
                        {category.value}
                      </div>
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Create Amenity
                </button>
              </div>
            </form>{" "}
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default AmenitiesAdmin;
