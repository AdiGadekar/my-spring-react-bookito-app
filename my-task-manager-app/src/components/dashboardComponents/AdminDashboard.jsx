/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  viewAllTaxis,
  getAllDriver,
  getAllCustomer,
  getAllBookings,
} from "../../services/api";
import {
  FaTaxi,
  FaUsers,
  FaMoneyBill,
  FaCalendarCheck,
  FaChartLine,
  FaUserTie,
  FaHome,
  FaDatabase,
} from "react-icons/fa";
import { LocalSpinnerAnimation } from "../common/Spinner";

function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalTaxis: 0,
    totalDrivers: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalEarnings: 0,
    todaysBookings: 0,
  });
  const [customLoading, setcustomLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taxisResponse = await viewAllTaxis();
        const driversResponse = await getAllDriver();
        const customersResponse = await getAllCustomer();
        const bookingsResponse = await getAllBookings();

        const todaysDate = new Date().toISOString().split("T")[0];
        const todaysBookings = bookingsResponse.data.body.filter((booking) =>
          booking.createdAt.startsWith(todaysDate)
        );

        const totalEarnings = bookingsResponse.data.body
          .filter((booking) => booking.status === "Completed")
          .reduce((acc, booking) => acc + (booking.paymentDTO?.amount || 0), 0);

        setData({
          totalTaxis: taxisResponse.data.body.length,
          totalDrivers: driversResponse.data.body.length,
          totalCustomers: customersResponse.data.body.length,
          totalBookings: bookingsResponse.data.body.length,
          totalEarnings: Math.round(totalEarnings),
          todaysBookings: todaysBookings.length,
        });
        setcustomLoading(false);
      } catch (error) {
        console.error(error.response?.data.body ||"Error fetching dashboard data");
      }
    };

    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Number of Taxis",
      value: data.totalTaxis,
      icon: <FaTaxi />,
      color: "from-blue-500 to-blue-700",
      link: "AllTaxis",
    },
    {
      title: "Total Number of Drivers",
      value: data.totalDrivers,
      icon: <FaUserTie />,
      color: "from-green-500 to-green-700",
      link: "AllDrivers",
    },
    {
      title: "Total Number of Customers",
      value: data.totalCustomers,
      icon: <FaUsers />,
      color: "from-yellow-500 to-yellow-700",
      link: "AllCustomers",
    },
    {
      title: "Total Bookings Done",
      value: data.totalBookings,
      icon: <FaCalendarCheck />,
      color: "from-red-500 to-red-700",
    },
    {
      title: "Total Booking Earnings",
      value: `₹${data.totalEarnings}`,
      icon: <FaMoneyBill />,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Today's Total Bookings",
      value: data.todaysBookings,
      icon: <FaChartLine />,
      color: "from-gray-500 to-gray-700",
    },
  ];

  const handleShowMore = (link) => {
    navigate("/www.bookito.com/adminOperations", {
      state: {
        actionType: link,
      },
    });
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">
        <FaDatabase className="inline text-3xl mb-1 mr-1 text-[#ee8c0a]" />
        Numerical Data
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {customLoading === true ? (
          <LocalSpinnerAnimation />
        ) : (
          cardData.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{card.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
              {card.link && (
                <button
                  onClick={() => handleShowMore(card.link)}
                  className={`mt-4 ${card.link === "AllDrivers" ? "text-green-700" : card.link === "AllTaxis" ? "text-blue-700" : "text-yellow-600"} font-semibold bg-white cursor-pointer py-2 px-4 rounded`}
                >
                  Show More
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
