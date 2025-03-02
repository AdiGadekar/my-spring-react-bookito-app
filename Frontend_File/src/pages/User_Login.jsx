/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

import {
  checkUserByemail,
  sendOTP,
  validateOTP,
  resetPassword,
} from "../services/api.js";
import Footer from "../components/common/Footer.jsx";
import { FaEraser, FaUserShield } from "react-icons/fa";
import { SpinnerAnimation } from "../components/common/Spinner.jsx";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const Login = () => {
  const { login } = useContext(AuthContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nav = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [emailForForgotPassword, setEmailForForgotPassword] = useState("");
  const [otp, setOtp] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [customLoading, setcustomLoading] = useState(false);
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value.toLowerCase().trim();
    const password = passwordRef.current.value.trim();

    if (!email || !validateEmail(email)) {
      emailRef.current.focus();
      setErrorMessage("Enter a valid email");
      return;
    }
    if (!password || !validatePassword(password)) {
      passwordRef.current.focus();
      setErrorMessage("Enter a valid password");
      return;
    }
    setcustomLoading(true);
    setTimeout(async() => {
      try {
        const loginResult = await login(email, password);
        setcustomLoading(false);
        if (loginResult.role) {
          nav("/www.bookito.com/homePage");
        } else {
          setErrorMessage("Invalid email or password.");
        }
      } catch (error) {
        setcustomLoading(false);
        setErrorMessage(error.response?.data.body||"An error occurred during login.");
      }
    }, 1000);
  };

  const handleForgotPassword = async () => {
    if (
      !validateEmail(emailForForgotPassword) ||
      !emailForForgotPassword.endsWith("@gmail.com")
    ) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setcustomLoading(true);
      const response = await checkUserByemail(emailForForgotPassword);
      
      if (response.status === 200) {
        const otpResp = await sendOTP(emailForForgotPassword);
        if (otpResp.status === 200) {
          toast.success("OTP sent to your email!");
          setIsOtpSent(true);
        } else {
          toast.error("Cannot send the email!!!");
        }
        setcustomLoading(false);
      } else {
        setcustomLoading(false);
        toast.error("User not found!");
      }
    } catch (error) {
      setcustomLoading(false);
      toast.error(error.response?.data.body||"An error occurred while sending the OTP.");
    }
  };

  const handleValidateOtp = async () => {
    if (otp.toString().length != 4) {
      toast.error("Invalid OTP. OTP should be 4 digits.");
      return;
    }
    try {
      setcustomLoading(true);
      const response = await validateOTP(emailForForgotPassword, otp);
      if (response.status === 200) {
        setcustomLoading(false);
        setIsOtpValidated(true);
        toast.success("OTP validated. Please enter a new password.");
      } else {
        setcustomLoading(false);
        toast.error(response.data.body);
      }
    } catch (error) {
      setcustomLoading(false);
      toast.error(error.response?.data.body||"An error occurred during OTP validation.");
    }
  };
  
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    try {
      setcustomLoading(true);
      await resetPassword(emailForForgotPassword, newPassword);
      setcustomLoading(false);
      toast.success("Password reset successfully.");
      setForgotPasswordModal(false);
    } catch (error) {
      toast.error(error.response?.data.body||"An error occurred while resetting the password.");
    }finally{
      clearField();
    }
  };

  const clearField = () => {
    setForgotPasswordModal(false);
    setIsOtpSent(false);
    setIsOtpValidated(false);
    setEmailForForgotPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <React.Fragment>
      <div className="min-h-screen flex flex-col sm:flex-row bg-gray-100">
        {customLoading === true && <SpinnerAnimation />}
        <div
          className="w-full sm:w-1/2 h-96 sm:h-screen bg-cover bg-center"
          style={{
            backgroundImage: 'url("../../Illustration/loginundraw.png")',
          }}
        ></div>

        <div className="w-full sm:w-1/2 flex justify-center items-center bg-white">
          <div className="max-w-xl w-full mx-auto p-8">
            <div className="relative pt-12 pb-5 rounded-3xl bg-white shadow-lg sm:rounded-3xl px-2">
              <div className="mx-10 text-center">
                <div>
                  <h1 className="text-2xl  bg-clip-text text-[#ee8c0a] font-bold">
                    Bookito - Fastest Taxi Service
                  </h1>
                  <h1 className="text-2xl font-medium text-[#ee8c0a] mt-5">
                    Welcome Back
                  </h1>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <form onSubmit={handleFormSubmission}>
                      <div className="relative ">
                        <input
                          type="text"
                          ref={emailRef}
                          onChange={(e) =>
                            (e.target.value = e.target.value.trim())
                          }
                          maxLength={40}
                          className="peer px-2 py-1 bg-transparent mt-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        />
                        <label
                          htmlFor="email"
                          className="absolute font-semibold left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Email Address
                        </label>
                      </div>

                      <div className="relative mt-6">
                        <div className="flex flex-row">
                          <input
                            type={type}
                            ref={passwordRef}
                            maxLength={40}
                            className="peer px-2 py-1 bg-transparent mt-3 h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                          />
                          <span
                            className="flex justify-around items-center"
                            onClick={handleToggle}
                          >
                            <Icon
                              className="absolute mr-10"
                              icon={icon}
                              size={25}
                            />
                          </span>
                        </div>

                        <label
                          htmlFor="password"
                          className="absolute font-semibold left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Password
                        </label>
                      </div>

                      {errorMessage && (
                        <div className="text-red-600 mb-2">
                          <FaEraser className="inline mr-1" /> {errorMessage}
                        </div>
                      )}
                      <div className="flex justify-end mt-5">
                        <p
                          className="text-blue-600 hover:underline text-sm items-end cursor-pointer"
                          onClick={() => setForgotPasswordModal(true)}
                        >
                          Forgot Password?
                        </p>
                      </div>

                      <div className="relative mt-4">
                        <button
                          type="submit"
                          className="customeApplicationButton w-full"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to="/www.bookito.com/register"
                        className="hover:underline text-blue-600"
                      >
                        Register here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {forgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl">
              <FaUserShield className="text-[#ee8c0a] inline mb-1" /> Reset
              Password
            </h2>
            {!isOtpSent ? (
              <>
                <input
                  type="email"
                  maxLength={40}
                  value={emailForForgotPassword}
                  onChange={(e) => setEmailForForgotPassword(e.target.value)}
                  className="w-full mt-4 p-2 border border-gray-300"
                  placeholder="Enter your email"
                />
                <button
                  onClick={handleForgotPassword}
                  className="w-full custom-confirm-button mt-4"
                >
                  Submit
                </button>
              </>
            ) : !isOtpValidated ? (
              <>
                <input
                  type="number"
                  maxLength={4}
                  minLength={4}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-2 p-2 border border-gray-300"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={handleValidateOtp}
                  className="w-full custom-confirm-button mt-4"
                >
                  Validate OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  maxLength={40}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-4 p-2 border border-gray-300"
                  placeholder="Enter new password"
                />
                <input
                  type="password"
                  maxLength={40}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-4 p-2 border border-gray-300"
                  placeholder="Confirm new password"
                />
                <button
                  onClick={handlePasswordReset}
                  className="w-full custom-confirm-button mt-4"
                >
                  Reset Password
                </button>
              </>
            )}
            <button
              onClick={() => {
                clearField();
              }}
              className="w-full mt-2 custom-cancel-button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
      <Footer />
    </React.Fragment>
  );
};

export default Login;
