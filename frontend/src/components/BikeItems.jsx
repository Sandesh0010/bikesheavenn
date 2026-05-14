import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import bikeImg from "../assets/RoyalEnfield.jpg";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Toast from "./Toast";
import MarketplaceNotification from "./MarketplaceNotification";
import ConfirmDialog from "./ConfirmDialog";

export default function BikeItems({ filterType = "blog" }) {
  const bikes = useLoaderData();
  const navigate = useNavigate();

  const [allBikes, SetAllBikes] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showMarketplaceNotif, setShowMarketplaceNotif] = useState(false);
  const [marketplaceMessage, setMarketplaceMessage] = useState("");
  const [marketplaceType, setMarketplaceType] = useState("success");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortOrder, setSortOrder] = useState("");

  let path = window.location.pathname === "/mybikes";

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  useEffect(() => {
    const fetchBikes = async () => {
      if (path) {
        try {
          const token = sessionStorage.getItem("token");
          console.log("Token from sessionStorage:", token);

          if (!token) {
            console.log("No token found, user not logged in");
            SetAllBikes([]);
            return;
          }

          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/bikes/mybikes?type=${filterType}`,
            {
              headers: {
                authorization: "Bearer " + token,
              },
            },
          );
          SetAllBikes(res.data);
          console.log(res.data, "fetched user bikes");
        } catch (err) {
          console.error("Error fetching my bikes:", err);
          console.error("Error response:", err.response?.data);

          // If token is invalid, clear it and redirect to login
          if (err.response?.status === 401) {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            SetAllBikes([]);
          }
        }
      } else {
        SetAllBikes(bikes);
      }
    };
    fetchBikes();
  }, [bikes, path, filterType]);

  // Log allBikes whenever it changes

  useEffect(() => {
    console.log(allBikes, "current allBikes state");
  }, [allBikes]);

  const confirmDelete = (bike) => {
    setBikeToDelete(bike);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBike = async () => {
    if (!bikeToDelete) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/bikes/${bikeToDelete._id}`,
        {
          headers: {
            authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        },
      );
      console.log(res);

      SetAllBikes((bikes) =>
        bikes.filter((bike) => bike._id !== bikeToDelete._id),
      );

      setMarketplaceMessage(bikeToDelete.forSale ? "Bike sale deleted successfully" : "Blog deleted successfully");
      setMarketplaceType("delete");
      setShowMarketplaceNotif(true);
    } catch (err) {
      console.log(err);
      showNotification(
        "Error! Something went wrong while removing the bike.",
        "error",
      );
    } finally {
      setShowDeleteConfirm(false);
      setBikeToDelete(null);
    }
  };

  return (
    <>
      {!path && allBikes.length > 0 && (
        <div className="flex justify-end mb-8">
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium cursor-pointer max-w-xs"
            >
              <option value="">Filter</option>
              <option value="highToLow">Price:High to Low</option>
              <option value="lowToHigh">Price:Low to High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      )}
      {path && allBikes.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No bikes found
          </h3>
          <p className="text-gray-600">
            {allBikes.length === 0 
              ? "Start building your bike collection by adding your first bike!" 
              : "No bikes found for this filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...allBikes]
            .sort((a, b) => {
              if (sortOrder === "highToLow") return Number(b.price) - Number(a.price);
              if (sortOrder === "lowToHigh") return Number(a.price) - Number(b.price);
              return 0;
            })
            .map((item) => (
            <div
              key={item._id}
              onMouseEnter={() => setHoveredCard(item._id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => {
                if (!path) {
                  navigate(`/bikes/${item._id}`, { state: { from: "home" } });
                } else {
                  navigate(`/bikes/${item._id}`, {
                    state: { 
                      from: item.forSale ? "marketplace" : "blog",
                      sourcePage: "mybikes"
                    },
                  });
                }
              }}
              className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                hoveredCard === item._id
                  ? "-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] scale-[1.03]"
                  : "shadow-lg"
              }`}
            >
              <div className="h-64 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      hoveredCard === item._id ? "scale-110" : "scale-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Marketplace / Home view (show full details) */}
              {!path ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  <p className="text-gray-700 mb-2">
                    {item.brand} - {item.model}
                  </p>

                  {item.condition && (
                    <p
                      className="text-sm font-semibold mb-2"
                      style={{
                        color:
                          item.condition === "Excellent"
                            ? "#10b981"
                            : item.condition === "Fair"
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {item.condition}
                    </p>
                  )}

                  {item.odometer > 0 && (
                    <p className="text-red-600 text-md font-semibold flex items-center gap-2 mb-2">
                      <MdDelete className="hidden" />
                      {item.odometer.toLocaleString()} km
                    </p>
                  )}

                  <p className="text-gray-700 text-md mb-4 line-clamp-3 text-justify">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-3xl font-bold text-green-600">
                      Rs {Number(item.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 mt-3">
                    {item.location && (
                      <p className="text-sm text-gray-500">
                        📍 {item.location}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Compact MyBikes view
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  <p className="text-gray-700 mb-2">
                    {item.brand} - {item.model}
                  </p>
                </div>
              )}

              {/* MyBikes action buttons at bottom */}
              {path && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.forSale) {
                        navigate(`/editmarketplace/${item._id}`, { state: { sourcePage: path ? "mybikes" : "marketplace" } });
                      } else {
                        navigate(`/editbikes/${item._id}`, { state: { sourcePage: path ? "mybikes" : "home" } });
                      }
                    }}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(item);
                    }}
                    className="flex items-center gap-1 !bg-red-600 !text-white hover:!bg-red-700 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <MarketplaceNotification
        message={marketplaceMessage}
        type={marketplaceType}
        isVisible={showMarketplaceNotif}
        onClose={() => setShowMarketplaceNotif(false)}
        duration={1200}
      />

      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Confirm Deletion"
          message="Are you sure you want to delete this bike? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={handleDeleteBike}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
