/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthData from "../../services/useAuthData";
import AuthContext from "../../context/AuthContext";

const DriverNavbar = () => {
  const { loading, loginResult } = useAuthData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(""); 
  const { logout } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout(loginResult.email);
  };

  const handleNavigation = (actionType) => {
    setActiveNav(actionType); 
    navigate("/www.bookito.com/operationDriver", {
      state: {
        loginResult: loginResult,
        actionType: actionType,
      },
    });
  };

  return (
    <nav className="bg-slate-900 left-0 top-0 z-50 sticky p-4 pb-2 pt-3 h-18">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center text-lg">
          <img alt="Your Company" src="../../../CarLogo/image-removebg-preview.png" className="h-8 w-auto" />
          <div className="hidden md:flex ml-10 space-x-4">
            <button
              onClick={() => {
                setActiveNav("Home");
                navigate("/www.bookito.com/homePage");
              }}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "Home" ? "bg-[#ee8c0a]" : "hover:bg-[#ee8c0a]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("DriverBookingHistory")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "DriverBookingHistory" ? "bg-[#ee8c0a]" : "hover:bg-[#ee8c0a]"
              }`}
            >
              Booking History
            </button>
            <button
              onClick={() => handleNavigation("EarningsReport")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "EarningsReport" ? "bg-[#ee8c0a]" : "hover:bg-[#ee8c0a]"
              }`}
            >
              Earnings Report
            </button>
          </div>
        </div>
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-gray-400 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md italic font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-1 bg-gray-700 p-4 rounded-md">
          <span className="block text-white px-3 py-2 text-sm font-medium">
            Welcome, {loginResult.firstName}
          </span>
          <button
            onClick={() => navigate("/www.bookito.com/homePage")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "Home" ? "bg-[#ee8c0a]" : "hover:bg-gray-600"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("DriverBookingHistory")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "DriverBookingHistory" ? "bg-[#ee8c0a]" : "hover:bg-gray-600"
            }`}
          >
            Booking History
          </button>
          <button
            onClick={() => handleNavigation("EarningsReport")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "EarningsReport" ? "bg-[#ee8c0a]" : "hover:bg-gray-600"
            }`}
          >
            Earnings Report
          </button>
          <button
            onClick={handleLogout}
            className="block text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default DriverNavbar;
