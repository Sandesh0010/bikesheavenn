import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../config/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Toast from "../components/Toast";
import MarketplaceNotification from "../components/MarketplaceNotification";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const initialBikeData = {
  title: "",
  brand: "",
  model: "",
  odometer: "",
  price: "",
  condition: "",
  description: "",
  image: null,
  contactInfo: "",
  location: "",
};

export default function EditMarketplaceBike() {
  const [bikeData, setBikeData] = useState(initialBikeData);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showMarketplaceNotif, setShowMarketplaceNotif] = useState(false);
  const [marketplaceMessage, setMarketplaceMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isAdminRoute = location.pathname.startsWith('/admin/');
  
  const handleAdminTabChange = (tab) => {
    navigate('/admin/dashboard', { state: { activeTab: tab } });
  };

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const showMarketplaceNotification = (message) => {
    setMarketplaceMessage(message);
    setShowMarketplaceNotif(true);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bikes/${id}`);
        const res = response.data;

        setBikeData({
          title: res.title || "",
          brand: res.brand || "",
          model: res.model || "",
          odometer: res.odometer || "",
          price: res.price || "",
          condition: res.condition || "",
          description: res.description || "",
          image: res.image || null,
          contactInfo: res.contactInfo || "",
          location: res.location || "",
        });
      } catch (err) {
        console.error("Error loading marketplace bike:", err);
        showNotification("Failed to load bike details", "error");
      }
    };

    getData();
  }, [id]);

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "price" || name === "model" || name === "odometer") {
      setBikeData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    if (name === "contactInfo") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setBikeData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    if (name === "image") {
      setBikeData((prev) => ({
        ...prev,
        image: files && files[0] ? files[0] : prev.image,
      }));
      return;
    }

    setBikeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    if (
      !bikeData.title ||
      !bikeData.brand ||
      !bikeData.model ||
      !bikeData.odometer ||
      !bikeData.price ||
      !bikeData.condition ||
      !bikeData.description ||
      !bikeData.contactInfo ||
      !bikeData.location
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (bikeData.contactInfo.length !== 10) {
      showNotification("Contact number must be exactly 10 digits", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", bikeData.title);
    formData.append("brand", bikeData.brand);
    formData.append("model", Number(bikeData.model));
    formData.append("odometer", Number(bikeData.odometer));
    formData.append("price", Number(bikeData.price));
    formData.append("condition", bikeData.condition);
    formData.append("description", bikeData.description);
    formData.append("contactInfo", bikeData.contactInfo);
    formData.append("location", bikeData.location);

    if (bikeData.image instanceof File) {
      formData.append("file", bikeData.image);
    }

    try {
      await axios.put(`${apiBaseUrl}/api/bikes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      });

      showMarketplaceNotification("Sale Listing edited successfully");
      setTimeout(() => {
        if (isAdminRoute) {
          navigate("/admin/dashboard", { state: { activeTab: "listings" } });
        } else if (location.state?.sourcePage === "mybikes") {
          navigate("/mybikes", { state: { activeTab: "sale" } });
        } else {
          navigate("/buysell", { state: { activeTab: "browse" } });
        }
      }, 1200);
    } catch (err) {
      console.error("Error submitting bike:", err);
      if (err.response?.status === 401) {
        showNotification(
          err.response?.data?.message ||
            "Session expired. Please log in again.",
          "error",
        );
        return;
      }
      showNotification(
        err.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  return (
    <>
      {isAdminRoute && (
        <AdminNavbar activeTab="listings" setActiveTab={handleAdminTabChange} />
      )}
      <ScrollToTop />
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isAdminRoute ? 'py-6' : 'py-12'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-10 relative">
            <button
              type="button"
              onClick={() => {
                if (isAdminRoute) {
                  navigate("/admin/dashboard", { state: { activeTab: "listings" } });
                } else if (location.state?.sourcePage === "mybikes") {
                  navigate("/mybikes", { state: { activeTab: "sale" } });
                } else {
                  navigate("/buysell", { state: { activeTab: "browse" } });
                }
              }}
              className="absolute top-4 right-4 !text-black hover:!text-red-600 !font-extrabold text-xl !bg-transparent hover:!bg-transparent rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 !border-transparent !shadow-none"
              aria-label="Close edit form"
            >
            ✕
          </button>

          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Edit Marketplace Listing
          </h2>

          <form onSubmit={onHandleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Bike Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={bikeData.title}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="e.g., Royal Enfield Classic 350"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={bikeData.brand}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="e.g., Royal Enfield"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Model Year *
                </label>
                <input
                  type="number"
                  name="model"
                  value={bikeData.model}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="2023"
                  required
                  min="1900"
                  max="2030"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Odometer (km) *
                </label>
                <input
                  type="number"
                  name="odometer"
                  value={bikeData.odometer}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="e.g., 15000"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={bikeData.price}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="150000"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Condition
                </label>
                <select
                  name="condition"
                  value={bikeData.condition}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                >
                  <option value="" disabled>
                    Select condition *
                  </option>
                  <option value="Excellent">Excellent</option>
                  <option value="Fair">Fair</option>
                  <option value="Bad">Bad</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactInfo"
                  value={bikeData.contactInfo}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="10-digit phone number"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={bikeData.location}
                  onChange={onHandleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="City, e.g., Kathmandu"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Description *
              </label>
              <textarea
                name="description"
                value={bikeData.description}
                onChange={onHandleChange}
                rows="5"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                placeholder="Describe your bike's condition, features, etc."
                required
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Upload New Image
              </label>
              <input
                type="file"
                name="image"
                onChange={onHandleChange}
                accept="image/*"
                className="w-full text-gray-700 bg-gray-100 rounded-lg cursor-pointer file:bg-blue-600 file:text-white file:px-6 file:py-3 file:border-none file:font-semibold hover:file:bg-blue-700"
              />
              {bikeData.image && typeof bikeData.image === "string" && (
                <img
                  src={bikeData.image}
                  alt="Current bike"
                  className="mt-4 h-32 w-56 object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Update Sale Listing
            </button>
          </form>
        </div>
      </div>

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
        duration={1200}
      />
      <Footer />
    </div>
    </>
  );
}
