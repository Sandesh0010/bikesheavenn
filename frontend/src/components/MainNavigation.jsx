import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

export default function MainNavigation() {
  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <main className="pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
