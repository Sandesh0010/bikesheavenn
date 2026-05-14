import React from "react";
import Modal from "./Modal";
import Form from "./Form";
import Toast from "./Toast";
import AuthAnimation from "./AuthAnimation";
import ConfirmDialog from "./ConfirmDialog";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [startSignup, setStartSignup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showAuthAnim, setShowAuthAnim] = useState(false);
  const [authAnimMessage, setAuthAnimMessage] = useState("");
  const [authAnimType, setAuthAnimType] = useState("success");
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const token = sessionStorage.getItem("token");
    setIsLogin(!token);
    
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdminUser(user.role === "admin");
        setUserName(user.email || user.username || user.name || "User");
      } catch {
        setIsAdminUser(false);
        setUserName("");
      }
    } else {
      setIsAdminUser(false);
      setUserName("");
    }
  };

  useEffect(() => {
    // Check initial login status
    checkLoginStatus();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Listen for storage changes (when sessionStorage is updated from other components)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    window.addEventListener("loginStatusChanged", handleStorageChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", handleStorageChange);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const showNotification = (message, type = "success") => {
    const lower = message.toLowerCase();
    const isAuthMessage =
      lower.includes("login") ||
      lower.includes("logged out") ||
      lower.includes("logged in") ||
      lower.includes("account created") ||
      lower.includes("logout");

    if (isAuthMessage) {
      // show centered auth animation only for auth-related messages
      setAuthAnimMessage(message);
      setAuthAnimType(type === "error" ? "error" : "success");
      setShowAuthAnim(true);
      // ensure the side toast doesn't appear for auth messages
      setShowToast(false);
      return;
    }

    // non-auth notifications use the existing toast
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLogin(true);
    setShowLogoutConfirm(false);
    setShowUserDropdown(false);
    showNotification("Logout Successful !", "info");

    // Dispatch custom event to notify other components of login status change
    window.dispatchEvent(new Event("loginStatusChanged"));

    navigate("/");
  };

  const checkLogin = () => {
    const currentToken = sessionStorage.getItem("token");
    if (currentToken) {
      setShowLogoutConfirm(true);
    } else {
      navigate("/");
      setStartSignup(false);
      setIsOpen(true);
    }
  };
  return (
    <>
      <header className="w-full flex items-center justify-between px-6 md:px-10 h-16 bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200/30 sticky top-0 z-50">
        <Link to="/">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">BikesHeaven</h2>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md !text-black hover:!text-blue-600 hover:bg-gray-100 transition-colors focus:outline-none !bg-transparent !shadow-none !border-none cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8">
          <li className="transition-transform duration-200 ease-in-out hover:scale-110">
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                color: isActive ? "#2563eb" : "#000",
              })}
              className={({ isActive }) =>
                `font-extrabold text-lg tracking-wide transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="transition-transform duration-200 ease-in-out hover:scale-110">
            <NavLink
              to="/buysell"
              style={({ isActive }) => ({
                color: isActive ? "#2563eb" : "#000",
              })}
              className={({ isActive }) =>
                `font-extrabold text-lg tracking-wide transition-colors duration-200 ${
                  isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                }`
              }
            >
              Marketplace
            </NavLink>
          </li>
          <li className="transition-transform duration-200 ease-in-out hover:scale-110">
            {isLogin ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setStartSignup(false);
                  setIsOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setStartSignup(false);
                    setIsOpen(true);
                  }
                }}
                role="button"
                tabIndex={0}
                style={{
                  fontFamily: "Inter, Poppins, sans-serif",
                  color: location.pathname === "/mybikes" ? "#2563eb" : "#000",
                }}
                className="font-extrabold text-lg tracking-wide transition-colors duration-200 text-black hover:text-blue-600 cursor-pointer"
              >
                MyBikes
              </a>
            ) : (
              <NavLink
                to="/mybikes"
                style={({ isActive }) => ({
                  color: isActive ? "#2563eb" : "#000000",
                })}
                className={({ isActive }) =>
                  `font-extrabold text-lg tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-black hover:text-blue-600"
                  }`
                }
              >
                MyBikes
              </NavLink>
            )}
          </li>
          {isAdminUser && (
            <li className="transition-transform duration-200 ease-in-out hover:scale-110">
              <NavLink
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "#2563eb" : "#000",
                })}
                className={({ isActive }) =>
                  `font-extrabold text-lg tracking-wide transition-colors duration-200 ${
                    isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                  }`
                }
              >
                Admin Panel
              </NavLink>
            </li>
          )}
          <li className="relative">
            {isLogin ? (
              <button
                onClick={checkLogin}
                className="px-6 py-2 !bg-blue-600 !text-white rounded-full font-bold text-base hover:!bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none cursor-pointer"
              >
                Login
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center justify-center p-2 rounded-full hover:!bg-gray-100 transition-colors focus:outline-none !bg-transparent !shadow-none !border-none cursor-pointer"
                >
                  <FaUserCircle className="w-8 h-8 text-gray-700 hover:!text-blue-600" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        checkLogin(); // This triggers the logout confirm
                      }}
                      className="block w-full text-left px-4 py-2 text-sm !text-red-600 hover:!bg-gray-100 transition-colors font-medium !bg-transparent !shadow-none !border-none cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-xl border-b border-gray-200 z-40 flex flex-col py-4 px-6 animate-slide-in">
          <ul className="flex flex-col space-y-4">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setIsMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  color: isActive ? "#2563eb" : "#000",
                })}
                className={({ isActive }) =>
                  `block font-extrabold text-lg tracking-wide ${
                    isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/buysell"
                onClick={() => setIsMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  color: isActive ? "#2563eb" : "#000",
                })}
                className={({ isActive }) =>
                  `block font-extrabold text-lg tracking-wide ${
                    isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                  }`
                }
              >
                Marketplace
              </NavLink>
            </li>
            <li>
              {isLogin ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setStartSignup(false);
                    setIsOpen(true);
                  }}
                  style={{
                    fontFamily: "Inter, Poppins, sans-serif",
                    color: location.pathname === "/mybikes" ? "#2563eb" : "#000",
                  }}
                  className="block font-extrabold text-lg tracking-wide text-black hover:text-blue-600 cursor-pointer"
                >
                  MyBikes
                </a>
              ) : (
                <NavLink
                  to="/mybikes"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? "#2563eb" : "#000",
                  })}
                  className={({ isActive }) =>
                    `block font-extrabold text-lg tracking-wide ${
                      isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                    }`
                  }
                >
                  MyBikes
                </NavLink>
              )}
            </li>
            {isAdminUser && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    color: isActive ? "#2563eb" : "#000",
                  })}
                  className={({ isActive }) =>
                    `block font-extrabold text-lg tracking-wide ${
                      isActive ? "text-blue-600" : "text-black hover:text-blue-600"
                    }`
                  }
                >
                  Admin Panel
                </NavLink>
              </li>
            )}
            <li className="pt-4 border-t border-gray-200">
              {isLogin ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    checkLogin();
                  }}
                  className="w-full py-2 !bg-blue-600 !text-white rounded-full font-bold text-base hover:!bg-blue-700 transition-colors cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <FaUserCircle className="w-8 h-8" />
                    <div>
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium">{userName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      checkLogin(); // This triggers the logout confirm
                    }}
                    className="w-full py-2 !bg-red-50 !text-red-600 border border-red-100 rounded-full font-bold text-base hover:!bg-red-100 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <Form
            setIsOpen={() => setIsOpen(false)}
            showNotification={showNotification}
            initialSignup={startSignup}
          />
        </Modal>
      )}

      <AuthAnimation
        message={authAnimMessage}
        type={authAnimType}
        isVisible={showAuthAnim}
        onClose={() => setShowAuthAnim(false)}
      />

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </>
  );
}
