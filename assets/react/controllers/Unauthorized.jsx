import React from "react";
import Layout from "../components/Layout";
import Unauthorized from "../components/Unauthorized";

const UnauthorizedController = () => {
  return (
    <Layout>
      <Unauthorized />;
    </Layout>
  );
};

export default UnauthorizedController;
