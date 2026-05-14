import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const userStr = sessionStorage.getItem("user");
  let isAdmin = false;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      isAdmin = user.role === "admin";
    } catch (e) {
      console.error("Failed to parse user from sessionStorage", e);
    }
  }

  if (!token || !isAdmin) {
    // Redirect to home if not logged in or not an admin
    return <Navigate to="/" replace />;
  }

  return children;
}
