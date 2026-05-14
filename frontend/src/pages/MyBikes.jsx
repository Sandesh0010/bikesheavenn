import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import BikeItems from "../components/BikeItems";

const MyBikes = () => {
  const location = useLocation();
  const [filterType, setFilterType] = useState(location.state?.activeTab || "blog");

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800">
            My Bike Collection
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Here are all the bikes you've added.
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
                ...(filterType === "blog"
                  ? { left: "4px", right: "auto" }
                  : { right: "4px", left: "auto" }),
              }}
            />

            {/* Buttons */}
            <div className="relative flex z-10">
              <button
                onClick={() => setFilterType("blog")}
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
                  color: filterType === "blog" ? "white" : "#374151",
                  transition: "color 300ms ease-out",
                }}
              >
                Blog Listed Bikes
              </button>
              <button
                onClick={() => setFilterType("sale")}
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
                  color: filterType === "sale" ? "white" : "#374151",
                  transition: "color 300ms ease-out",
                }}
              >
                Sale Listed Bikes
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <BikeItems filterType={filterType} />
        </div>
      </div>
    </div>
  );
};

export default MyBikes;
