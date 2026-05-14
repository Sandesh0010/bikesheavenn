import React from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

// eslint-disable-next-line react-refresh/only-export-components
export const bikeDetails = async ({ params }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/bikes/${params.id}`,
  );
  return res.data;
};

export default function BikeDetails() {
  const bike = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin/');
  
  const isFromMyBikes = location.state?.sourcePage === "mybikes";
  const isMarketplace = location.state?.from === "marketplace" && !isFromMyBikes;
  const isBlogView = location.state?.from === "home" || location.state?.from === "blog";
  const showAds = !isAdminRoute && !isFromMyBikes && (isMarketplace || isBlogView);

  const handleAdminTabChange = (tab) => {
    navigate('/admin/dashboard', { state: { activeTab: tab } });
  };

  React.useEffect(() => {
    if (isMarketplace) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isMarketplace]);

  return (
    <>
      {isAdminRoute && (
        <AdminNavbar 
          activeTab={location.state?.from === "marketplace" ? "listings" : "blogs"} 
          setActiveTab={handleAdminTabChange} 
        />
      )}
      <ScrollToTop />
      <div className={`w-full bg-gray-50 flex justify-center ${
        isMarketplace 
          ? 'min-h-[calc(100vh-140px)] items-center overflow-hidden' 
          : `min-h-[calc(100vh-140px)] ${isAdminRoute ? 'items-center' : 'items-start'}`
      } py-12 relative`}>
        
        <div className="flex w-full max-w-[1500px] mx-auto gap-8 items-stretch justify-center px-4 md:px-8">

          {showAds && (
            <div className="hidden 2xl:flex flex-col gap-6 w-[250px]">
              {isBlogView ? (
                <>
                  <a href="https://www.bajajauto.com/en-np/bikes" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center flex-1 bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 relative group">
                    <span className="absolute top-2 left-3 z-10 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-gray-500 font-bold text-[10px] tracking-wider uppercase">Ad</span>
                    <img 
                      src="/bajaj-ad.jpg" 
                      alt="Bajaj Nepal" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/250x450?text=Ad+1' 
                      }} 
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <p className="text-white text-sm font-bold text-center">Book Now</p>
                    </div>
                  </a>
                  <a href="https://helmetsnepal.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center flex-1 bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 relative group">
                    <span className="absolute top-2 left-3 z-10 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-gray-500 font-bold text-[10px] tracking-wider uppercase">Ad</span>
                    <img 
                      src="/helmet-ad.jpg" 
                      alt="Helmets Nepal" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/250x450?text=Ad+2' 
                      }} 
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                   
                      <p className="text-white text-sm font-bold text-center">Shop Now</p>
                    </div>
                  </a>
                </>
              ) : (
                <a href="https://helmetsnepal.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center h-full bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-2 relative group">
                  <span className="absolute top-3 left-4 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-gray-500 font-bold text-[10px] tracking-wider uppercase">Ad</span>
                  <img 
                    src="/helmet-ad.jpg" 
                    alt="Helmets Nepal" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/250x450?text=Ad' 
                    }} 
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-bold text-center">Shop Now</p>
                  </div>
                </a>
              )}
            </div>
          )}

          <div className="w-full max-w-4xl flex-1 p-8 bg-white shadow-2xl rounded-2xl relative">
        <button
          type="button"
          onClick={() => {
            if (isAdminRoute) {
              const targetTab = location.state?.from === "marketplace" ? "listings" : "blogs";
              navigate('/admin/dashboard', { state: { activeTab: targetTab } });
            } else if (location.state?.sourcePage === "mybikes") {
              const targetTab = location.state?.from === "marketplace" ? "sale" : "blog";
              navigate('/mybikes', { state: { activeTab: targetTab } });
            } else {
              navigate(-1);
            }
          }}
          className="absolute top-4 right-4 !text-black hover:!text-red-600 !font-extrabold text-xl !bg-transparent hover:!bg-transparent rounded-full w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10 !border-transparent !shadow-none"
          aria-label="Back"
          title="Back"
        >
          ✕
        </button>

        {location.state?.from === "home" || location.state?.from === "blog" ? (
          <div className="flex flex-col items-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
              {bike.title}
            </h1>
            <div className="flex gap-4 text-xl text-gray-600 mb-6 font-medium">
              <span>{bike.brand}</span>
              <span>•</span>
              <span>{bike.model}</span>
            </div>
          

            {bike.image && (
              <img
                src={bike.image}
                alt={bike.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg mb-5"
              />
            )}
              <p className="text-3xl font-bold text-green-600 mb-5">
              Rs {Number(bike.price).toLocaleString()}
            </p>

            <div className="w-full bg-blue-50/50 rounded-2xl p-5 border border-blue-100 shadow-sm text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">
                {bike.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:items-start">
            <div className="flex flex-col gap-6">
              {bike.image ? (
                <img
                  src={bike.image}
                  alt={bike.title}
                  className="w-full h-auto object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl shadow-lg">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}

              <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 shadow-sm text-left">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-wrap">
                  {bike.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                {bike.title}
              </h1>
              <div className="space-y-4 text-gray-700 text-lg">
                <p className="flex items-center">
                  <span className="font-semibold text-gray-900 w-28">Brand:</span>
                  <span>{bike.brand}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold text-gray-900 w-28">Model:</span>
                  <span>{bike.model}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold text-gray-900 w-28">Price:</span>
                  <span
                    className={`font-semibold ${
                      location.state?.from === "home" ||
                      location.state?.from === "marketplace"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    Rs {Number(bike.price).toLocaleString()}
                  </span>
                </p>
                {bike.forSale &&
                  bike.odometer !== undefined &&
                  bike.odometer !== null && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 w-28">
                        Odometer:
                      </span>
                      <span className="text-red-600 font-semibold">
                        {Number(bike.odometer).toLocaleString()} km
                      </span>
                    </p>
                  )}
                {bike.condition && (
                  <p className="flex items-center">
                    <span className="font-semibold text-gray-900 w-28">
                      Condition:
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          bike.condition === "Excellent"
                            ? "#10b981"
                            : bike.condition === "Fair"
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {bike.condition}
                    </span>
                  </p>
                )}
                {bike.contactInfo && (
                  <p className="flex items-center">
                    <span className="font-semibold text-gray-900 w-28">
                      Contact:
                    </span>
                    <span>{bike.contactInfo}</span>
                  </p>
                )}
                {bike.location && (
                  <p className="flex items-center">
                    <span className="font-semibold text-gray-900 w-28">
                      Location:
                    </span>
                    <span>{bike.location}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
          </div>

          {showAds && (
            <div className="hidden 2xl:flex flex-col gap-6 w-[250px]">
              {isBlogView ? (
                <>
                  <a href="https://www.bikersnepal.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center flex-1 bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 relative group">
                    <span className="absolute top-2 left-3 z-10 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-gray-500 font-bold text-[10px] tracking-wider uppercase">Ad</span>
                    <img 
                      src="/bikers-ad.jpg" 
                      alt="Bikers Nepal" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/250x450?text=Ad+1' 
                      }} 
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-bold text-center">Book Now</p>
                    </div>
                  </a>
                  <a href="https://tvsnepal.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center flex-1 bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 relative group">
                    <span className="absolute top-2 left-3 z-10 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded text-gray-500 font-bold text-[10px] tracking-wider uppercase">Ad</span>
                    <img 
                      src="/tvs-ad.jpeg" 
                      alt="TVS Nepal" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/250x450?text=Ad+2' 
                      }} 
                    />
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      
                      <p className="text-white text-sm font-bold text-center">View Offers</p>
                    </div>
                  </a>
                </>
              ) : (
                <a href="https://www.maw2wheelers.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center h-full bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-2 relative group">
                  <span className="absolute top-3 left-4 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-gray-500 font-bold text-[10px] tracking-wider uppercase">Ad</span>
                  <img 
                    src="/yamaha-ad.jpg" 
                    alt="Yamaha Nepal" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/250x450?text=Ad' 
                    }} 
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-bold text-center">Book Now</p>
                  </div>
                </a>
              )}
            </div>
          )}

        </div>
      {isAdminRoute && <Footer />}
    </div>
    </>
  );
}
