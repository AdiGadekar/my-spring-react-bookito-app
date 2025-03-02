import React from "react";
import { useLocation } from "react-router-dom";

import BookingHistory from "../components/customerOperationComponents/BookingHistory";
import ViewProfile from "../components/customerOperationComponents/ViewProfile";
import CustomerNavbar from "../components/navbarComponents/CustomerNavbar";
import Footer from "../components/common/Footer";
import ErrorBoundary from "../components/ErrorBoundry";

const Operation_Customer = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const { actionType } =
    location.state && typeof location.state === "object"
      ? location.state
      : { actionType: "BookingHistory" };

  return (
    <React.Fragment>
      <CustomerNavbar userData={userData} />
      <div className="p-1">
        {actionType === "BookingHistory" && (
          <ErrorBoundary>
            <BookingHistory userData={userData} />
          </ErrorBoundary>
        )}
        {actionType === "ViewProfile" && (
          <ErrorBoundary>
            <ViewProfile userData={userData} />
          </ErrorBoundary>
        )}

        {!["BookingHistory", "ViewProfile"].includes(actionType) && (
          <div className="mt-4 text-red-500">Error: Unknown action type</div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Operation_Customer;
