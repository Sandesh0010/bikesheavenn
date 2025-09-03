import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddBikes from "./pages/AddBikes";
import EditBikes from "./pages/EditBikes";
import BikeDetails, { bikeDetails } from "./pages/BikeDetails";
import MyBikes from "./pages/MyBikes";

const getAllBikes = async () => {
  let allBikes = [];
  await axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/api/bikes`)
    .then((res) => {
      allBikes = res.data;
    });
  return allBikes;
};

const getMyBikes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/bikes/mybikes`,
      {
        headers: {
          authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user's bikes:", error);
    return [];
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllBikes },
      { path: "/mybikes", element: <MyBikes />, loader: getMyBikes },
      { path: "/addbikes", element: <AddBikes /> },
      { path: "/editbikes/:id", element: <EditBikes /> },
      { path: "/bikes/:id", element: <BikeDetails />, loader: bikeDetails },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
