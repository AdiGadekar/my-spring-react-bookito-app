/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import useAuthData from "../../services/useAuthData";
import { getUserById, updateUserDetail } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { FaEraser, FaUser } from "react-icons/fa";
import {
  PageLoadingSpinnerAnimation,
  SpinnerAnimation,
} from "../common/Spinner";

const ViewProfile = ({ userData }) => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getUserById(userData.userId);
        if (response.status === 200) {
          setCustomerDetails(response.data.body);
        } else {
          setCustomerDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user or taxi details:", error);
      }
    };

    fetchDetails();
  }, [userData]);

  const openModal = () => {
    setError("");
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    const updatedData = {
      firstName: firstNameRef.current.value.trim(),
      lastName: lastNameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      phoneNumber: phoneNumberRef.current.value.trim(),
    };

    const isValid = validateData(updatedData);
    if (isValid !== "Valid") {
      setIsModalOpen(true);
      setError(isValid);
      return;
    }

    try {
      const response = await updateUserDetail(
        customerDetails.userId,
        updatedData
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Profile Updated Successfully!",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        customerDetails.firstName = updatedData.firstName;
        customerDetails.lastName = updatedData.lastName;
        customerDetails.email = updatedData.email;
        customerDetails.phoneNumber = updatedData.phoneNumber;

        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
        setError(response.data.body);
        toast.error("Failed to update profile", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        autoClose: 1000,
      });
      console.log(error.response)
      if (error.response.status === 400) {
        setError(error.response.data.body);
      }
    }
  };

  const validateData = (data) => {
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(data.firstName) || !nameRegex.test(data.lastName)) {
      return "Invalid Name";
    }
    if (!emailRegex.test(data.email)) {
      return "Invalid Gmail-id";
    }
    if (!phoneRegex.test(data.phoneNumber)) {
      return "Invalid Phone Number";
    }
    return "Valid";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col lg:flex-row items-center justify-center lg:items-center">
      <div className="lg:flex lg:hover:scale-95 duration-300 shadow-lg lg:items-start hidden md:block lg:w-2/5">
        <img
          src="../../../Illustration/updateUndraw.png"
          alt="Profile"
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <div className="w-full lg:w-3/5 bg-white p-8 rounded-lg shadow-md overflow-x-auto">
        {customerDetails ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800">
              <FaUser className="inline bg-gray-800 p-1 rounded-full text-4xl mb-1 mr-1 text-[#ee8c0a]" />
              {`${customerDetails.firstName} ${customerDetails.lastName}`}
            </h1>

            <div className="space-y-6 justify-center text-lg mt-4">
              <p>
                <strong>User ID:</strong> user_AB{customerDetails.userId}
              </p>
              <p>
                <strong>Email:</strong> {customerDetails.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {customerDetails.phoneNumber}
              </p>
              <div className="lg:flex lg:flex-row lg:space-x-20">
                <p>
                  <strong>Account Created:</strong>{" "}
                  {new Date(customerDetails.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Age:</strong> 22
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={openModal}
                className="bg-[#ee8c0a] text-white hover:bg-white hover:text-[#ee8c0a] hover:border-[#ee8c0a] border-2 focus:outline-none py-2 px-6 rounded-lg transition text-lg"
              >
                Update Profile
              </button>
            </div>
          </>
        ) : (
          <div>
            <PageLoadingSpinnerAnimation />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
            <div className="mb-4">
              <label className="block mb-1">First Name</label>
              <input
                maxLength={40}
                ref={firstNameRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={customerDetails.firstName}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Last Name</label>
              <input
                maxLength={40}
                ref={lastNameRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={customerDetails.lastName}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                maxLength={40}
                ref={emailRef}
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={customerDetails.email}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Phone Number</label>
              <input
                maxLength={10}
                minLength={8}
                ref={phoneNumberRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                defaultValue={customerDetails.phoneNumber}
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

      <ToastContainer />
    </div>
  );
};

export default ViewProfile;
