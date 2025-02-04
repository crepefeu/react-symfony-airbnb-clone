import React from "react";
import PropTypes from "prop-types";
import SendMessageButton from './chat/SendMessageButton';

const HostInfo = ({ host, propertiesCount }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString.replace(" ", "T"));
    return `Joined in ${date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    })}`;
  };

  return (
    <div className="border-b pb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xl text-gray-600">
              {host.firstName.charAt(0)}
              {host.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Hosted by {host.firstName}</h3>
            <p className="text-gray-500">{formatDate(host.createdAt)}</p>
            <div className="flex gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-2">
                <i className="fas fa-star text-yellow-400"></i>
                {host.averageRating
                  ? `${host.averageRating.toFixed(1)} rating`
                  : "New host"}
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-home"></i>
                {propertiesCount}{" "}
                {propertiesCount === 1 ? "property" : "properties"}
              </span>
            </div>
          </div>
        </div>
        <SendMessageButton 
          recipientId={host.id}
          recipientName={`${host.firstName} ${host.lastName}`}
        />
      </div>
    </div>
  );
};

HostInfo.propTypes = {
  host: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    createdAt: PropTypes.string, // Changed from formattedCreatedAt back to createdAt
    averageRating: PropTypes.number,
  }).isRequired,
  propertiesCount: PropTypes.number.isRequired,
};

export default HostInfo;
