import { useState, useEffect } from "react";
import { getAllCustomer } from "../../services/api";
import { FaBook, FaSort, FaTrashAlt, FaUserCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { PageLoadingSpinnerAnimation } from "../common/Spinner";

function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortField, setSortField] = useState();
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const config = window.labelConfig.allCustomers;
  const [customLoading, setcustomLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomer();
        setCustomers(response.data.body.reverse());
        setcustomLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear]);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearchTerm =
        customer.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        (customer.firstName + " " + customer.lastName)
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        customer.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        customer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim()) ||
        formatDate(customer.createdAt)
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim());

      const customerYear = new Date(customer.createdAt).getFullYear();
      const matchesYear =
        selectedYear === "All" || customerYear === parseInt(selectedYear);

      return matchesSearchTerm && matchesYear;
    })
    .sort((a, b) => {
      let valueA, valueB;

      if (sortField === "name") {
        valueA = a.firstName.toLowerCase();
        valueB = b.firstName.toLowerCase();
      } else {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCustomers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / recordsPerPage)
  );

  const handleDelete = () => {
    toast.error(config.deleteAction.toastMessage);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-6">
      {customLoading && <PageLoadingSpinnerAnimation />}
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-4xl font-semibold italic text-slate-900 mb-6">
          <FaUserCheck className="inline text-[#ee8c0a] text-3xl mb-1 mr-1" />{" "}
          {config.title}
        </h2>

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            maxLength={40}
            type="text"
            className="px-4 w-80 py-2 border rounded-md flex-1 sm:flex-initial text-[#00509E]"
            placeholder={config.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">{config.years.all}</option>
            <option value="2025">{config.years.twentyFive}</option>
            <option value="2024">{config.years.twentyFour}</option>
            <option value="2023">{config.years.twentyThree}</option>
          </select>
          <h2 className="text-xl  font-semibold italic text-slate-900 mt-1">
            <FaBook className="inline text-[#ee8c0a] text-3xl mb-1 mr-1" />
            Total Record:
            <p className="underline inline">{filteredCustomers.length}</p>
          </h2>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="flex justify-center items-center text-center py-10">
            <span className="text-5xl mb-2">{config.noDataMessage.icon}</span>
            <p className="text-xl font-medium">{config.noDataMessage.text}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border-2 border-[#ee8c0a]">
              <thead>
                <tr className="bg-gray-100 text-[#00509E]">
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => {
                      setSortField("name");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    {config.tableHeaders.customerName}{" "}
                    <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-left">
                    {config.tableHeaders.email}
                  </th>
                  <th className="px-4 py-2 text-left">
                    {config.tableHeaders.phoneNumber}
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => {
                      setSortField("createdAt");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    {config.tableHeaders.createdAt}{" "}
                    <FaSort className="inline" />
                  </th>
                  <th className="px-4 py-2 text-center">
                    {config.tableHeaders.actions}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentRecords.map((customer) => (
                  <tr key={customer.userId} className="border-b">
                    <td className="px-4 py-2">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-4 py-2">{customer.email}</td>
                    <td className="px-4 py-2">{customer.phoneNumber}</td>
                    <td className="px-4 py-2">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-2 text-center">
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

        {filteredCustomers.length > 0 && (
          <div className="mt-4">
            <button
              className="customeApplicationButton"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {config.pagination.previous}
            </button>
            <span className="mx-2">
              {config.pagination.page} {currentPage} {config.pagination.of}{" "}
              {totalPages}
            </span>
            <button
              className="customeApplicationButton"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {config.pagination.next}
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AllCustomers;
