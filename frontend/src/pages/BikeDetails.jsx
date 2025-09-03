import React from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";

export const bikeDetails = async ({ params }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/bikes/${params.id}`
  );
  return res.data;
};

export default function BikeDetails() {
  const bike = useLoaderData();

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{bike.title}</h1>

      <img
        src={bike.image}
        alt={bike.title}
        className="w-full h-[315px] object-cover rounded-lg mb-6 shadow-md"
      />

      <div className="space-y-3 text-gray-700 text-lg">
        <p>
          <span className="font-semibold text-gray-900">Brand:</span>{" "}
          {bike.brand}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Model:</span>{" "}
          {bike.model}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Price:</span> Rs{" "}
          {bike.price}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Description:</span>{" "}
          {bike.description}
        </p>
      </div>
    </div>
  );
}
