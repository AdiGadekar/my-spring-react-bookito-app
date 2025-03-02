/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { viewAllTaxis, updateTaxiDetails } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import { FaBook, FaEdit, FaSort, FaTaxi, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { PageLoadingSpinnerAnimation } from "../common/Spinner";

function AllTaxis() {
  const [taxis, setTaxis] = useState([]);
  const [filteredTaxis, setFilteredTaxis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customLoading, setcustomLoading] = useState(true);
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const recordsPerPage = 5;

  const modelRef = useRef(null);
  const colorRef = useRef(null);
  const pricePerKmRef = useRef(null);

  useEffect(() => {
    const fetchTaxis = async () => {
      try {
        const response = await viewAllTaxis();
        setTaxis(response.data.body);
        setFilteredTaxis(response.data.body.reverse());
        setcustomLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTaxis();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = taxis.filter(
      (taxi) =>
        taxi.model.toLowerCase().includes(query.trim()) ||
        taxi.pricePerKm.toString().includes(query.trim()) ||
        taxi.numberPlate.toLowerCase().includes(query.trim()) ||
        formatDate(taxi.createdAt).toLowerCase().includes(query.trim())
    );
    setFilteredTaxis(filtered);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTaxis = () => {
    return filteredTaxis.sort((a, b) => {
      const isAsc = order === "asc";
      if (orderBy === "model") {
        return isAsc
          ? a.model.localeCompare(b.model)
          : b.model.localeCompare(a.model);
      }
      if (orderBy === "pricePerKm") {
        return isAsc
          ? a.pricePerKm - b.pricePerKm
          : b.pricePerKm - a.pricePerKm;
      }
      return 0;
    });
  };

  const handleDelete = () => {
    toast.error("Delete functionality is disabled by Super Admin!!!");
  };

  const openModal = (taxi) => {
    setSelectedTaxi(taxi);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const updatedData = {
      model: modelRef.current.value.trim(),
      color: colorRef.current.value.trim(),
      pricePerKm: parseFloat(pricePerKmRef.current.value),
    };

    try {
      const response = await updateTaxiDetails(
        selectedTaxi.taxiId,
        updatedData
      );
      if (response.status === 200) {
        const updatedTaxis = taxis.map((taxi) =>
          taxi.taxiId === selectedTaxi.taxiId
            ? { ...taxi, ...updatedData }
            : taxi
        );
        setTaxis(updatedTaxis);
        setFilteredTaxis(updatedTaxis);

        Swal.fire({
          title: "Success!",
          text: "Taxi Details Updated Successfully!!!",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
        });

        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
        toast.error(
          "Failed to Update Taxi Details. Please try again!!" +
            response.data.body
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data.body || "An error occurred. Please try again."
      );
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedTaxis().slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTaxis.length / recordsPerPage)
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-6">
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-4xl font-semibold italic text-slate-900 mb-6">
          <FaTaxi className="inline text-[#ee8c0a] text-3xl mb-1" /> Taxis
        </h2>
        <ToastContainer />
        {customLoading && <PageLoadingSpinnerAnimation />}
        {/* Search */}
        <div className="mb-4  flex flex-wrap gap-2">
          <input
            maxLength={40}
            type="text"
            className="px-4 py-2 w-96 border rounded-md flex-1 sm:flex-initial text-[#00509E]"
            placeholder="Search by number plate, model, price or date"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <h2 className="text-xl  font-semibold italic text-slate-900 mt-1">
            <FaBook className="inline text-[#ee8c0a] text-3xl mb-1 mr-1" />
            Total Record:
            <p className="underline inline">{filteredTaxis.length}</p>
          </h2>
        </div>

        {/* Table */}
        {filteredTaxis.length === 0 ? (
          <div className="flex justify-center items-center text-center py-10">
            <span className="text-5xl mb-2">📭</span>
            <p className="text-xl font-medium">No Data Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border-2 border-[#ee8c0a]">
              <thead>
                <tr className="bg-gray-100 text-[#00509E]">
                  <th className="px-4 py-2 text-left">Number Plate</th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleRequestSort("model")}
                  >
                    Car Model <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-left">Car Color</th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleRequestSort("pricePerKm")}
                  >
                    Price Per Km <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  <th className="px-4 py-2 text-left">Enrollment Date</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((taxi) => (
                  <tr key={taxi.taxiId} className="border-b">
                    <td className="px-4 py-2">{taxi.numberPlate}</td>
                    <td className="px-4 py-2">{taxi.model}</td>
                    <td className="px-4 py-2">{taxi.color}</td>
                    <td className="px-4 py-2">₹{taxi.pricePerKm.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          taxi.availability
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {taxi.availability ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatDate(taxi.createdAt)}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="px-4 py-2 bg-[#ee8c0a] text-white rounded-lg hover:bg-orange-700"
                        onClick={() => openModal(taxi)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className=" hover:cursor-not-allowed px-4 mx-2 py-2 bg-[#ee8c0a] text-white rounded-lg hover:bg-orange-700"
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
        {filteredTaxis.length > 0 && (
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

      {isModalOpen && selectedTaxi && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Update Taxi</h3>
            <div className="mb-4">
              <label className="block mb-1">Model</label>
              <input
                maxLength={40}
                ref={modelRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedTaxi.model}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Color</label>
              <input
                maxLength={40}
                ref={colorRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedTaxi.color}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Price Per Km</label>
              <input
                min={10}
                max={100}
                minLength={1}
                maxLength={3}
                ref={pricePerKmRef}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={selectedTaxi.pricePerKm}
              />
            </div>

            <div className="flex justify-end gap-4">
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

      <ToastContainer />
    </div>
  );
}

export default AllTaxis;
