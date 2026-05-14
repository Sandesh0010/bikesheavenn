import React from "react";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function AdminLayout({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
