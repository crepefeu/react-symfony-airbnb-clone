import React from 'react';

const ProfileContent = ({ user }) => {
  return (
    <div className="md:w-2/3">
      <h1 className="text-3xl font-semibold mb-1">Hi, I'm {user?.firstName}</h1>
      <p className="text-gray-500 mb-6">Joined in {new Date(user?.createdAt).getFullYear()}</p>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">About</h2>
            <button className="text-black underline font-medium">Edit</button>
          </div>
          <p className="text-gray-600 whitespace-pre-line">
            {user?.bio || "Tell others about yourself..."}
          </p>
        </section>

        <section>
          <h2 className="text-2xl mb-4">{user?.firstName}'s listings</h2>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="font-medium mb-2">No places hosted yet</h3>
            <p className="text-gray-500 mb-6">Start your hosting journey</p>
            <button className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700">
              Become a Host
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl mb-4">{user?.firstName}'s reviews</h2>
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="font-medium">No reviews yet</h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileContent;
