import React, { useState, useEffect,} from "react";
import { getAllBookingHistory } from "../../services/api";
import { FaBook, FaHistory, FaSort } from "react-icons/fa";
import { PageLoadingSpinnerAnimation } from "../common/Spinner";

function BookingHistory() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [customLoading, setcustomLoading] = useState(true);

  const recordsPerPage = 5;
  const config = window.labelConfig.bookingHistory;

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const history = await getAllBookingHistory();
        setBookingHistory(history.data.body.reverse());
        setFilteredHistory(history.data.body.reverse());
        setcustomLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookingHistory();
  }, []);

  useEffect(() => {
    let filteredData = [...bookingHistory];

    if (searchTerm) {
      filteredData = filteredData.filter(
        (booking) =>
          booking.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          booking.pickupLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          booking.dropoffLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          booking.taxiNumberPlate
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          formatDate(booking.createdAt)
            .toLocaleLowerCase()
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
        (booking) => booking.paymentStatus === filterPaymentStatus
      );
    }

    filteredData.sort((a, b) => {
      let valueA, valueB;

      if (sortField === "amount") {
        valueA = a.amount;
        valueB = b.amount;
      } else if (sortField === "createdAt") {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      } else {
        valueA = a.bookingId;
        valueB = b.bookingId;
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

    setFilteredHistory(filteredData);
    setCurrentPage(1);
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

  const currentRecords = Array.isArray(filteredHistory)
    ? filteredHistory.slice(indexOfFirstRecord, indexOfLastRecord)
    : [];

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / recordsPerPage)
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <React.Fragment>
      <div className="min-h-screen bg-[#f7f7f7] py-6">
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-4xl font-semibold italic text-slate-900 mb-6">
            <FaHistory className="inline text-[#ee8c0a] text-3xl mb-1 mr-1" />
            {config.title}
          </h2>
          {customLoading && <PageLoadingSpinnerAnimation />}
          {/* Search and Filter */}
          <div className="mb-4 flex flex-wrap gap-5">
            <input
              maxLength={40}
              type="text"
              className="px-4 w-96 py-2 border rounded-md flex-1 sm:flex-initial text-[#00509E]"
              placeholder={config.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <select
              className="px-4 py-2 border rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">{config.filters.status.all}</option>
              <option value="Completed">
                {config.filters.status.completed}
              </option>
              <option value="Cancelled">
                {config.filters.status.cancelled}
              </option>
            </select>
            <select
              className="px-4 py-2 border rounded-md"
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
            >
              <option value="All">{config.filters.paymentStatus.all}</option>
              <option value="Completed">
                {config.filters.paymentStatus.completed}
              </option>
              <option value="Cancelled">
                {config.filters.paymentStatus.cancelled}
              </option>
              <option value="Pending">
                {config.filters.paymentStatus.pending}
              </option>
            </select>
            <h2 className="text-xl  font-semibold italic text-slate-900 mt-1">
              <FaBook className="inline text-[#ee8c0a] text-3xl mb-1 mr-1" />
              Total Record:<p className="underline inline">{filteredHistory.length}</p>
            </h2>
          </div>

          {/* Table */}
          <div className=" overflow-x-auto">
            <table className="w-full table-auto border-2 border-[#ee8c0a]">
              <thead>
                <tr className="bg-gray-100 text-[#00509E]">
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSortChange("customerName")}
                  >
                    {config.tableHeaders.customerName}
                    <FaSort className="inline" />
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer "
                    onClick={() => handleSortChange("driverName")}
                  >
                    {config.tableHeaders.driverName}
                    <FaSort className="inline" />
                  </th>

                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSortChange("pickupLocation")}
                  >
                    {config.tableHeaders.pickupLocation}
                    <FaSort className="inline" />
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSortChange("dropoffLocation")}
                  >
                    {config.tableHeaders.dropoffLocation}
                    <FaSort className="inline" />
                  </th>

                  <th className="px-4 py-2 text-left cursor-pointer whitespace-nowrap">
                    {config.tableHeaders.taxiNumberPlate}
                  </th>
                  <th className="px-4 py-2 text-center">
                    {config.tableHeaders.status}
                  </th>
                  <th className="px-4 py-2 text-center whitespace-nowrap">
                    {config.tableHeaders.bookingDate}
                  </th>
                  <th
                    className="px-4 py-2 text-center cursor-pointer"
                    onClick={() => handleSortChange("amount")}
                  >
                    {config.tableHeaders.amount} <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-center">
                    {config.tableHeaders.paymentMethod}
                  </th>
                  <th className="px-4 py-2 text-center">
                    {config.tableHeaders.paymentStatus}
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center px-4 py-6 text-gray-500"
                    >
                      <span className="text-5xl mb-2">📭</span>
                      <p className="text-xl font-medium">No Data Found</p>
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((booking) => (
                    <tr key={booking.bookingId} className="border-b">
                      <td className="px-4 py-2">{booking.customerName}</td>
                      <td className="px-4 py-2">{booking.driverName}</td>
                      <td className="px-4 py-2">{booking.pickupLocation}</td>
                      <td className="px-4 py-2">{booking.dropoffLocation}</td>
                      <td className="px-4 py-2">{booking.taxiNumberPlate}</td>
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
                      <td className="px-4 py-2">₹{booking.amount}</td>
                      <td className="px-4 py-2">{booking.paymentMethod}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            booking.paymentStatus === "Pending"
                              ? "bg-yellow-200 text-yellow-700"
                              : booking.paymentStatus === "Cancelled"
                                ? "bg-red-200 text-red-700"
                                : "bg-green-200 text-green-700"
                          }`}
                        >
                          {booking.paymentStatus}
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
