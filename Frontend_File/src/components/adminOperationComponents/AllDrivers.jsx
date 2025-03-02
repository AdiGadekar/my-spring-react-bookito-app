/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { getAllDriver, updateUserDetail } from "../../services/api";
import { FaBook, FaEdit, FaEraser, FaIdCard, FaSort, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { PageLoadingSpinnerAnimation } from "../common/Spinner";

function AllDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("firstName");
  const [error, setError] = useState("");
  const [customLoading, setcustomLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await getAllDriver();
        setDrivers(response.data.body.reverse());
        setFilteredDrivers(response.data.body.reverse());
        setcustomLoading(false);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter((driver) =>
        [
          driver.firstName,
          driver.lastName,
          driver.email,
          formatDate(driver.createdAt),
          driver.driverDTO.licenseNumber,
        ]
          .join(" ")
          .toLowerCase()
          .trim()
          .includes(query)
      );
      setFilteredDrivers(filtered);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedDrivers = () => {
    return filteredDrivers.sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "firstName") {
        return isAsc
          ? a.firstName.localeCompare(b.firstName)
          : b.firstName.localeCompare(a.firstName);
      }
      if (orderBy === "email") {
        return isAsc
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }
      return 0;
    });
  };

  const openModal = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const updatedData = {
      firstName: firstNameRef.current.value.trim(),
      lastName: lastNameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      phoneNumber: phoneNumberRef.current.value.trim(),
    };
    if (
      !/\S+@\S+\.\S+/.test(updatedData.email) ||
      !updatedData.email.endsWith("@gmail.com")
    ) {
      setError('Please provide a valid email address from "@gmail.com"');
      return;
    }

    if (updatedData.phoneNumber.length !== 10) {
      setError("Please provide a valid 10 digit Phone number ");
      return;
    }
    try {
      const response = await updateUserDetail(
        selectedDriver.userId,
        updatedData
      );
      if (response.status === 200) {
        const updatedDrivers = drivers.map((driver) =>
          driver.userId === selectedDriver.userId
            ? { ...driver, ...updatedData }
            : driver
        );

        setDrivers(updatedDrivers);
        setFilteredDrivers(updatedDrivers);
        Swal.fire({
          title: "Success!",
          text: "Driver Details Updated Successfully!",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
        });

        setIsModalOpen(false);
      } else {
        setError(response.data.body);
        toast.error("Failed to Update Driver Details. Please try again!");
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data.body ||
          "Failed to Update Driver Details. Please try again!"
      );
      setIsModalOpen(false);
    }
  };

  const handleDelete = () => {
    toast.error("Delete functionality is disabled by Super Admin!");
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedDrivers().slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrivers.length / recordsPerPage)
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-6">
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-4xl font-semibold italic text-slate-900 mb-6">
          <FaIdCard className="inline text-3xl text-[#ee8c0a] mb-1 mr-1" />{" "}
          Drivers
        </h2>
        <ToastContainer />
        {customLoading && <PageLoadingSpinnerAnimation />}
        {/* Search */}
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            maxLength={40}
            type="text"
            className="px-4 py-2 border w-72 rounded-md flex-1 sm:flex-initial text-[#00509E]"
            placeholder="Search by name, email or date"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <h2 className="text-xl  font-semibold italic text-slate-900 mt-1">
            <FaBook className="inline text-[#ee8c0a] text-3xl mb-1 mr-1" />
            Total Record:
            <p className="underline inline">{filteredDrivers.length}</p>
          </h2>
        </div>

        {/* Table */}
        {filteredDrivers.length === 0 ? (
          <div className="flex justify-center items-center text-center py-10">
            <span className="text-5xl mb-2">📭</span>
            <p className="text-xl font-medium">No Data Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border-2 border-[#ee8c0a]">
              <thead>
                <tr className="bg-gray-100 text-[#00509E]">
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleRequestSort("firstName")}
                  >
                    Driver Name <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-left">Email Address</th>
                  <th className="px-4 py-2 text-left">Contact Number</th>
                  <th className="px-4 py-2 text-left">Account Creation Date</th>
                  <th className="px-4 py-2 text-left">License Number</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.map((driver) => (
                  <tr key={driver.driverDTO.driverId} className="border-b">
                    <td className="px-4 py-2">
                      {driver.firstName} {driver.lastName}
                    </td>
                    <td className="px-4 py-2">{driver.email}</td>
                    <td className="px-4 py-2">{driver.phoneNumber}</td>
                    <td className="px-4 py-2">
                      {formatDate(driver.createdAt)}
                    </td>
                    <td className="px-4 py-2">
                      {driver.driverDTO.licenseNumber}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          driver.driverDTO.availability
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {driver.driverDTO.availability
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="px-4 py-2 bg-[#ee8c0a] text-white rounded-lg hover:bg-orange-700"
                        onClick={() => openModal(driver)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="px-4  hover:cursor-not-allowed mx-2 py-2 bg-[#ee8c0a] text-white rounded-lg hover:bg-orange-700"
                        onClick={handleDelete}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredDrivers.length > 0 && (
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Update Driver</h3>

            <div className="mb-4">
              <label className="block mb-1">First Name</label>
              <input
                maxLength={40}
                ref={firstNameRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedDriver.firstName}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Last Name</label>
              <input
                maxLength={40}
                ref={lastNameRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedDriver.lastName}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                maxLength={40}
                ref={emailRef}
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedDriver.email}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Phone Number</label>
              <input
                maxLength={10}
                minLength={10}
                ref={phoneNumberRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedDriver.phoneNumber}
              />
            </div>

            {error && (
              <div className="text-red-600 mb-2">
                <FaEraser className="inline mr-1" /> {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-white border-2 hover:text-gray-600 hover:border-gray-500 focus:outline-none mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#ee8c0a] text-white hover:bg-white hover:text-[#ee8c0a] hover:border-[#ee8c0a] border-2 focus:outline-none rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllDrivers;
