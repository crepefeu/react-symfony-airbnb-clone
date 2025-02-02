import React, { useEffect, useState } from "react";

const StatusBadge = ({ status, absolute }) => {
  const [label, setLabel] = useState("Undefined");
  const [bgColor, setBgColor] = useState("bg-gray-200");
  const [textColor, setTextColor] = useState("text-gray-800");
  const [shadowColor, setShadowColor] = useState("shadow-gray-800");
  const [position, setPosition] = useState("relative");

  const statusStyle = {
    pending: {
      label: "Pending",
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-800",
      shadowColor: "shadow-yellow-800",
    },
    validated: {
      label: "Validated",
      bgColor: "bg-green-200",
      textColor: "text-green-800",
      shadowColor: "shadow-green-800",
    },
    ongoing: {
      label: "Ongoing",
      bgColor: "bg-blue-200",
      textColor: "text-blue-800",
      shadowColor: "shadow-blue-800",
    },
    finished: {
      label: "Finished",
      bgColor: "bg-gray-200",
      textColor: "text-gray-800",
      shadowColor: "shadow-gray-800",
    },
    missed: {
      label: "Missed",
      bgColor: "bg-red-200",
      textColor: "text-red-800",
      shadowColor: "shadow-red-800",
    },
    canceled: {
      label: "Canceled",
      bgColor: "bg-red-200",
      textColor: "text-red-800",
      shadowColor: "shadow-red-800",
    },
  };

  useEffect(() => {
    setLabel(statusStyle[status].label);
    setBgColor(statusStyle[status].bgColor);
    setTextColor(statusStyle[status].textColor);
    setShadowColor(statusStyle[status].shadowColor);
    if (absolute) {
      setPosition("absolute top-2 right-2");
    }
  }, [status]);

  return (
    <span
      className={`px-3 py-1 rounded ${bgColor} ${textColor} text-sm h-fit font-semibold shadow-sm ${shadowColor} ${position}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
