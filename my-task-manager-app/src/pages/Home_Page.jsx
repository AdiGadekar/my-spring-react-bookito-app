import React, {  } from "react";
import AdminNavbar from "../components/navbarComponents/AdminNavbar";
import CustomerNavbar from "../components/navbarComponents/CustomerNavbar";
import DriverNavbar from "../components/navbarComponents/DriverNavbar";
import CustomerDashboard from "../components/dashboardComponents/CustomerDashboard";
import DriverDashboard from "../components/dashboardComponents/DriverDashboard";
import AdminDashboard from "../components/dashboardComponents/AdminDashboard";
import useAuthData from "../services/useAuthData";
import NewsTicker from "../components/common/NewsTicker";
import UserTestimonials from "../components/common/UserTestimonials";
import Footer from "../components/common/Footer";
import ClientsCarousel from "../components/common/ClientsCarousel";
import ErrorBoundary from "../components/ErrorBoundry";

function HomePage() {
  const { loading: authLoading, loginResult } = useAuthData();
  const userData = loginResult;


  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!loginResult) {
    return <div>Error: Unauthorized access!</div>;
  }

  const role = loginResult.role;

  const renderUI = () => {
    let navbar;
    let dashboard;

    switch (role) {
      case "Admin":
        navbar = <AdminNavbar />;
        dashboard = <AdminDashboard />;
        break;
      case "Customer":
        navbar = <CustomerNavbar />;
        dashboard = <CustomerDashboard />;
        break;
      case "Driver":
        navbar = <DriverNavbar />;
        dashboard = <DriverDashboard loginResult={userData} />;
        break;
      default:
        navbar = null;
        dashboard = <div>Role not recognized</div>;
    }

    return (
      <React.Fragment>
        {navbar}
        <div className="container mx-auto mt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-6">
            <div className="md:col-span-2">
              {dashboard}
              {loginResult.role === "Admin" ? (
                <ErrorBoundary>
                  <UserTestimonials />
                </ErrorBoundary>
              ) : (
                <></>
              )}
            </div>
            <div>
              {loginResult.role === "Driver" ? (
                <ErrorBoundary>
                  <UserTestimonials />
                </ErrorBoundary>
              ) : (
                <ErrorBoundary>
                  <NewsTicker />
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
        {loginResult.role === "Customer" ? <ClientsCarousel /> : <></>}
        <Footer />
      </React.Fragment>
    );
  };

  return renderUI();
}

export default HomePage;
