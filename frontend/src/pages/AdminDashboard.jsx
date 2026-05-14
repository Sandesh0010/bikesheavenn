import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../config/api";
import { useNavigate, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdSpeed } from "react-icons/md";
import bikeImg from "../assets/RoyalEnfield.jpg";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "users");
  const [data, setData] = useState({ users: [], blogs: [], listings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState({ type: "", id: "" });
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [usersRes, blogsRes, listingsRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/user/all`, config),
        axios.get(`${apiBaseUrl}/api/bikes`, config),
        axios.get(`${apiBaseUrl}/api/bikes/marketplace`, config),
      ]);

      setData({
        users: usersRes.data.filter((user) => user.role !== "admin"),
        blogs: blogsRes.data,
        listings: listingsRes.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (type, id) => {
    setDeleteData({ type, id });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const { type, id } = deleteData;
    setShowDeleteConfirm(false);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let url = "";
      if (type === "users") {
        url = `${apiBaseUrl}/api/user/${id}`;
      } else {
        url = `${apiBaseUrl}/api/bikes/${id}`;
      }

      await axios.delete(url, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xl min-h-screen bg-gray-50">Loading Admin Dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 min-h-screen bg-gray-50">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-8 py-12 flex-grow w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === "users" && "Manage Users"}
            {activeTab === "blogs" && "Manage Blogs"}
            {activeTab === "listings" && "Manage Marketplace"}
          </h1>
          <p className="text-gray-600 mt-2">
            {activeTab === "users" && `Total Users: ${data.users.length}`}
            {activeTab === "blogs" && `Total Blogs: ${data.blogs.length}`}
            {activeTab === "listings" && `Total Listings: ${data.listings.length}`}
          </p>
        </div>

        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete("users", user._id)}
                          className="!bg-red-600 hover:!bg-red-700 !text-white px-3 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium relative left-2"
                          disabled={user.role === 'admin'}
                          title={user.role === 'admin' ? "Cannot delete admin" : "Delete user"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.users.length === 0 && (
                    <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "blogs" && (
          <div>
            {data.blogs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500">No blogs found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                    onClick={() => navigate(`/admin/bikes/${blog._id}`, { state: { from: "home" } })}
                  >
                    <div className="h-56 bg-gray-200 overflow-hidden">
                      <img src={blog.image || bikeImg} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    <div className="p-6 flex-grow">
                      <h2 className="text-2xl font-bold mb-2 truncate">{blog.title}</h2>
                      <p className="text-gray-700 mb-2">{blog.brand} - {blog.model}</p>
                      {blog.condition && (
                        <p className="text-sm font-semibold mb-2" style={{ color: blog.condition === "Excellent" ? "#10b981" : blog.condition === "Fair" ? "#f59e0b" : "#ef4444" }}>{blog.condition}</p>
                      )}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3 text-justify">{blog.description}</p>
                      <div className="mt-auto">
                        <p className="text-xs text-gray-500 mb-1">Author: {blog.createdBy?.email || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">Date: {new Date(blog.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => navigate(`/admin/editbikes/${blog._id}`)} className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"><FaEdit /> Edit</button>
                      <button onClick={() => handleDelete("blogs", blog._id)} className="flex items-center gap-1 !bg-red-600 !text-white hover:!bg-red-700 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"><MdDelete /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "listings" && (
          <div>
            {data.listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <p className="text-gray-500">No marketplace listings found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
                    onClick={() => navigate(`/admin/bikes/${listing._id}`, { state: { from: "marketplace" } })}
                  >
                    <div className="h-56 bg-gray-200 overflow-hidden">
                      <img src={listing.image || bikeImg} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                    <div className="p-6 flex-grow">
                      <h3 className="font-bold text-2xl text-gray-900 mb-2 truncate">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{listing.brand} • {listing.model}</p>
                      <div className="flex items-center justify-between mb-4">
                        {listing.condition && (
                          <p className="text-sm font-semibold flex items-center gap-1" style={{ color: listing.condition === "Excellent" ? "#10b981" : listing.condition === "Fair" ? "#f59e0b" : "#ef4444" }}>{listing.condition}</p>
                        )}
                        {listing.odometer > 0 && (
                          <p className="text-red-600 text-sm font-semibold flex items-center gap-1"><MdSpeed className="text-lg" />{listing.odometer.toLocaleString()} km</p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-2xl font-bold text-green-600">Rs {Number(listing.price).toLocaleString()}</span>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Seller: {listing.createdBy?.email || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end gap-3" onClick={e => e.stopPropagation()}>
                      <button onClick={() => navigate(`/admin/editmarketplace/${listing._id}`)} className="flex items-center gap-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"><FaEdit /> Edit</button>
                      <button onClick={() => handleDelete("listings", listing._id)} className="flex items-center gap-1 !bg-red-600 !text-white hover:!bg-red-700 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"><MdDelete /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={`Confirm Delete ${deleteData.type.charAt(0).toUpperCase() + deleteData.type.slice(1, -1)}`}
        message={`Are you sure you want to delete this ${deleteData.type.slice(0, -1)}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <Footer />
    </div>
  );
}
