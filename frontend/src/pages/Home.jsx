import React from "react";
import bikelogo from "../assets/bikelogo.png";
import BikeItems from "../components/BikeItems";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import Form from "../components/Form";
import Toast from "../components/Toast";
import AuthAnimation from "../components/AuthAnimation";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [startSignup, setStartSignup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthAnim, setShowAuthAnim] = useState(false);
  const [authAnimMessage, setAuthAnimMessage] = useState("");
  const [authAnimType, setAuthAnimType] = useState("success");

  // Check if we should show login modal on mount
  useEffect(() => {
    if (location.state?.showLogin) {
      setStartSignup(false);
      setIsOpen(true);
    }
    // Check for token to determine login status
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [location.state]);

  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(Boolean(sessionStorage.getItem("token")));
    };

    syncLoginState();
    window.addEventListener("storage", syncLoginState);
    window.addEventListener("loginStatusChanged", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("loginStatusChanged", syncLoginState);
    };
  }, []);

  const showNotification = (message, type = "success") => {
    const lower = message.toLowerCase();
    const isAuthMessage =
      lower.includes("login") ||
      lower.includes("logged out") ||
      lower.includes("logged in") ||
      lower.includes("account created") ||
      lower.includes("logout");

    if (isAuthMessage) {
      setAuthAnimMessage(message);
      setAuthAnimType(type === "error" ? "error" : "success");
      setShowAuthAnim(true);
      setShowToast(false);
      return;
    }

    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const addBikes = () => {
    let token = sessionStorage.getItem("token");
    if (token) {
      navigate("/addbikes");
    } else {
      setStartSignup(true);
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <main className="container mx-auto pt-24 pb-12 flex items-center justify-between px-8">
          <div className="left max-w-2xl">
            <h1 className="text-7xl font-bold mb-6 text-gray-800 leading-tight">
              Find Your <span className="text-blue-600">Dream Bike</span>
            </h1>
            <h5 className="text-xl mb-8 text-gray-600">
              The ultimate destination for bike enthusiasts. Discover, buy, and
              sell bikes with ease.
            </h5>
            <button
              onClick={addBikes}
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl"
            >
              {isLoggedIn ? "List Blog" : "Get Started"}
            </button>
          </div>

          <div className="right flex-shrink-0">
            <img
              src={bikelogo}
              alt="Bike Logo"
              className="w-[500px] h-[450px] object-contain"
            />
          </div>
        </main>

        <div className="py-12 bg-white">
          <div className="container mx-auto px-8">
            <BikeItems />
          </div>
        </div>
      </div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <Form
            setIsOpen={() => setIsOpen(false)}
            showNotification={showNotification}
            onLogin={() => setIsLoggedIn(true)}
            initialSignup={startSignup}
          />
        </Modal>
      )}

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />

      <AuthAnimation
        message={authAnimMessage}
        type={authAnimType}
        isVisible={showAuthAnim}
        onClose={() => setShowAuthAnim(false)}
      />
    </>
  );
}
