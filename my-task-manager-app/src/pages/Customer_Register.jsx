import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../services/api";
import Footer from "../components/common/Footer";
import { FaEraser } from "react-icons/fa";
import { SpinnerAnimation } from "../components/common/Spinner";

const Register = () => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const nav = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [customLoading, setcustomLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phoneNumber);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phoneNumber = phoneNumberRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();
    const nameRegex = /^[A-Za-z]{2,}$/;

    if (!firstName) {
      setErrorMessage("First Name is required.");
      firstNameRef.current.focus();
      return;
    } else if (!lastName) {
      setErrorMessage("Last Name is required.");
      lastNameRef.current.focus();
      return;
    } else if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setErrorMessage(
        "First Name and Last Name must contain only alphabets and be at least 2 characters long"
      );
      return;
    } else if (!email || !validateEmail(email) || !email.endsWith("@gmail.com")) {
      setErrorMessage("Enter a valid email.");
      emailRef.current.focus();
      return;
    } else if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setErrorMessage("Enter a valid phone number.");
      phoneNumberRef.current.focus();
      return;
    } else if (!password || !validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      passwordRef.current.focus();
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      confirmPasswordRef.current.focus();
      return;
    } else {
      const userData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        passwordHash: password,
        role: "Customer",
      };
      setcustomLoading(true);
      setTimeout(async () => {
        try{
          const addedCustomer = await register(userData);
        setcustomLoading(false);
        setErrorMessage("")
        if (addedCustomer.status === 201) {
          toast.success("Registration Successful!", { autoClose: 800 });
          setTimeout(() => {
            nav("/www.bookito.com/login");
          }, 1200);
        } else {
          setErrorMessage(addedCustomer.data.body);
          toast.warning("Registration Failed!!!", { autoClose: 800 });
        }
        }catch(error){
          setErrorMessage(error.response?.data.body);
          toast.warning(error.response?.data.body ||"Registration Failed!!!", { autoClose: 800 });
        }
      }, 1000);
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="min-h-screen flex mb-10">
        {customLoading === true && <SpinnerAnimation />}
        <div className="flex flex-col lg:flex-row w-full ml-2 mt-2 max-w-screen-xl pb-16 mx-auto">
          <div
            className="w-full lg:w-2/3 h-96 lg:h-screen bg-cover bg-center"
            style={{
              backgroundImage: 'url("../../Illustration/registerundrae.png")',
            }}
          ></div>

          <div className="w-full lg:w-1/2 h-96 lg:h-5/6 flex justify-center items-start min-h-screen bg-white mr-3 mt-2 shadow-gray-400 shadow-xl sm:shadow-2xl sm:rounded-3xl sm:p-6">
            <div className="max-w-md w-full m-2 pb-6">
              {" "}
              <div>
                <h1 className="text-2xl text-[#ee8c0a] font-semibold text-center mb-6">
                  Customer Registration
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="pt-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <form onSubmit={handleFormSubmission}>
                    <div className="lg:flex lg:flex-row flex-col">
                      <div className="relative">
                        <input
                          maxLength={40}
                          type="text"
                          ref={firstNameRef}
                          onChange={(e)=>e.target.value = e.target.value.trim()}
                          className="peer placeholder-gray-400 h-10 w-full max-w-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        />
                        <label
                          htmlFor="firstName"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          First Name
                        </label>
                      </div>

                      <div className="relative mt-6 lg:mt-0 lg:ml-3">
                        <input
                          maxLength={40}
                          type="text"
                          ref={lastNameRef}
                          onChange={(e)=>e.target.value = e.target.value.trim()}
                          className="peer placeholder-gray-400 h-10 w-full max-w-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        />
                        <label
                          htmlFor="lastName"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Last Name
                        </label>
                      </div>
                    </div>

                    <div className="relative mt-6">
                      <input
                        maxLength={40}
                        type="text"
                        ref={emailRef}
                        onChange={(e)=>e.target.value = e.target.value.trim()}
                        className="peer placeholder-gray-400 h-10 w-full max-w-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Email Address
                      </label>
                    </div>
                    <div className="relative mt-6">
                      <input
                        maxLength={10}
                        minLength={10}
                        type="text"
                        ref={phoneNumberRef}
                        onChange={(e)=>e.target.value = e.target.value.trim()}
                        className="peer placeholder-gray-400 h-10 w-full max-w-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      />
                      <label
                        htmlFor="phoneNumber"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Phone Number
                      </label>
                    </div>

                    <div className="lg:flex lg:flex-row flex-col mt-6">
                      <div className="relative">
                        <input
                          maxLength={40}
                          type="password"
                          ref={passwordRef}
                          className="peer placeholder-gray-400 h-10 w-full max-w-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        />
                        <label
                          htmlFor="password"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Password
                        </label>
                      </div>

                      <div className="relative mt-6 lg:mt-0 lg:ml-3">
                        <input
                          maxLength={40}
                          type="password"
                          ref={confirmPasswordRef}
                          className="peer placeholder-gray-400 h-10 w-full max-w-lg border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        />
                        <label
                          htmlFor="confirm-password"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Confirm Password
                        </label>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="text-red-600 mb-2">
                        <FaEraser className="inline mr-1" /> {errorMessage}
                      </div>
                    )}

                    <div className="relative mt-6">
                      {" "}
                      <button
                        type="submit"
                        className="customeApplicationButton w-full"
                      >
                        Register
                      </button>
                    </div>
                  </form>
                  <p className="mt-4">
                    {" "}
                    Already have an account?{" "}
                    <Link
                      to="/www.bookito.com/login"
                      className="hover:underline text-blue-600"
                    >
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
};

export default Register;
