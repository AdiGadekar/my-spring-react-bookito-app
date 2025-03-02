import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const env = import.meta.env;
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiRequest = async (method, url, data = {}, params = {}) => {
  try  {
    const config = {
      method,
      url,
      data,
      params,
    };
    const response = await axiosInstance(config);
    return response; 
  } catch (error) {
    console.error("API request failed:", error);
    throw error; 
  }
};

{/*-----------------------------------------Auth Controller-------------------------------------------------*/}
// Login user
export const loginUser = async (email, password) => {
  const response = await apiRequest("POST", import.meta.env.VITE_AUTH_LOGIN_URL, null, { email, password });
 return response;
};

// Logout user
export const logoutUser = async (email) => {
  const response = await apiRequest("POST", env.VITE_AUTH_LOGOUT_URL, null, { email });
 return response;
};

// Reset user password
export const resetPassword = async (email, newPassword) => {
  const response = await apiRequest("POST", env.VITE_AUTH_RESET_PASSWORD_URL, null, { email, newPassword });
 return response;
};

// Send OTP
export const sendOTP = async (email) => {
  const response = await apiRequest("POST", env.VITE_AUTH_SEND_OTP_URL, null, { email });
 return response;
};

// Validate OTP
export const validateOTP = async (email, otp) => {
  const response = await apiRequest("POST", env.VITE_AUTH_VALIDATE_OTP_URL, null, { email, otp });
 return response;
};


{/*-----------------------------User Controller-------------------------------------------------------------*/}
// Check if user exists by email
export const checkUserByemail = async (email) => {
  const response = await apiRequest("GET", env.VITE_USERS_CHECK_EMAIL_URL, null, { email });
 return response;
};

// Register user
export const register = async (userDto) => {
  const response = await apiRequest("POST", env.VITE_USERS_REGISTER_URL, userDto);
 return response;
};

// Update user details
export const updateUserDetail = async (userId, userDto) => {
  const response = await apiRequest("PUT", env.VITE_USERS_UPDATE_URL, userDto, { userId });
 return response;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await apiRequest("GET", env.VITE_USERS_GET_URL, null, { userId });
 return response;
};

// Get all customers
export const getAllCustomer = async () => {
  const response = await apiRequest("GET", env.VITE_USERS_ALL_CUSTOMERS_URL);
 return response;
};

// Get all drivers
export const getAllDriver = async () => {
  const response = await apiRequest("GET", env.VITE_USERS_ALL_DRIVERS_URL);
 return response;
};


{/*-----------------------------Driver Controller-------------------------------------------------------------*/}
// Get driver by ID
export const getDriverById = async (driverId) => {
  const response = await apiRequest("GET", env.VITE_DRIVERS_GET_BY_ID_URL, null, { driverId });
 return response;
};


{/*-----------------------------Taxi Controller-------------------------------------------------------------*/}
// Get taxi by ID
export const getTaxiById = async (taxiId) => {
  const response = await apiRequest("GET", env.VITE_USERS_TAXI_URL, null, { taxiId });
 return response;
};

// Register taxi
export const registerTaxi = async (taxiDTO) => {
  const response = await apiRequest("POST", env.VITE_TAXI_REGISTER_URL, taxiDTO);
 return response;
};

// Update taxi details
export const updateTaxiDetails = async (taxiId, taxiDTO) => {
  const response = await apiRequest("PUT", env.VITE_TAXI_UPDATE_URL, taxiDTO, { taxiId });
 return response;
};

// View all taxis
export const viewAllTaxis = async () => {
  const response = await apiRequest("GET", env.VITE_TAXI_ALL_URL);
 return response;
};

// View all available taxi models
export const viewAllAvialbleTaxiModel = async () => {
  const response = await apiRequest("GET", env.VITE_TAXI_ALL_MODEL_URL);
 return response;
};


{/*-----------------------------Rating Controller-------------------------------------------------------------*/}
// Rate a driver
export const rateDriver = async (ratingDTO) => {
  const response = await apiRequest("POST", env.VITE_RATINGS_RATE_URL, ratingDTO);
 return response;
};

// Get driver ratings
export const getDriverRatings = async (driverId) => {
  const response = await apiRequest("GET", env.VITE_RATINGS_DRIVER_URL+`/${driverId}`);
 return response;
};

// Get average driver rating
export const getAverageDriverRating = async (driverId) => {
  const response = await apiRequest("GET", env.VITE_RATINGS_DRIVER_AVERAGE_URL+`/${driverId}`);
 return response;
};


{/*-----------------------------Booking Controller-------------------------------------------------------------*/}
// Create booking
export const createBooking = async (bookingDTO) => {
  const response = await apiRequest("POST", env.VITE_BOOKINGS_CREATE_URL, bookingDTO);
 return response;
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  const response = await apiRequest("PUT", env.VITE_BOOKINGS_CANCEL_URL, null, { bookingId });
 return response;
};

// Depart booking
export const departBooking = async (bookingId) => {
  const response = await apiRequest("PATCH", env.VITE_BOOKINGS_DEPART_URL, null, { bookingId });
 return response;
};

// Arrived at pickup
export const arrivedAtPickup = async (bookingId) => {
  const response = await apiRequest("POST", env.VITE_BOOKINGS_ARRIVED_AT_PICKUP_URL, null, { bookingId });
 return response;
};

// Start ride
export const startRide = async (bookingId, rideStartOtp) => {
  const response = await apiRequest("PATCH", env.VITE_BOOKINGS_START_RIDE_URL, null, { bookingId, ridStartOtp: rideStartOtp });
 return response;
};

// Complete ride
export const completeRide = async (bookingId) => {
  const response = await apiRequest("PUT", env.VITE_BOOKINGS_COMPLETE_RIDE_URL, null, { bookingId });
 return response;
};

// Complete booking
export const completeBooking = async (bookingId, paymentMethod) => {
  const response = await apiRequest("PUT", env.VITE_BOOKINGS_COMPLETE_BOOKING_URL, null, { bookingId, paymentMethod });
 return response;
};

// Get booking by customer ID and status confirmed
export const getBookingByCustomerIdAndStatusConfirmed = async (customerId) => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_GET_BY_CUSTOMER_URL, null, { customerId });
 return response;
};

// Get booking by driver ID and status confirmed
export const getBookingByDriverIdAndStatusConfirmed = async (driverId) => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_GET_BY_DRIVER_URL, null, { driverId });
 return response;
};

// Get all bookings
export const getAllBookings = async () => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_GET_ALL_BOOKINGS_URL);
 return response;
};

// Get booking history by user ID
export const getBookingHistory = async (userId) => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_CUSTOMER_HISTORY_URL, null, { userId });
 return response;
};

// Get driver booking history
export const getDriverBookingHistory = async (driverId) => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_DRIVER_HISTORY_URL, null, { driverId });
 return response.data.body;
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_GET_BY_ID_URL, null, { bookingId });
  return response.data.body;
};

// Get monthly earnings of a driver
export const getMonthlyEarning = async (driverId) => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_GET_DRIVER_MONTHLY_EARNING, null, { driverId });
 return response;
};

// Get all booking history
export const getAllBookingHistory = async () => {
  const response = await apiRequest("GET", env.VITE_BOOKINGS_HISTORY_URL);
 return response;
};
