/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import Swal from "sweetalert2";
import { FaEraser, FaIdCard } from "react-icons/fa";
import { SpinnerAnimation } from "../common/Spinner";
import { toast, ToastContainer } from "react-toastify";


const AddDriver = () => {
  const nav = useNavigate();
  const [customLoading, setcustomLoading] = useState(false);

  const [error, setError] = useState("");

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordHashRef = useRef();
  const phoneNumberRef = useRef();
  const licenseNumberRef = useRef();
  const config = window.labelConfig.addDriver;

  const validateForm = () => {
    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const passwordHash = passwordHashRef.current.value.trim();
    const phoneNumber = phoneNumberRef.current.value.trim();
    const licenseNumber = licenseNumberRef.current.value.trim();

    if (!/\S+@\S+\.\S+/.test(email) || !email.endsWith("@gmail.com")) {
      setError(config.invalidEmail);
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(passwordHash)) {
      setError(config.invalidPassword);
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError(config.invalidPhone);
      return false;
    }

    const licenseRegex = /^[A-Za-z]{3}\d{4}$/;
    if (!licenseRegex.test(licenseNumber)) {
      setError(config.invalidLicense);
      return false;
    }

    const nameRegex = /^[A-Za-z]{2,}$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError(config.invalidName);
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();

    if (!validateForm()) return;

    const updatedData = {
      firstName: firstNameRef.current.value.trim(),
      lastName: lastNameRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      passwordHash: passwordHashRef.current.value.trim(),
      phoneNumber: phoneNumberRef.current.value.trim(),
      role: "Driver",
      driverDTO: {
        licenseNumber: licenseNumberRef.current.value.trim(),
        availability: true,
      },
    };
    setcustomLoading(true);

    setTimeout(async () => {
      try {
        const addedDriver = await register(updatedData);
        setcustomLoading(false);
        if (addedDriver.status === 201) {
          Swal.fire({
            title: "Success!",
            text: config.successMessage,
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
          });

          setTimeout(() => {
            nav("/www.bookito.com/homePage");
          }, 3000);
        } else {
          Swal.fire({
            title: "Error!",
            text: config.errorMessage,
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
          });
          setError(addedDriver.data.body);
        }
      } catch (error) {
        toast.error(error.response?.data.body ||"Failed to add driver!Try Again Later")
        setcustomLoading(false);
      }
    }, 2000);
  };

  const clearForm = () => {
    setError("");
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    emailRef.current.value = "";
    passwordHashRef.current.value = "";
    phoneNumberRef.current.value = "";
    licenseNumberRef.current.value = "";
    firstNameRef.current.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row justify-center items-center">
    <ToastContainer/>
      {customLoading && <SpinnerAnimation />}
      <div className="hidden lg:block lg:w-1/2 p-8">
        <div className="bg-white rounded-lg shadow-xl">
          <img
            src="../../../Illustration/driverContract.png"
            alt="Driver Registration"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-xl lg:w-1/2 rounded-lg p-8 mt-8 lg:-mt-3 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center italic text-gray-800 mb-6">
          <FaIdCard className="inline text-[#ee8c0a] mr-1" />
          {config.title}
          
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                {config.firstName}
              </label>
              <input
                maxLength={40}
                id="firstName"
                type="text"
                ref={firstNameRef}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                {config.lastName}
              </label>
              <input
                maxLength={40}
                id="lastName"
                type="text"
                ref={lastNameRef}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                {config.email}
              </label>
              <input
                maxLength={40}
                id="email"
                type="email"
                ref={emailRef}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                {config.phoneNumber}
              </label>
              <input
                maxLength={10}
                minLength={10}
                id="phoneNumber"
                type="text"
                ref={phoneNumberRef}
                required
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {config.password}
            </label>
            <input
              minLength={6}
              maxLength={40}
              id="passwordHash"
              type="password"
              ref={passwordHashRef}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {config.licenseNumber}
            </label>
            <input
              maxLength={7}
              minLength={7}
              id="licenseNumber"
              type="text"
              ref={licenseNumberRef}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">
              <FaEraser className="inline mr-1" /> {error}
            </div>
          )}

          <div className="mb-6 flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#ee8c0a] text-white rounded-lg hover:bg-white hover:text-[#ee8c0a] hover:border-[#ee8c0a] border-2"
            >
              {config.registerButton}
            </button>

            <button
              type="button"
              className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-white border-2 hover:text-gray-600 hover:border-gray-500 focus:outline-none"
              onClick={clearForm}
            >
              {config.clearButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
