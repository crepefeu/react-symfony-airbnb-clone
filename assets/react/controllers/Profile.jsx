import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import useAuth from "../hooks/useAuth";
import LogInModal from "../components/LogInModal";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const breadcrumbs = [{ label: "Profile" }];
  const { user, token, fetchUser } = useAuth();
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleProfilePictureUpdate = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Upload failed');
      await fetchUser();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) throw new Error('Update failed');
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!token) {
    return (
      <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
        <div className="text-center py-8">
          <p className="mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => setIsLogInModalOpen(true)}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
          >
            Log in
          </button>
          <LogInModal
            isOpen={isLogInModalOpen}
            onClose={() => setIsLogInModalOpen(false)}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
      {user ? (
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-8">
            <ProfileSidebar user={user} onUpdatePhoto={handleProfilePictureUpdate} />
            <ProfileContent 
              user={user} 
              isOwner={true} 
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        </div>
      ) : (
        <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      )}
    </Layout>
  );
};

export default Profile;
