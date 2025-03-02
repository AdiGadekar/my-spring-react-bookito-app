/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingByCustomerIdAndStatusConfirmed } from "../../services/api";
import CustomerCardDetails from "../customerOperationComponents/CustomerCardDetails";
import useAuthData from "../../services/useAuthData";
import { FaArrowCircleRight } from "react-icons/fa";
import ErrorBoundary from "../ErrorBoundry";
import { LocalSpinnerAnimation, SpinnerAnimation } from "../common/Spinner";

function CustomerDashboard() {
  const { loginResult } = useAuthData();
  const userData = loginResult;
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [customLoading, setcustomLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!userData || !userData.userId) {
        return;
      }
      try {
        const response = await getBookingByCustomerIdAndStatusConfirmed(
          userData.userId
        );
        if (response.status === 200) {
          setBooking(response.data.body);
        } else {
          setBooking(null);
        }
        setcustomLoading(false);
      } catch (error) {
        if(error.response.status ===404){
          setcustomLoading(false);
        }
        setBooking(null);
      }
    };

    fetchBooking();
  }, [userData]);

  const handleBookTaxi = () => {
    navigate("/www.bookito.com/customerTaxiBooking", {
      state: {
        actionType: "Booking",
      },
    });
  };

  const handleShowBookingDetails = () => {
    navigate("/www.bookito.com/customerTaxiBooking", {
      state: {
        userData: userData,
        actionType: "ShowCreatedBooking",
        bookingId: booking.bookingId,
      },
    });
  };

  if (customLoading) {
    return (
      <div>
        <h1 className="text-2xl mx-2 font-extrabold mb-4 ">
        Loading User Booking Details
      </h1> 
        <LocalSpinnerAnimation />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-extrabold mb-4 ">
        Welcome Passanger😊. Have a great ride with us!!
      </h1>
      <ErrorBoundary>
        <div className="flex flex-col space-y-4">
          {booking ? (
            <button
              className="customeApplicationButton"
              onClick={handleShowBookingDetails}
            >
              <FaArrowCircleRight className="inline text-lg mr-2 justify-start" />
              View My Booking
            </button>
          ) : (
            <button
              className="customeApplicationButton"
              onClick={handleBookTaxi}
            >
              <FaArrowCircleRight className="inline text-lg mr-2 justify-start" />
              Book Taxi
            </button>
          )}
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <CustomerCardDetails userId={userData.userId} />
      </ErrorBoundary>
    </div>
  );
}

export default CustomerDashboard;
