/* eslint-disable react/prop-types */
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center bg-gray-100">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg w-96">
            
            <h1 className="text-2xl font-semibold text-gray-800">
            <FaExclamationTriangle className="inline mx-2 text-red-600 text-4xl mb-4" />
              Something Went Wrong
            </h1>
            <p className="text-gray-600 mt-2">
              We encountered an issue while processing your request. Please try
              again later.
            </p> 
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
