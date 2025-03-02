import React, { useEffect } from "react";
import GoogleMapIntegration from "../components/bookingComponents/GoogleMapIntegration";
import CustomerNavbar from "../components/navbarComponents/CustomerNavbar";
import { useLocation } from "react-router-dom";
import BookingInfomation from "../components/bookingComponents/BookingInfomation";
import ErrorBoundary from "../components/ErrorBoundry";

const CustomerTaxiBooking = () => {

  // useEffect(()=>{
  //   throw new Error("Creashed!!")
  // },[])
  const location = useLocation();
  const { userData, originVal, destinationVal, actionType, bookingId } =
    location.state || {};
  return (
    <React.Fragment>
      <CustomerNavbar userData={userData} />

      {actionType == "Booking" && (
        <ErrorBoundary>
          <GoogleMapIntegration
            originVal={originVal}
            destinationVal={destinationVal}
          />
        </ErrorBoundary>
      )}
      {actionType == "ShowCreatedBooking" && (
        <ErrorBoundary>
          <BookingInfomation userData={userData} bookingId={bookingId} />
        </ErrorBoundary>
      )}
    </React.Fragment>
  );
};

export default CustomerTaxiBooking;
