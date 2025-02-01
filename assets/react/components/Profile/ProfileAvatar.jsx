import React, { useState } from 'react';

const ProfileAvatar = ({ user, className = "" }) => {
  const [imageError, setImageError] = useState(false);

  const InitialsPlaceholder = () => (
    <div className={`flex items-center justify-center bg-gray-100 rounded-full border-4 border-white shadow-lg ${className}`}>
      <span className="text-4xl text-gray-500">
        {user?.firstName?.[0]}
        {user?.lastName?.[0]}
      </span>
    </div>
  );

  if (!user?.profilePicture || imageError) {
    return <InitialsPlaceholder />;
  }

  return (
    <div className={className}>
      <img
        src={user.profilePicture}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ProfileAvatar;
