import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../config/api";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "../components/Toast";
import MarketplaceNotification from "../components/MarketplaceNotification";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useLocation } from "react-router-dom";

const initialBikeData = {
  title: "",
  brand: "",
  model: "",
  price: "",
  description: "",
  image: "",
  file: null,
};

export default function EditBikes() {
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bikes/${id}`);

        const res = response.data;
        setBikeData({
          title: res.title || "",
          brand: res.brand || "",
          model: res.model || "",
          price: res.price || "",
          description: res.description || "",
          image: res.image || "",
          file: null,
        });
      } catch (err) {
        console.error("Error loading bike data:", err);
        showNotification("Failed to load bike details", "error");
      }
    };

    getData();
  }, [id]);

  const onHandleChange = (e) => {
    let value;

    if (e.target.name === "price" || e.target.name === "model") {
      value = Number(e.target.value);
    } else if (e.target.name === "file") {
      value = e.target.files[0];
    } else {
      value = e.target.value;
    }

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

    const formData = new FormData();
    formData.append("title", bikeData.title);
    formData.append("brand", bikeData.brand);
    formData.append("model", Number(bikeData.model));
    formData.append("odometer", 0);
    formData.append("price", Number(bikeData.price));
    formData.append("description", bikeData.description);

    if (bikeData.file) {
      formData.append("file", bikeData.file);
    }

    try {
      await axios.put(`${apiBaseUrl}/api/bikes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      });

      setMarketplaceMessage("Bike edited successfully");
      setShowMarketplaceNotif(true);
      setTimeout(() => {
        if (isAdminRoute) {
          navigate("/admin/dashboard", { state: { activeTab: "blogs" } });
        } else if (location.state?.sourcePage === "mybikes") {
          navigate("/mybikes", { state: { activeTab: "blog" } });
        } else {
          navigate("/", { state: { activeTab: "blog" } });
        }
      }, 1200);
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
      {isAdminRoute && (
        <AdminNavbar activeTab="blogs" setActiveTab={handleAdminTabChange} />
      )}
      <ScrollToTop />
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isAdminRoute ? 'py-6' : 'py-12'}`}>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-10 relative">
            <button
              type="button"
              onClick={() => {
                if (isAdminRoute) {
                  navigate("/admin/dashboard", { state: { activeTab: "blogs" } });
                } else if (location.state?.sourcePage === "mybikes") {
                  navigate("/mybikes", { state: { activeTab: "blog" } });
                } else {
                  navigate("/", { state: { activeTab: "blog" } });
                }
              }}
              className="absolute top-4 right-4 !text-black hover:!text-red-600 !font-extrabold text-xl !bg-transparent hover:!bg-transparent rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 !border-transparent !shadow-none"
              aria-label="Close edit form"
            >
              ✕
            </button>

            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Edit Your Bike
            </h2>

            <form onSubmit={onHandleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Bike Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Enter bike title"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                    onChange={onHandleChange}
                    value={bikeData.title}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Brand *
                  </label>
                  <input
                    name="brand"
                    type="text"
                    placeholder="Enter bike brand"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                    onChange={onHandleChange}
                    value={bikeData.brand}
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
                    name="model"
                    type="number"
                    placeholder="Enter bike model year"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                    onChange={onHandleChange}
                    value={bikeData.model}
                    required
                    min="1900"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Price (Rs) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter bike price"
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                    onChange={onHandleChange}
                    value={bikeData.price}
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Enter bike description"
                  rows="5"
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                  onChange={onHandleChange}
                  value={bikeData.description}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-semibold">
                  Upload New Image
                </label>
                <input
                  type="file"
                  name="file"
                  className="w-full text-gray-700 bg-gray-100 rounded-lg cursor-pointer file:bg-blue-600 file:text-white file:px-6 file:py-3 file:border-none file:font-semibold hover:file:bg-blue-700"
                  onChange={onHandleChange}
                />
                {bikeData.image && !bikeData.file && (
                  <img
                    src={bikeData.image}
                    alt="Current bike"
                    className="mt-4 h-40 object-cover rounded-lg shadow-md"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Update Bike Blog
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
