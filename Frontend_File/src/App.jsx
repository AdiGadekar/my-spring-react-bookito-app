import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Customer_Register";
import Login from "./pages/User_Login";
import HomePage from "./pages/Home_Page";
import AdminOperations from "./pages/Operation_Admin";
import Operation_Customer from "./pages/Operation_Customer";
import Operation_Driver from "./pages/Operation_Driver";
import CustomerTaxiBooking from "./pages/CustomerTaxiBooking";
import Forbidden from "./components/common/Forbidden";
import NotFound from "./components/common/NotFound";
import WhyBookiTo from "./components/common/WhyBookiTo";
import ErrorBoundary from "./components/ErrorBoundry";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/www.bookito.com/login"
            element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            }
          />
          <Route
            path="/www.bookito.com/register"
            element={
              <ErrorBoundary>
                <Register />
              </ErrorBoundary>
            }
          />{" "}
          <Route
            path="/www.bookito.com/homePage"
            element={
              <ErrorBoundary>
                <ProtectedRoute role={["Customer", "Admin", "Driver"]}>
                  <HomePage />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />
          <Route
            path="/www.bookito.com/about"
            element={
              <ProtectedRoute role={["Customer","Admin"]}>
                <ErrorBoundary>
                  <WhyBookiTo />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/www.bookito.com/customerTaxiBooking"
            element={
              <ProtectedRoute role={["Customer"]}>
                <ErrorBoundary>
                  <CustomerTaxiBooking />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/www.bookito.com/adminOperations"
            element={
              <ProtectedRoute role={["Admin"]}>
                <AdminOperations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/www.bookito.com/operationCustomer"
            element={
              <ProtectedRoute role={["Customer"]}>
                <Operation_Customer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/www.bookito.com/operationDriver"
            element={
              <ProtectedRoute role={["Driver"]}>
                <Operation_Driver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/www.bookito.com/forbidden"
            element={
              <ErrorBoundary>
                <Forbidden />
              </ErrorBoundary>
            }
          />
          <Route
            path="/www.bookito.com/notFound"
            element={
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/www.bookito.com/notFound" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
