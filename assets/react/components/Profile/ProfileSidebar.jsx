import React from 'react';
import ProfileAvatar from './ProfileAvatar';

const ProfileSidebar = ({ user, onUpdatePhoto }) => {
  return (
    <div className="md:w-1/3">
      <div className="sticky top-20">
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto relative group">
            <ProfileAvatar user={user} className="w-full h-full" />
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              accept="image/*"
              onChange={onUpdatePhoto}
            />
            <button 
              onClick={() => document.getElementById('profilePicture').click()}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-sm">Update photo</span>
            </button>
          </div>
          <div className="text-center mt-4">
            <button 
              className="text-black underline font-medium text-sm"
              onClick={() => document.getElementById('profilePicture').click()}
            >
              Update photo
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="font-semibold text-xl mb-4">{user?.firstName} confirmed</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm0 22a10 10 0 110-20 10 10 0 010 20zm5-11l-6 6-3-3 1.5-1.5L11 14l4.5-4.5L17 11z"/>
              </svg>
              <span>Email address</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm0 22a10 10 0 110-20 10 10 0 010 20zm5-11l-6 6-3-3 1.5-1.5L11 14l4.5-4.5L17 11z"/>
              </svg>
              <span>Phone number</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
