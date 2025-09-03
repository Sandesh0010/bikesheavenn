import React, { useState } from "react";
import axios from "axios";

export default function Form({ setIsOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "Signup" : "login";

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${endpoint}`,
        { email, password }
      );

      if (isSignup) {
        alert("User registered");
        setIsOpen();
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful");
        setIsOpen();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Invalid Credentials");
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className="w-full flex flex-col gap-3 p-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Enter Credentials
      </h2>

      <div className="flex flex-col">
        <label className="text-gray-600 font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-600 font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
      >
        {isSignup ? "Sign Up" : "Login"}
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <p className="text-center text-gray-500 text-sm mt-2">
        {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
        <span
          className="text-blue-500 font-semibold cursor-pointer hover:underline"
          onClick={() => setIsSignup((pre) => !pre)}
        >
          {isSignup ? "Login" : "Sign Up"}
        </span>
      </p>
    </form>
  );
}
