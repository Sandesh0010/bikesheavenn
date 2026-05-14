import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Form({
  setIsOpen,
  showNotification,
  onLogin,
  initialSignup = false,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsSignup(initialSignup);
  }, [initialSignup]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "signup" : "login";
    setError(""); // Clear previous errors

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${endpoint}`,
        { email, password },
      );

      if (isSignup) {
        setPassword("");
        setConfirmPassword("");
        showNotification("Account created Successfully! ", "success");
        setIsOpen();
        navigate("/");
        return;
      }

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));

      // Dispatch custom event to notify other components of login status change
      window.dispatchEvent(new Event("loginStatusChanged"));

      if (onLogin) {
        onLogin();
      }

      showNotification("Login Successful !", "success");
      setIsOpen(); // Close the form
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-8 shadow-2xl">
      <div key={isSignup ? "signup" : "login"} className="animate-slide-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isSignup ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-500">
            {isSignup
              ? "Join our community of bike lovers."
              : "Sign in to access your world of bikes."}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleOnSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-bold rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
          >
            {isSignup ? "Create Account" : "Login to Account"}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                className="text-blue-600 font-bold cursor-pointer hover:underline"
                onClick={() => {
                  setIsSignup((pre) => !pre);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                {isSignup ? "Login" : "Sign Up"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
