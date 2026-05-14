import React from "react";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../config/api";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import MarketplaceNotification from "../components/MarketplaceNotification";

export default function AddBikes() {
  const [bikeData, setBikeData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showMarketplaceNotif, setShowMarketplaceNotif] = useState(false);
  const [marketplaceMessage, setMarketplaceMessage] = useState("");

  const navigate = useNavigate();

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const onHandleChange = (e) => {
    let value;

    if (e.target.name === "price" || e.target.name === "model") {
      value = Number(e.target.value);
    } else if (e.target.name === "file") {
      value = e.target.files[0];
    } else {
      value = e.target.value;
    }

    console.log("Changed field:", e.target.name, "Value:", value);

    setBikeData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    if (
      !bikeData.title ||
      !bikeData.brand ||
      !bikeData.model ||
      !bikeData.price ||
      !bikeData.description
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    console.log("Submitting bike data:", bikeData);

    const formData = new FormData();
    formData.append("title", bikeData.title);
    formData.append("brand", bikeData.brand);
    formData.append("model", bikeData.model);
    formData.append("price", bikeData.price);
    formData.append("description", bikeData.description);
    formData.append("odometer", 0); // Default value for personal collection

    if (bikeData.file) {
      formData.append("file", bikeData.file);
    }

    try {
      await axios.post(`${apiBaseUrl}/api/bikes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      });
      setMarketplaceMessage("Blog listed successfully.");
      setShowMarketplaceNotif(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error submitting bike:", err);
      showNotification(
        err.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <form
          className="max-w-3xl mx-auto mt-10 bg-white p-10 rounded-2xl shadow-2xl space-y-8 relative"
          onSubmit={onHandleSubmit}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 !text-black hover:!text-red-600 !font-extrabold text-xl !bg-transparent hover:!bg-transparent rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 !border-transparent !shadow-none"
            aria-label="Close form"
          >
            ✕
          </button>

          <h2 className="text-4xl font-bold text-center text-gray-800">
            Add a New Bike Blog
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Title *
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Classic Cruiser"
                value={bikeData.title || ""}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                onChange={onHandleChange}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Brand *
              </label>
              <input
                name="brand"
                type="text"
                placeholder="e.g., Royal Enfield"
                value={bikeData.brand || ""}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                onChange={onHandleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Model Year *
              </label>
              <input
                name="model"
                type="number"
                placeholder="e.g., 2023"
                value={bikeData.model || ""}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                onChange={onHandleChange}
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Price (Rs) *
              </label>
              <input
                type="number"
                name="price"
                placeholder="e.g., 50000"
                value={bikeData.price || ""}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                onChange={onHandleChange}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Tell us more about your bike..."
              rows="5"
              value={bikeData.description || ""}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
              onChange={onHandleChange}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">
              Upload Image *
            </label>
            <input
              type="file"
              name="file"
              className="w-full text-gray-700 bg-gray-100 rounded-lg cursor-pointer file:bg-blue-600 file:text-white file:px-6 file:py-3 file:border-none file:font-semibold hover:file:bg-blue-700"
              onChange={onHandleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            List My Blog
          </button>
        </form>

        <Toast
          message={toastMessage}
          type={toastType}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
        <MarketplaceNotification
          message={marketplaceMessage}
          type="success"
          isVisible={showMarketplaceNotif}
          onClose={() => setShowMarketplaceNotif(false)}
          duration={1500}
        />
      </div>
    </>
  );
}
