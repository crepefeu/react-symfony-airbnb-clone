import React, { useEffect, useState } from "react";

const StatusBadge = ({ status }) => {
  const statusStyle = {
    pending: {
      label: "Pending",
      color: "yellow",
    },
    validated: {
      label: "Validated",
      color: "green",
    },
    ongoing: {
      label: "Ongoing",
      color: "blue",
    },
    finished: {
      label: "Finished",
      color: "gray",
    },
    missed: {
      label: "Missed",
      color: "red",
    },
    canceled: {
      label: "Canceled",
      color: "red",
    },
  };

  const [label, setLabel] = useState("Pending");
  const [color, setColor] = useState("yellow");

  useEffect(() => {
    setLabel(statusStyle[status].label);
    setColor(statusStyle[status].color);
  }, [status]);

  return (
    <span
      className={`px-3 py-1 rounded bg-${color}-200 text-${color}-800 text-sm font-semibold absolute top-2 right-2 shadow-sm shadow-${color}-800`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
