import React from "react";
import { useLocation } from "react-router-dom";

import AllCustomers from "../components/adminOperationComponents/AllCustomers";
import AllDrivers from "../components/adminOperationComponents/AllDrivers";
import AllTaxis from "../components/adminOperationComponents/AllTaxis";
import AddTaxi from "../components/adminOperationComponents/AddTaxi";
import AddDriver from "../components/adminOperationComponents/AddDriver";
import AdminNavbar from "../components/navbarComponents/AdminNavbar";
import Footer from "../components/common/Footer";
import AllBookings from "../components/adminOperationComponents/AllBookings";
import ErrorBoundary from "../components/ErrorBoundry";

const AdminOperations = () => {
  const location = useLocation();
  const { actionType } =
    location.state && typeof location.state === "object"
      ? location.state
      : { actionType: "AllCustomers" };

  return (
    <React.Fragment>
      <AdminNavbar />
      <div className="p-1">
        {actionType === "AddTaxi" && (
          <ErrorBoundary>
            <AddTaxi />
          </ErrorBoundary>
        )}
        {actionType === "AllBookings" && (
          <ErrorBoundary>
            <AllBookings />
          </ErrorBoundary>
        )}
        {actionType === "AddDriver" && (
          <ErrorBoundary>
            <AddDriver />
          </ErrorBoundary>
        )}
        {actionType === "AllCustomers" && (
          <ErrorBoundary>
            <AllCustomers />
          </ErrorBoundary>
        )}
        {actionType === "AllDrivers" && (
          <ErrorBoundary>
            <AllDrivers />
          </ErrorBoundary>
        )}
        {actionType === "AllTaxis" && (
          <ErrorBoundary>
            <AllTaxis />
          </ErrorBoundary>
        )}

        {![
          "AddTaxi",
          "AllCustomers",
          "AllDrivers",
          "AllTaxis",
          "AddDriver",
          "AllBookings",
        ].includes(actionType) && (
          <div className="mt-4 text-red-500">Error: Unknown action type</div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default AdminOperations;
