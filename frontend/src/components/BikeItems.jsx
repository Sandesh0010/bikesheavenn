import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import bikeImg from "../assets/RoyalEnfield.jpg";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { bikeDetails } from "../pages/BikeDetails";

export default function BikeItems() {
  const bikes = useLoaderData();

  const [allBikes, SetAllBikes] = useState([]);

  let path = window.location.pathname === "/mybikes";

  useEffect(() => {
    const fetchBikes = async () => {
      if (path) {
        try {
          const token = localStorage.getItem("token");
          console.log("Token from localStorage:", token);

          if (!token) {
            console.log("No token found, user not logged in");
            SetAllBikes([]);
            return;
          }

          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/bikes/mybikes`,
            {
              headers: {
                authorization: "Bearer " + token,
              },
            }
          );
          SetAllBikes(res.data);
          console.log(res.data, "fetched user bikes");
        } catch (err) {
          console.error("Error fetching my bikes:", err);
          console.error("Error response:", err.response?.data);

          // If token is invalid, clear it and redirect to login
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            SetAllBikes([]);
          }
        }
      } else {
        SetAllBikes(bikes);
      }
    };
    fetchBikes();
  }, [bikes, path]);

  // Log allBikes whenever it changes

  useEffect(() => {
    console.log(allBikes, "current allBikes state");
  }, [allBikes]);

  const OnDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bike?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/bikes/${id}`
      );
      console.log(res);

      SetAllBikes((bikes) => bikes.filter((bike) => bike._id !== id));

      alert("Bike deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete bike.");
    }
  };

  return (
    <>
      <div className="card-container ml-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {allBikes.map((item, index) => {
          return (
            <div
              key={index}
              className="max-w-xs  bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
            >
              <Link to={`/bikes/${item._id}`} className="flex-1 flex flex-col">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4 text-center flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {item.title}
                  </h3>
                  <div className="bg-green-500 text-white text-sm font-bold text-center py-2 mt-auto rounded-b-lg">
                    Rs {item.price}
                  </div>
                </div>
              </Link>

              {path && (
                <div className="flex justify-end space-x-3 p-2">
                  <Link to={`/editbikes/${item._id}`} className="editIcon">
                    <FaEdit className="text-blue-500 cursor-pointer" />
                  </Link>
                  <MdDelete
                    onClick={() => OnDelete(item._id)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
