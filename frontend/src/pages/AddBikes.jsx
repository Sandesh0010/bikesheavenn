import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBikes() {
  const [bikeData, setBikeData] = useState({});

  const navigate = useNavigate();

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
      alert("Please fill in all required fields");
      return;
    }

    console.log("Submitting bike data:", bikeData);

    const formData = new FormData();
    formData.append("title", bikeData.title);
    formData.append("brand", bikeData.brand);
    formData.append("model", bikeData.model);
    formData.append("price", bikeData.price);
    formData.append("description", bikeData.description);

    if (bikeData.file) {
      formData.append("file", bikeData.file);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/bikes`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert("Bike Added Successfully");
      navigate("/");
    } catch (err) {
      console.error("Error submitting bike:", err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <form
        className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg space-y-6"
        onSubmit={onHandleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          List Your Bike
        </h2>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Title</label>
          <input
            name="title"
            type="text"
            placeholder="Enter bike title"
            value={bikeData.title || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onHandleChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Brand</label>
          <input
            name="brand"
            type="text"
            placeholder="Enter bike brand"
            value={bikeData.brand || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onHandleChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Model</label>
          <input
            name="model"
            type="number"
            placeholder="Enter bike model"
            value={bikeData.model || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onHandleChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            placeholder="Enter bike price"
            value={bikeData.price || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onHandleChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter bike description"
            rows="4"
            value={bikeData.description || ""}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onHandleChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Image</label>
          <input
            type="file"
            name="file"
            className="w-full px-4 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={onHandleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </>
  );
}
