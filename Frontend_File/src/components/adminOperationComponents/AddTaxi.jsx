/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { registerTaxi } from "../../services/api";
import Swal from "sweetalert2";
import { FaEraser, FaTaxi } from "react-icons/fa";
import { SpinnerAnimation } from "../common/Spinner";
import { toast, ToastContainer } from "react-toastify";

const AddTaxi = () => {
  const nav = useNavigate();
  const [customLoading, setcustomLoading] = useState(false);

  const [error, setError] = useState("");

  const numberPlateRef = useRef();
  const modelRef = useRef();
  const colorRef = useRef();
  const pricePerKmRef = useRef();
  const config = window.labelConfig.addTaxi;

  // useEffect(() => {
  //   throw new Error('Crashed!!!!');
  // }, [])

  const validateForm = () => {
    const numberPlate = numberPlateRef.current.value.trim();
    const model = modelRef.current.value.trim();
    const color = colorRef.current.value.trim();
    const pricePerKm = pricePerKmRef.current.value.trim();

    if (!numberPlate || !model || !color || !pricePerKm) {
      setError("All fields are required.");
      return false;
    }

    if (isNaN(pricePerKm) || parseFloat(pricePerKm) <= 0) {
      setError(config.invalidPrice);
      return false;
    }

    const numberPlateRegex = /^[A-Za-z]{2}\s\d{2}\s[A-Za-z]{2}\s\d{4}$/;
    if (!numberPlateRegex.test(numberPlate)) {
      setError(config.invalidNumberPlate);
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
      numberPlate: numberPlateRef.current.value.trim(),
      model: modelRef.current.value.trim(),
      color: colorRef.current.value.trim(),
      pricePerKm: parseFloat(pricePerKmRef.current.value),
      availability: true,
    };
    setcustomLoading(true);

    setTimeout(async () => {
      try {
        const addedTaxi = await registerTaxi(updatedData);
        setcustomLoading(false);
        if (addedTaxi.status === 201) {
          Swal.fire({
            title: "Success!",
            text: config.successMessage,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "custom-confirm-button",
            },
            timer: 3000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            nav("/www.bookito.com/homePage");
          }, 3000);
        } else {
          //
          setError(addedTaxi.data.body);
          Swal.fire({
            title: "Error!",
            text: config.errorMessage,
            icon: "error",
            timer: 2000,
            confirmButtonText: "Try Again",
          });
        }
      } catch (error) {
        toast.error(error.response?.data.body ||"Failed to add Taxi! Try Again Later");
        setcustomLoading(false);
      }
    }, 2000);
  };

  const clearForm = () => {
    setError("");
    numberPlateRef.current.value = "";
    modelRef.current.value = "";
    colorRef.current.value = "";
    pricePerKmRef.current.value = "";
    numberPlateRef.current.focus();
  };
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col lg:flex-row justify-center items-center ">
      <ToastContainer />
      {customLoading && <SpinnerAnimation />}
      <div className="hidden lg:block lg:w-1/2 p-8">
        <div className="bg-white rounded-lg shadow-xl">
          <img
            src="../../../Illustration/undrawBG.png"
            alt="Dynamic Pricing Model"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-xl lg:w-1/2 rounded-lg p-8 mt-8 lg:-mt-3 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center italic text-gray-800 mb-6">
          <FaTaxi className="inline text-[#ee8c0a] mr-1" />
          {config.title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {config.numberPlate}
            </label>
            <input
              maxLength={13}
              minLength={13}
              id="numberPlate"
              type="text"
              ref={numberPlateRef}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {config.model}
            </label>
            <input
              maxLength={40}
              id="model"
              type="text"
              ref={modelRef}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {config.color}
            </label>
            <input
              maxLength={40}
              id="color"
              type="text"
              ref={colorRef}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {config.pricePerKm}
            </label>
            <input
              min={10}
              max={100}
              minLength={1}
              maxLength={3}
              id="pricePerKm"
              type="number"
              ref={pricePerKmRef}
              required
              step="0.01"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">
              <FaEraser className="inline mr-1" /> {error}
            </div>
          )}

          <div className="mb-6 flex flex-col space-x-0 space-y-3 lg:space-y-0 lg:flex-row lg:space-x-3">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#ee8c0a] text-white rounded-lg hover:bg-white hover:text-[#ee8c0a] hover:border-[#ee8c0a] border-2 focus:outline-none"
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

export default AddTaxi;
