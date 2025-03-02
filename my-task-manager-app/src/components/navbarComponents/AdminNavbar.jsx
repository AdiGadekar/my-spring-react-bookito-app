import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthData from "../../services/useAuthData";
import AuthContext from "../../context/AuthContext";

const AdminNavbar = () => {
  const { loading, loginResult } = useAuthData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(""); 
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout(loginResult.email);
  };

  const handleNavigation = (actionType) => {
    setActiveNav(actionType);
    navigate("/www.bookito.com/adminOperations", {
      state: {
        loginResult: loginResult,
        actionType: actionType,
      },
    });
  };

  return (
    <nav className="bg-slate-900 p-4 pb-2 pt-3 h-18 sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img alt="Your Company" src="../../../CarLogo/image-removebg-preview.png" className="h-8 w-auto" />
          
          <div className="hidden md:flex text-lg ml-10 space-x-4">
            <button
              onClick={() => {
                setActiveNav("Home");
                navigate("/www.bookito.com/homePage");
              }}
              className={`cursor-pointer text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "Home" ? "bg-[#ee8c0a]" : "hover:bg-[#ee8c0a]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("AllCustomers")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "AllCustomers"
                  ? "bg-[#ee8c0a]"
                  : "hover:bg-[#ee8c0a]"
              }`}
            >
              All Customers
            </button>
            <button
              onClick={() => handleNavigation("AllDrivers")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "AllDrivers"
                  ? "bg-[#ee8c0a]"
                  : "hover:bg-[#ee8c0a]"
              }`}
            >
              All Drivers
            </button>

            <button
              onClick={() => handleNavigation("AllBookings")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "AllBookings"
                  ? "bg-[#ee8c0a]"
                  : "hover:bg-[#ee8c0a]"
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => handleNavigation("AllTaxis")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "AllTaxis" ? "bg-[#ee8c0a]" : "hover:bg-[#ee8c0a]"
              }`}
            >
              All Taxis
            </button>
            
            <button
              onClick={() => handleNavigation("AddDriver")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "AddDriver"
                  ? "bg-[#ee8c0a]"
                  : "hover:bg-[#ee8c0a]"
              }`}
            >
              Add Driver
            </button>

            <button
              onClick={() => handleNavigation("AddTaxi")}
              className={`text-white px-3 py-2 rounded-md font-medium ${
                activeNav === "AddTaxi" ? "bg-[#ee8c0a]" : "hover:bg-[#ee8c0a]"
              }`}
            >
              Add Taxi
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
            className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-1 bg-gray-700 p-4 rounded-md">
          <button
            onClick={() => navigate("/www.bookito.com/homePage")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "Home" ? "bg-orange-600" : "hover:bg-orange-600"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation("AllCustomers")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "AllCustomers"
                ? "bg-orange-600"
                : "hover:bg-orange-600"
            }`}
          >
            All Customers
          </button>
          <button
            onClick={() => handleNavigation("AllDrivers")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "AllDrivers"
                ? "bg-orange-600"
                : "hover:bg-orange-600"
            }`}
          >
            All Drivers
          </button>
          <button
            onClick={() => handleNavigation("AllTaxis")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "AllTaxis" ? "bg-orange-600" : "hover:bg-orange-600"
            }`}
          >
            All Taxis
          </button>
          <button
            onClick={() => handleNavigation("AllBookings")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "AllBookings" ? "bg-orange-600" : "hover:bg-orange-600"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => handleNavigation("AddTaxi")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "AddTaxi" ? "bg-orange-600" : "hover:bg-orange-600"
            }`}
          >
            Add Taxi
          </button>
          <button
            onClick={() => handleNavigation("AddDriver")}
            className={`block text-white px-3 py-2 rounded-md text-sm font-medium w-full text-left ${
              activeNav === "AddDriver"
                ? "bg-orange-600"
                : "hover:bg-orange-600"
            }`}
          >
            Add Driver
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
export default AdminNavbar;