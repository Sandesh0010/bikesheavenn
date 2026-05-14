import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import ConfirmDialog from "./ConfirmDialog";

export default function AdminNavbar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.email || user.username || user.name || "Admin User");
      } catch {
        setUserName("Admin User");
      }
    } else {
      setUserName("Admin User");
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setShowDropdown(false);
    setShowLogoutConfirm(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="text-white font-bold text-xl tracking-wider">
              BIKESHEAVEN <span className="text-blue-400 text-sm font-normal ml-2">ADMIN</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors !bg-transparent !shadow-none !outline-none !border-none ${
                  activeTab === "users"
                    ? "!text-blue-400"
                    : "!text-gray-300 hover:!text-white"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("blogs")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors !bg-transparent !shadow-none !outline-none !border-none ${
                  activeTab === "blogs"
                    ? "!text-blue-400"
                    : "!text-gray-300 hover:!text-white"
                }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setActiveTab("listings")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors !bg-transparent !shadow-none !outline-none !border-none ${
                  activeTab === "listings"
                    ? "!text-blue-400"
                    : "!text-gray-300 hover:!text-white"
                }`}
              >
                Marketplace
              </button>
            </div>
          </div>
          <div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center p-2 rounded-full !bg-transparent hover:!bg-gray-800 transition-colors focus:outline-none !shadow-none"
              >
                <FaUserCircle className="w-8 h-8 text-gray-300 hover:text-white" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="block w-full text-left px-4 py-2 text-sm !text-red-600 hover:!bg-gray-100 transition-colors font-medium !bg-transparent !shadow-none"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-800">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-around">
          <button
            onClick={() => setActiveTab("users")}
            className={`block px-3 py-2 rounded-md text-base font-medium !bg-transparent !shadow-none !outline-none !border-none ${
              activeTab === "users" ? "!text-blue-400" : "!text-gray-300 hover:!text-white"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`block px-3 py-2 rounded-md text-base font-medium !bg-transparent !shadow-none !outline-none !border-none ${
              activeTab === "blogs" ? "!text-blue-400" : "!text-gray-300 hover:!text-white"
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`block px-3 py-2 rounded-md text-base font-medium !bg-transparent !shadow-none !outline-none !border-none ${
              activeTab === "listings" ? "!text-blue-400" : "!text-gray-300 hover:!text-white"
            }`}
          >
            Marketplace
          </button>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Admin Logout"
        message="Are you sure you want to logout from the Admin Panel? You'll need to sign in again."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </nav>
  );
}
