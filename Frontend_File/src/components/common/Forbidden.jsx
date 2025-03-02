/* eslint-disable no-unused-vars */
import React from "react";

const Forbidden = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg shadow-gray-400 max-w-lg w-full">
        <p className="text-2xl mt-4 font-semibold text-gray-800">
          Oops! Unauthorized Access
        </p>
        <p className="mt-4 mb-6 text-lg text-gray-500">
          Sorry, you don&#39;t have permission to view this page. Please move back
        </p>
        <a
          href="/www.bookito.com/homePage"
          className="customeApplicationButton w-full"
        >
          Go back
        </a>
      </div>
    </div>
  );
};

export default Forbidden;
