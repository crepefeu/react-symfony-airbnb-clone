import React from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const breadcrumbs = [{ label: "Profile" }];
  const { user } = useAuth();

  return (
    <Layout breadcrumbs={breadcrumbs} needAuthentication={true}>
      {user ? (
        <h1>
          {user.firstName} {user.lastName}
        </h1>
      ) : (
        <div className="h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      )}
    </Layout>
  );
};

export default Profile;
