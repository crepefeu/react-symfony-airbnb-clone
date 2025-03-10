import React from "react";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";

const Layout = ({ children, breadcrumbs }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header breadcrumbs={breadcrumbs} />
      <div>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
