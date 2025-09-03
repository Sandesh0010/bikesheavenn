import React from "react";
import BikeItems from "../components/BikeItems";

const MyBikes = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <div className="flex justify-center items-center">
        <h1 className=" mt-10 text-3xl font-semibold">My Bikes</h1>
      </div>

      <div className="mt-10">
        <BikeItems />
      </div>
    </div>
  );
};

export default MyBikes;
