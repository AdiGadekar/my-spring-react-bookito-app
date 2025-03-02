/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getBookingHistory } from "../../services/api";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaChartLine,
  FaClipboardCheck,
  FaHistory,
  FaLocationArrow,
  FaRetweet,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { LocalSpinnerAnimation, SpinnerAnimation } from "../common/Spinner";

function CustomerCardDetails({ userId }) {
  const [data, setData] = useState({
    lastThreeBookings: [],
    totalBookings: 0,
    monthlyBookings: 0,
  });

  const navigate = useNavigate();
  const [flippedIndexes, setFlippedIndexes] = useState({});
  const [customLoading, setcustomLoading] = useState(false);


  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const bookingHistory = await getBookingHistory(userId);
        if (bookingHistory.data.body.length > 0) {
          const allBookings = bookingHistory.data.body;

          const sortedBookings = allBookings.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          const lastThreeBookings = sortedBookings.slice(0, 3);

          const totalBookings = allBookings.length;

          const todaysDate = new Date();
          const currentYear = todaysDate.getFullYear();
          const currentMonth = todaysDate.getMonth();
          const monthlyBookings = allBookings.filter(
            (booking) =>
              new Date(booking.createdAt).getFullYear() === currentYear &&
              new Date(booking.createdAt).getMonth() === currentMonth
          ).length;

          setData({
            lastThreeBookings,
            totalBookings,
            monthlyBookings,
          });
        }
        setcustomLoading(false);
      } catch (error) {
        setcustomLoading(true);
      }
    };

    fetchCustomerData();
  }, [userId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  const handleFlip = (index) => {
    setFlippedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleBookAgain = (origin, destination) => {
    navigate("/www.bookito.com/customerTaxiBooking", {
      state: {
        originVal: origin,
        destinationVal: destination,
        actionType: "Booking",
      },
    });
  };
  return (
    <div className="my-8 mx-1">
    
      {customLoading===false ? data.lastThreeBookings.length > 0 ? (
        <div>
          <h1 className="text-xl font-bold mb-6">
            <FaHistory className="inline text-[#ee8c0a] hover:scale-105 duration-200" />{" "}
            Previous Three Booking Details
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
            {data.lastThreeBookings.map((booking, index) => (
              <div
                key={index}
                className="relative w-full"
                onClick={() => handleFlip(index)}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="relative w-full lg:h-96 h-80 rounded-lg shadow-lg shadow-slate-400  transition-transform duration-100"
                  animate={{ rotateY: flippedIndexes[index] ? 180 : 0 }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute w-full lg:h-64 h-64 bg-[#fdfdfd] text-[#00509E] shadow-slate-900 px-3 pb-2 pt-3 rounded-lg flex flex-col justify-start items-start"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                    }}
                  >
                    <div className="text-lg flex flex-row font-bold mb-1 ">
                      <FaClipboardCheck className="mt-2 mr-1" />
                      <h1 className="text-2xl italic">Booking {index + 1}</h1>
                    </div>
                    <hr className="border-1 border-slate-900 h-1 w-full" />
                    <p className="text-sm mb-1">
                      <strong className="flex flex-row">
                        <FaLocationArrow className="mt-1 mr-1" />
                        Pickup:{" "}
                      </strong>
                      {"📍"}
                      {booking.pickupLocation.length > 40
                        ? booking.pickupLocation.slice(0, 60) + "..."
                        : booking.pickupLocation}
                    </p>
                    <p className="text-sm mb-1">
                      <strong className="flex flex-row">
                        <FaLocationArrow className="mt-1 mr-1" />
                        Dropoff:{" "}
                      </strong>
                      {"📍"}{" "}
                      {booking.dropoffLocation.length > 40
                        ? booking.dropoffLocation.slice(0, 60) + "..."
                        : booking.dropoffLocation}
                    </p>
                    <p className="text-sm mt-1">
                      <strong className="flex flex-row">
                        <FaCalendarCheck className="mr-1 mt-1" />
                        Date:{" "}
                      </strong>{" "}
                      {formatDate(booking.createdAt)}
                    </p>
                    {booking.status === "Completed" ? (
                      <>
                        <p className="text-sm mt-2">
                          <strong>Status: </strong>
                          <span className="px-2 py-1 rounded-full  bg-green-200 text-green-700">
                            {booking.status}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm mt-2">
                          <strong>Status: </strong>
                          <span className=" px-2 py-1 rounded-full bg-red-200 text-red-700">
                            {booking.status}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="absolute flex justify-center space-x-96 lg:space-x-20 bottom-0 w-full ">
                    <button
                      className="customeApplicationButton h-10 w-30 mb-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAgain(
                          booking.pickupLocation,
                          booking.dropoffLocation
                        );
                      }}
                    >
                      Book Again.
                    </button>
                    <FaRetweet className="text-2xl rotate-90 mt-2" />
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute text-left w-full h-full bg-[#f7f7f7] text-black px-3 pb-2 pt-3 rounded-lg shadow-lg flex flex-col justify-start items-start"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <h2 className="text-lg font-semibold italic mb-1 text-gray-800">
                      Booking Details
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Booking ID: </strong>{" "}
                      <span>BKID{booking.bookingId}</span>
                    </p>
                    <p className="text-sm mb-1">
                      <strong className="flex flex-row">
                        <FaLocationArrow className="mt-1 mr-1" />
                        Pickup:{" "}
                      </strong>
                      {"📍"}
                      {booking.pickupLocation}
                    </p>

                    <p className="text-sm mb-1">
                      <strong className="flex flex-row">
                        <FaLocationArrow className="mt-1 mr-1" />
                        Dropoff:
                      </strong>
                      {"📍"}
                      {booking.dropoffLocation}
                    </p>

                    {booking.status === "Completed" && (
                      <p className="text-sm text-gray-600">
                        <strong>Payment Amount: </strong> ₹{" "}
                        <span className="font-medium underline">
                          {booking.paymentDTO.amount}
                        </span>
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
            <div className="bg-[#ee8c0a] text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  <FaUsers />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Total Bookings Done</h2>
                  <div className="text-2xl font-bold">{data.totalBookings}</div>
                </div>
              </div>
            </div>

            <div className="bg-[#ee8c0a] text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">
                  <FaChartLine />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Bookings This Month</h2>
                  <div className="text-2xl font-bold">
                    {data.monthlyBookings}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-36 p-3 hover:scale-105 duration-300 shadow-lg rounded-lg">
          <h1 className="text-xl font-bold mb-6">
            Book Your First taxi today🚕
          </h1>
        </div>
      ):(
        <h1 className="text-xl font-bold mb-6">
           Loading Previous Booking Details!!
          </h1>
      )}
      {customLoading && <LocalSpinnerAnimation /> }
    </div>
  );
}

export default CustomerCardDetails;
