import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddBikes from "./pages/AddBikes";
import EditBikes from "./pages/EditBikes";
import EditMarketplaceBike from "./pages/EditMarketplaceBike";
import BikeDetails, { bikeDetails } from "./pages/BikeDetails";
import MyBikes from "./pages/MyBikes";
import BuySell from "./pages/BuySell";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";

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
    const token = sessionStorage.getItem("token");
    if (!token) {
      return [];
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/bikes/mybikes`,
      {
        headers: {
          authorization: "Bearer " + token,
        },
      },
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
      { path: "/buysell", element: <BuySell /> },
      { path: "/addbikes", element: <AddBikes /> },
      { path: "/editbikes/:id", element: <EditBikes /> },
      { path: "/editmarketplace/:id", element: <EditMarketplaceBike /> },
      {
        path: "/bikes/:id",
        element: <BikeDetails />,
        loader: bikeDetails,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/bikes/:id",
    element: (
      <AdminRoute>
        <BikeDetails />
      </AdminRoute>
    ),
    loader: bikeDetails,
  },
  {
    path: "/admin/editbikes/:id",
    element: (
      <AdminRoute>
        <EditBikes />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/editmarketplace/:id",
    element: (
      <AdminRoute>
        <EditMarketplaceBike />
      </AdminRoute>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
