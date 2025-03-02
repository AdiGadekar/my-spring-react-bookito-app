/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getBookingHistory } from "../../services/api";
import useAuthData from "../../services/useAuthData";
import { FaHistory, FaSort } from "react-icons/fa";
import { PageLoadingSpinnerAnimation } from "../common/Spinner";

function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [customLoading, setcustomLoading] = useState(true);

  const recordsPerPage = 5;

  const { loading, loginResult } = useAuthData();

  useEffect(() => {
    if (!loading && loginResult && loginResult.userId) {
      const userId = loginResult.userId;

      const fetchBookingHistory = async () => {
        try {
          const history = await getBookingHistory(userId);
          setBookingHistory(history.data.body);
          setFilteredHistory(history.data.body);
          setcustomLoading(false);
        } catch (error) {
          setcustomLoading(true);
        }
      };

      fetchBookingHistory();
    }
  }, [loading, loginResult]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHistory]);

  useEffect(() => {
    let filteredData = [...bookingHistory];

    if (searchTerm) {
      filteredData = filteredData.filter(
        (booking) =>
          booking.pickupLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          booking.dropoffLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          formatDate(booking.createdAt)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      );
    }

    if (filterStatus !== "All") {
      filteredData = filteredData.filter(
        (booking) => booking.status === filterStatus
      );
    }

    if (filterPaymentStatus !== "All") {
      filteredData = filteredData.filter(
        (booking) => booking.paymentDTO.paymentStatus === filterPaymentStatus
      );
    }

    filteredData.sort((a, b) => {
      let valueA, valueB;

      if (sortField === "amount") {
        valueA = a.paymentDTO.amount;
        valueB = b.paymentDTO.amount;
      } else {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

    setFilteredHistory(filteredData);
  }, [
    searchTerm,
    filterStatus,
    filterPaymentStatus,
    sortOrder,
    sortField,
    bookingHistory,
  ]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHistory.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / recordsPerPage)
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <div>Loading booking history...</div>;

  return (
    <React.Fragment>
      <div className="min-h-screen bg-[#f7f7f7] py-6">
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold italic text-slate-900 mb-6">
            <FaHistory className="inline mr-1 " />
            Booking History
          </h2>
          {customLoading && <PageLoadingSpinnerAnimation />}
          {/* Search and Filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              maxLength={40}
              type="text"
              className="px-4 py-2 border rounded-md flex-1 sm:flex-initial text-[#00509E]"
              placeholder="Search by locations or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              className="px-4 py-2 border rounded-md"
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
            >
              <option value="All">All Payment Status</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Table */}
          <div className=" overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-[#00509E]">
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    Booking ID
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Pickup Location
                  </th>
                  <th className="px-4 py-2 text-left whitespace-nowrap">
                    Dropoff Location
                  </th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th
                    className="px-4 py-2 text-center cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      setSortField("date");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Booking Date <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-center ">Payment Method</th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      setSortField("amount");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    Payment Amount <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-center ">Payment Status</th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center px-4 py-6 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <span className="text-5xl">📭</span>
                        <p>No Data Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((booking) => (
                    <tr key={booking.bookingId} className="border-b">
                      <td className="px-4 py-2 text-[#00509E] font-medium">
                        BKID{booking.bookingId}
                      </td>
                      <td className="px-4 py-2">
                        {booking.pickupLocation === "??Current location"
                          ? "📍Current location"
                          : booking.pickupLocation}
                      </td>
                      <td className="px-4 py-2">{booking.dropoffLocation}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            booking.status === "Completed"
                              ? "bg-green-200 text-green-700"
                              : booking.status === "Cancelled"
                                ? "bg-red-200 text-red-700"
                                : "bg-yellow-200 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-4 py-2">
                        {booking.paymentDTO.paymentMethod}
                      </td>
                      <td className="px-4 py-2">
                        ₹ {booking.paymentDTO.amount}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            booking.paymentDTO.paymentStatus === "Pending"
                              ? "bg-yellow-200 text-yellow-700"
                              : booking.paymentDTO.paymentStatus === "Cancelled"
                                ? "bg-red-200 text-red-700"
                                : "bg-green-200 text-green-700"
                          }`}
                        >
                          {booking.paymentDTO.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredHistory.length > 0 && (
            <div className="mt-4">
              <button
                className="customeApplicationButton"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="customeApplicationButton"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default BookingHistory;
