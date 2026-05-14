import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bikeImg from "../assets/RoyalEnfield.jpg";
import Modal from "../components/Modal";
import Form from "../components/Form";
import Toast from "../components/Toast";
import MarketplaceNotification from "../components/MarketplaceNotification";
import ConfirmDialog from "../components/ConfirmDialog";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdSpeed } from "react-icons/md";

export default function BuySell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse"); // 'browse' or 'sell'
  const [bikesForSale, setBikesForSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showMarketplaceNotif, setShowMarketplaceNotif] = useState(false);
  const [marketplaceMessage, setMarketplaceMessage] = useState("");
  const [marketplaceType, setMarketplaceType] = useState("success");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filterOption, setFilterOption] = useState("");

  // Form state for selling a bike
  const [sellForm, setSellForm] = useState({
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
  });

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const showMarketplaceNotification = (message, type = "success") => {
    setMarketplaceMessage(message);
    setMarketplaceType(type);
    setShowMarketplaceNotif(true);
  };

  const token = sessionStorage.getItem("token");
  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleSellTabClick = () => {
    if (!token) {
      navigate("/", { state: { showLogin: true } });
      return;
    }
    setActiveTab("sell");
  };

  useEffect(() => {
    fetchBikesForSale();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const fetchBikesForSale = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bikes/marketplace`,
      );
      setBikesForSale(response.data);
    } catch (error) {
      console.error("Error fetching marketplace bikes:", error);
      showNotification("Error loading marketplace bikes", "error");
    }
    setLoading(false);
  };

  const handleSellFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "contactInfo") {
      // Only allow digits and limit to 10 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setSellForm((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setSellForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setIsOpen(true);
      return;
    }

    // Validate all required fields
    if (
      !sellForm.title ||
      !sellForm.brand ||
      !sellForm.model ||
      !sellForm.odometer ||
      !sellForm.price ||
      !sellForm.condition ||
      !sellForm.description ||
      !sellForm.contactInfo ||
      !sellForm.location ||
      !sellForm.image
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // Validate contact info is exactly 10 digits
    if (sellForm.contactInfo.length !== 10) {
      showNotification("Contact number must be exactly 10 digits", "error");
      return;
    }

    const formData = new FormData();
    Object.keys(sellForm).forEach((key) => {
      if (sellForm[key] !== null && sellForm[key] !== "") {
        if (key === "image") {
          formData.append("file", sellForm[key]); // Backend expects "file", not "image"
        } else {
          formData.append(key, sellForm[key]);
        }
      }
    });
    formData.append("forSale", true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bikes`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: "Bearer " + token,
          },
        },
      );

      showMarketplaceNotification("Bike sale listed successfully", "success");
      setActiveTab("browse"); // Switch to browse tab to see the listing
      setSellForm({
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
      });
      fetchBikesForSale();
    } catch (error) {
      showNotification(
        "Error listing bike for sale. Please try again.",
        "error",
      );
    }
  };

  const handleDeleteBike = async () => {
    if (!bikeToDelete) return;

    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/bikes/${bikeToDelete._id}`,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        },
      );

      showMarketplaceNotification(bikeToDelete.forSale ? "Bike sale deleted successfully" : "Blog deleted successfully", "delete");
      setShowDeleteConfirm(false);
      setBikeToDelete(null);
      fetchBikesForSale();
    } catch (error) {
      showNotification("Error deleting bike. Please try again.", "error");
    }
    setLoading(false);
  };

  const confirmDelete = (bike) => {
    setBikeToDelete(bike);
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen pt-12 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-gray-800 mb-3">
              Bike Marketplace
            </h1>
            <p className="text-gray-600 text-xl">
              Your one-stop shop to buy and sell amazing bikes.
            </p>
          </div>

          {/* Slider Toggle Navigation */}
          <div className="flex justify-center mb-10">
            <div className="relative border-2 border-black rounded-full p-1 w-full max-w-xs">
              {/* Animated Background Slider */}
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  bottom: "4px",
                  width: "calc(50% - 4px)",
                  backgroundColor: "#2563eb",
                  borderRadius: "24px",
                  transition: "all 2600ms ease-in-out",
                  ...(activeTab === "browse"
                    ? { left: "4px", right: "auto" }
                    : { right: "4px", left: "auto" }),
                }}
              />

              {/* Buttons */}
              <div className="relative flex z-10">
                <button
                  onClick={() => setActiveTab("browse")}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    color: activeTab === "browse" ? "white" : "#374151",
                    transition: "color 300ms ease-out",
                  }}
                >
                  Browse Bikes
                </button>
                <button
                  onClick={handleSellTabClick}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    color: activeTab === "sell" ? "white" : "#374151",
                    transition: "color 300ms ease-out",
                  }}
                >
                  Sell Your Bike
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === "browse" && (
            <div>
              <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Freshly Listed
                </h2>
                <div className="relative">
                  <select
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer max-w-xs"
                  >
                    <option value="">Filter</option>
                    <option value="highToLow">Price: High to Low</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="Excellent">Condition: Excellent</option>
                    <option value="Fair">Condition: Fair</option>
                    <option value="Bad">Condition: Bad</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
                  <p className="text-gray-600 mt-6 text-lg">
                    Loading awesome bikes...
                  </p>
                </div>
              ) : bikesForSale.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <svg
                    className="w-20 h-20 text-gray-300 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    Marketplace is Empty
                  </h3>
                  <p className="text-gray-500">
                    Why not be the first to list a bike?
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...bikesForSale]
                    .filter((bike) => {
                      if (["Excellent", "Fair", "Bad"].includes(filterOption)) {
                        return bike.condition === filterOption;
                      }
                      return true;
                    })
                    .sort((a, b) => {
                      if (filterOption === "highToLow") return Number(b.price) - Number(a.price);
                      if (filterOption === "lowToHigh") return Number(a.price) - Number(b.price);
                      return 0;
                    })
                    .map((bike) => (
                    <div
                      key={bike._id}
                      onMouseEnter={() => setHoveredCard(bike._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() =>
                        navigate(`/bikes/${bike._id}`, {
                          state: { from: "marketplace" },
                        })
                      }
                      className={`bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                        hoveredCard === bike._id
                          ? "-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] scale-[1.03]"
                          : "shadow-lg"
                      }`}
                    >
                      <div className="h-56 bg-gray-200 overflow-hidden">
                        <img
                          src={bike.image || bikeImg}
                          alt={bike.title}
                          className={`w-full h-full object-cover transition-transform duration-500 ${
                            hoveredCard === bike._id ? "scale-110" : "scale-100"
                          }`}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-2xl text-gray-900 mb-2 truncate">
                          {bike.title}
                        </h3>
                        <p className="text-gray-600 text-md mb-3">
                          {bike.brand} • {bike.model}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          {bike.condition && (
                            <p
                              className="text-md font-semibold flex items-center gap-2"
                              style={{
                                color:
                                  bike.condition === "Excellent"
                                    ? "#10b981"
                                    : bike.condition === "Fair"
                                      ? "#f59e0b"
                                      : "#ef4444",
                              }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="inline"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                              {bike.condition}
                            </p>
                          )}
                          {bike.odometer > 0 && (
                            <p className="text-red-600 text-md font-semibold flex items-center gap-2">
                              <MdSpeed className="text-red-600 text-lg" />
                              {bike.odometer.toLocaleString()} km
                            </p>
                          )}
                        </div>
                        <p className="text-gray-700 text-md mb-4 line-clamp-3 text-justify">
                          {bike.description}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-3xl font-bold text-green-600">
                            Rs {Number(bike.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t pt-3 mt-3 flex justify-between items-center">
                          {bike.location && (
                            <p className="text-sm text-gray-500">
                              📍 {bike.location}
                            </p>
                          )}

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "sell" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-10 relative">
                <button
                  type="button"
                  onClick={() => setActiveTab("browse")}
                  className="absolute top-4 right-4 !text-black hover:!text-red-600 !font-extrabold text-xl !bg-transparent hover:!bg-transparent rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 !border-transparent !shadow-none"
                  aria-label="Close sell form"
                >
                  ✕
                </button>

                <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                  List Your Bike for Sale
                </h2>
                <form onSubmit={handleSellSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block mb-2 text-gray-700 font-semibold">
                        Bike Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={sellForm.title}
                        onChange={handleSellFormChange}
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
                        value={sellForm.brand}
                        onChange={handleSellFormChange}
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
                        value={sellForm.model}
                        onChange={handleSellFormChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                        placeholder="2023"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700 font-semibold">
                        Odometer (km) *
                      </label>
                      <input
                        type="number"
                        name="odometer"
                        value={sellForm.odometer}
                        onChange={handleSellFormChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                        placeholder="e.g., 15000"
                        required
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
                        value={sellForm.price}
                        onChange={handleSellFormChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                        placeholder="150000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-700 font-semibold">
                        Condition *
                      </label>
                      <select
                        name="condition"
                        value={sellForm.condition}
                        onChange={handleSellFormChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                        required
                      >
                        <option value="" disabled>
                          Select condition
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
                        value={sellForm.contactInfo}
                        onChange={handleSellFormChange}
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
                        value={sellForm.location}
                        onChange={handleSellFormChange}
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
                      value={sellForm.description}
                      onChange={handleSellFormChange}
                      rows="5"
                      className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 outline-none transition-shadow"
                      placeholder="Describe your bike's condition, features, etc."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 font-semibold">
                      Upload Image *
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleSellFormChange}
                      accept="image/*"
                      className="w-full text-gray-700 bg-gray-100 rounded-lg cursor-pointer file:bg-blue-600 file:text-white file:px-6 file:py-3 file:border-none file:font-semibold hover:file:bg-blue-700"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    List for Sale
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <Form
            setIsOpen={() => setIsOpen(false)}
            showNotification={showNotification}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Remove Bike Listing"
        message={`Are you sure you want to remove "${bikeToDelete?.title}" from the marketplace? This action cannot be undone.`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleDeleteBike}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setBikeToDelete(null);
        }}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
      <MarketplaceNotification
        message={marketplaceMessage}
        type={marketplaceType}
        isVisible={showMarketplaceNotif}
        onClose={() => setShowMarketplaceNotif(false)}
        duration={1200}
      />
    </>
  );
}
