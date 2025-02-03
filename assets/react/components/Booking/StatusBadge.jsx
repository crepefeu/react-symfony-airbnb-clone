import React from "react";

const StatusBadge = ({ status, absolute = false }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-700";
      case "validated":
        return "bg-green-100 text-green-800 border border-green-700";
      case "canceled":
        return "bg-red-100 text-red-800 border border-red-700";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`
        ${absolute ? "absolute top-3 left-3" : ""}
        ${getStatusStyles()}
        px-3 py-1 rounded-full text-sm font-medium capitalize
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
