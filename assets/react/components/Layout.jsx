import React, { useState } from "react";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import useAuth from "../hooks/useAuth";
import Unauthorized from "./Unauthorized";

const Layout = ({ children, breadcrumbs, needAuthentication }) => {
  const { authentication, isAuthenticated } = useAuth();
  if (needAuthentication) {
    authentication();
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header breadcrumbs={breadcrumbs} />
      {needAuthentication && !isAuthenticated ? (
        <Unauthorized />
      ) : (
        <div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <main className="flex-1">{children}</main>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Layout;
