import React, { useState, useEffect } from "react";

const ProfileContent = ({ user, isOwner, isEditing, setIsEditing, onUpdateProfile }) => {
  const [editForm, setEditForm] = useState({
    bio: user?.bio || "",
  });

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(editForm);
  };

  const renderPropertyCard = (property) => (
    <a
      key={property.id}
      href={`/property/${property.id}`}
      className="block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative aspect-[4/3]">
        <img
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-lg text-sm">
          ${property.price}/night
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{property.title}</h3>
        <p className="text-gray-600 text-sm">
          {property.bedrooms} beds · {property.bathrooms} baths
        </p>
        {property.averageRating && (
          <div className="flex items-center mt-2">
            <span className="text-sm">
              ★ {property.averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </a>
  );

  const renderAboutSection = () => {
    if (isEditing) {
      return (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">About</h2>
            <div className="space-x-4">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-600 underline font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
              >
                Save
              </button>
            </div>
          </div>
          <textarea
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            className="w-full p-3 border rounded-lg min-h-[150px]"
            placeholder="Tell others about yourself..."
          />
        </form>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">About</h2>
          {isOwner && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-black underline font-medium"
            >
              Edit
            </button>
          )}
        </div>
        <p className="text-gray-600 whitespace-pre-line">
          {user?.bio || "Tell others about yourself..."}
        </p>
      </div>
    );
  };

  return (
    <div className="md:w-2/3">
      <h1 className="text-3xl font-semibold mb-1">
        {isOwner ? `Hi, I'm ${user?.firstName}` : `${user?.firstName}'s Profile`}
      </h1>
      <p className="text-gray-500 mb-6">
        Joined in {new Date(user?.createdAt).getFullYear()}
      </p>

      <div className="space-y-8">
        <section>
          {renderAboutSection()}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl mb-4">
            {isOwner ? "Your listings" : `${user?.firstName}'s listings`}
          </h2>
          {user?.properties?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user.properties.map(renderPropertyCard)}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <h3 className="font-medium mb-2">
                {isOwner ? "You haven't hosted any places yet" : "No places hosted yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {isOwner ? "Ready to start your hosting journey?" : "Start your hosting journey"}
              </p>
              <a 
                href="/property-drafts/become-a-host" // Updated URL
                className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
              >
                Become a Host
              </a>
            </div>
          )}
        </section>

        {isOwner && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl">Property Drafts</h2>
              <a 
                href="/property-drafts"
                className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
              >
                View all drafts
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            </div>
            {user.propertyDrafts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.propertyDrafts.slice(0, 2).map((draft) => (
                  // Show only the first 2 drafts in profile
                  <a 
                    key={draft.id}
                    href={`/property-drafts/become-a-host/${draft.id}`} // Updated URL
                    className="block p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                  >
                    <h3 className="font-medium mb-1">
                      {draft.data.title || 'Untitled Property'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Step {draft.currentStep} of 8
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No drafts yet</p>
            )}
          </section>
        )}

        <section>
          <h2 className="text-2xl mb-4">
            {isOwner ? "Your reviews" : `${user?.firstName}'s reviews`}
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="font-medium">
              {isOwner ? "You have no reviews yet" : "No reviews yet"}
            </h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileContent;
