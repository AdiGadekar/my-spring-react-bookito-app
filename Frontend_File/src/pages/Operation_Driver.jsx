import React from "react";
import { useLocation } from "react-router-dom";

import DriverBookingHistory from "../components/driverOperationComponents/DriverBookingHistory";
import EarningsReport from "../components/driverOperationComponents/EarningsReport";
import DriverNavbar from "../components/navbarComponents/DriverNavbar";
import Footer from "../components/common/Footer";
import ErrorBoundary from "../components/ErrorBoundry";

const Operation_Driver = () => {
  const location = useLocation();
  const { loginResult } = location.state || {};
  const { actionType } =
    location.state && typeof location.state === "object"
      ? location.state
      : { actionType: "DriverBookingHistory  " };

  return (
    <React.Fragment>
      <DriverNavbar />
      <div className="p-1">
        {actionType === "DriverBookingHistory" && (
          <ErrorBoundary>
            <DriverBookingHistory loginResult={loginResult} />
          </ErrorBoundary>
        )}
        {actionType === "EarningsReport" && (
          <ErrorBoundary>
            <EarningsReport loginResult={loginResult} />
          </ErrorBoundary>
        )}

        {!["DriverBookingHistory", "EarningsReport"].includes(actionType) && (
          <div className="mt-4 text-red-500">Error: Unknown action type</div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Operation_Driver;
