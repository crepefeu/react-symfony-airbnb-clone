import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import useAuth from "../hooks/useAuth";

const WishlistModal = ({ isOpen, onClose, propertyId }) => {
  const [wishlists, setWishlists] = useState([]);
  const [newWishlistName, setNewWishlistName] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchWishlists();
    }
  }, [isOpen]);

  const fetchWishlists = async () => {
    try {
      const response = await fetch("/api/wishlists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      setWishlists(data.wishlists);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    }
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/wishlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ name: newWishlistName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create wishlist");
      }

      const data = await response.json();
      setWishlists([...wishlists, data.wishlist]);
      setNewWishlistName("");
    } catch (error) {
      console.error("Error creating wishlist:", error);
      // Optionally add error state handling here
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (wishlistId) => {
    try {
      const response = await fetch(`/api/wishlists/${wishlistId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ propertyId }),
      });

      if (response.status === 409) {
        alert('This property is already in your wishlist');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }

      onClose();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Save to Wishlist"
    >
      <div className="space-y-4">
        <form onSubmit={handleCreateWishlist} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newWishlistName}
              onChange={(e) => setNewWishlistName(e.target.value)}
              placeholder="Create new wishlist"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
            />
            <button
              type="submit"
              disabled={!newWishlistName || loading}
              className="bg-rose-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {wishlists.map((wishlist) => (
            <button
              key={wishlist.id}
              onClick={() => handleAddToWishlist(wishlist.id)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition flex justify-between items-center"
            >
              <span>{wishlist.name}</span>
              <span className="text-sm text-gray-500">
                {wishlist.wishlistItems.length} items
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default WishlistModal;
