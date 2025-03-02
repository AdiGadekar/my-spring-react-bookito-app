/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getDriverBookingHistory } from "../../services/api";
import {
  FaCalendarCheck,
  FaMoneyBill,
  FaChartLine,
  FaDatabase,
} from "react-icons/fa";
import { LocalSpinnerAnimation } from "../common/Spinner";

function DriverCardDetails({ driverId }) {
  const [data, setData] = useState({
    totalBookings: 0,
    todaysBookings: 0,
    totalEarnings: 0,
  });
  const [customLoading, setcustomLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const bookingHistory = await getDriverBookingHistory(driverId);
        const todaysDate = new Date().toISOString().split("T")[0];

        const todaysBookings = bookingHistory.filter((booking) =>
          booking.createdAt.startsWith(todaysDate)
        );

        const totalEarnings = bookingHistory
          .filter((booking) => booking.status === "Completed")
          .reduce((acc, booking) => acc + (booking.paymentDTO?.amount || 0), 0);

        setData({
          totalBookings: bookingHistory.length,
          todaysBookings: todaysBookings.length,
          totalEarnings: Math.round(totalEarnings),
        });
        setcustomLoading(false);  
        
      } catch (error) {
        console.error("Error fetching driver booking data:", error);
      }
    };

    fetchDriverData();
  }, [driverId]);

  const cardData = [
    {
      title: "Total Bookings by Driver",
      value: data.totalBookings,
      icon: <FaCalendarCheck />,
    },
    {
      title: "Today's Total Bookings",
      value: data.todaysBookings,
      icon: <FaChartLine />,
    },
    {
      title: "Total Earnings Till Today",
      value: `₹${data.totalEarnings}`,
      icon: <FaMoneyBill />,
    },
  ];

  return (
    <div className="p-6 mt-3  space-y-4 shadow-lg rounded-lg shadow-gray-300">
      <h1 className="text-xl font-bold mb-6">
        <FaDatabase className="inline-block" /> Driver Statistics
      </h1>
      {customLoading === true ? (
        <LocalSpinnerAnimation />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`bg-[#ee8c0a] text-white p-6 rounded-lg shadow-lg transform hover:scale-110 transition duration-300`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{card.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverCardDetails;
