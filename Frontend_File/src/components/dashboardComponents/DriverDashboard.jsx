/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import { FaUser, FaMapMarkerAlt, FaTaxi, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  departBooking,
  arrivedAtPickup,
  startRide,
  completeRide,
  getBookingByDriverIdAndStatusConfirmed,
  getUserById,
  getTaxiById,
} from "../../services/api";
import DriverCardDetails from "../driverOperationComponents/DriverCardDetails";
import DriverChatPage from "../bookingComponents/ChatComponents/Driver_ChatPage";

const DriverDashboard = ({ loginResult }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [taxiDetails, setTaxiDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [carPosition, setCarPosition] = useState(null);
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_URL,
    libraries,
  });

  const showNotification = (title, bodyString) => {
    const sendFunction = () => {
      const notification = new Notification(title, {
        body: bodyString,
        icon: "../../../CarLogo/image-removebg-preview.png",
      });

      notification.onclick = () => {
        window.focus();
      };
    };

    if (Notification.permission === "granted") {
      sendFunction();
    } else if (Notification.permission === "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendFunction();
        }
      });
    }
  };

  useEffect(() => {
    const fetchCurrentBooking = async () => {
      try {
        const response = await getBookingByDriverIdAndStatusConfirmed(
          loginResult.driverDTO.driverId
        );
        if (response.status === 200 && response.data.body) {
          setCurrentBooking(response.data.body);
          setRideStatus(response.data.body.status);
          setMessage("You have an existing booking.");
        }
      } catch (error) {
        console.error("Error fetching current booking:", error);
      }
    };

    fetchCurrentBooking();

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe(
        `/topic/driver/${loginResult.driverDTO.driverId}/newBooking`,
        (message) => {
          const bookingDetails = JSON.parse(message.body);
          toast.success("You got a new ride. Hurry up!", { autoClose: 900 });
          setCurrentBooking(bookingDetails);
          setRideStatus("Confirmed");
          setMessage("New booking assigned to you.");
          showNotification(
            "You got a new ride. Hurry up!",
            "New booking assigned to you."
          );
        }
      );

      stompClient.subscribe(
        `/topic/driver/${loginResult.driverDTO.driverId}/cancel`,
        (message) => {
          Swal.fire({
            title: "Ride is Cancelled! Sorry😔😔",
            text: "Your Ride has been cancelled",
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "custom-confirm-button",
            },
            timer: 2000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            setCurrentBooking(null);
          }, 2000);
          setMessage("The customer has canceled the booking.");
          showNotification(
            "Your Ride is cancelled!!😭",
            "Please Don't Depart"
          );
        }
      );

      stompClient.subscribe(
        `/topic/driver/${loginResult.driverDTO.driverId}/paymentDone`,
        (message) => {
          Swal.fire({
            title: "Payment Done Successfully",
            text: "Your payment has been successfully processed!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "custom-confirm-button",
            },
            timer: 2000,
            timerProgressBar: true,
          });

          setTimeout(() => {
            setCurrentBooking(null);
          }, 2000);
        }
      );
    });

    return () => stompClient.disconnect();
  }, [loginResult.driverDTO.driverId]);

  useEffect(() => {
    if (!isLoaded) return;

    if (currentBooking) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: currentBooking.pickupLocation,
          destination: currentBooking.dropoffLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error("Error fetching directions: ", status);
          }
        }
      );
    }
  }, [isLoaded, currentBooking]);

  const handleDepart = async () => {
    try {
      await departBooking(currentBooking.bookingId);
      setRideStatus("Departed");
      setMessage("You have departed for the pickup location.");
      toast.success("Ride departed successfully!", { autoClose: 500 });
    } catch (error) {
      toast.error(error.response?.data.body ||"Unable to mark as departed", { autoClose: 800 });
    }
  };

  const handleArrivedAtPickup = async () => {
    try {
      await arrivedAtPickup(currentBooking.bookingId);
      setRideStatus("Arrived");
      setMessage("You have arrived at the pickup location.");
      toast.success("Arrived at pickup location!", { autoClose: 500 });
    } catch (error) {
      toast.error(error.response?.data.body ||"Unable to mark as arrived", { autoClose: 800 });
    }
  };

  const handleStartRide = async () => {
    Swal.fire({
      title: "Enter OTP",
      input: "text",
      inputPlaceholder: "Enter the OTP provided by the customer",
      showCancelButton: true,
      confirmButtonText: "Start Ride",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
      preConfirm: async (otp) => {
        if (!otp) {
          Swal.showValidationMessage("OTP is required!");
          return false;
        }
        try {
          const response = await startRide(currentBooking.bookingId, otp);
          if (response.status === 200) {
            setRideStatus("In_Progress");
            setMessage("Ride has started.");
            toast.success("Ride started successfully!", { autoClose: 500 });
            animateCarOnRoute();
          } else {
            toast.warning("Invalid OTP!! Enter Again", { autoClose: 800 });
          }
        } catch (error) {
          toast.error(error.response?.data.body ||"Error starting the ride", { autoClose: 800 });
        }
      },
    });
  };

  const animateCarOnRoute = () => {
    const path = directionsResponse.routes[0].overview_path;
    let currentIndex = 0;
    const updatePosition = () => {
      if (currentIndex < path.length) {
        setCarPosition(path[currentIndex]);
        currentIndex++;
      } else {
        setCarPosition(null);
        clearInterval(animationInterval);
        Swal.fire({
          icon: "success",
          title: "You reached at your destination",
          showConfirmButton: false,
          timer: 1500,
        });
        handleCompleteRide();
      }
    };

    const animationInterval = setInterval(updatePosition, 500);
  };

  const handleCompleteRide = async () => {
    Swal.fire({
      title: "Complete Ride",
      text: "Are you sure you want to mark this ride as completed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Complete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await completeRide(currentBooking.bookingId);
          setRideStatus("Completed");
          setMessage("Ride has been completed. Waiting for Payment.");
          toast.success("Ride completed successfully!", { autoClose: 900 });
        } catch (error) {
          toast.error(error.response?.data.body ||"Error completing the ride", { autoClose: 800 });
        }
      }
    });
  };

  useEffect(() => {
    if (currentBooking != null) {
      const fetchDetails = async () => {
        try {
          const customerResponse = await getUserById(currentBooking.userId);
          setCustomerDetails(customerResponse?.data.body || null);

          const taxiResponse = await getTaxiById(currentBooking.taxiId);
          setTaxiDetails(taxiResponse?.data.body || null);
        } catch (error) {
          console.error("Error fetching user or taxi details:", error);
        }
      };

      fetchDetails();
    }
  }, [currentBooking]);
  if (!currentBooking) {
    return (
      <div className="p-6 space-y-4 min-h-screen">
        <div className="mt-2 p-4 bg-white hover:scale-95 duration-200 shadow-lg rounded-lg shadow-gray-200">
          <h3 className="text-xl font-semibold mb-2">
            Welcome Captain👨🏼‍✈️ . No Current Booking Found!!!
          </h3>
        </div>
        <DriverCardDetails driverId={loginResult.driverDTO.driverId} />
      </div>
    );
  }

  if (!customerDetails || !taxiDetails) {
    return (
      <div className="p-6 space-y-4 min-h-screen">
        <div className="ml-4 mt-2 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Loading details...</h3>
        </div>
        <DriverCardDetails driverId={loginResult.driverDTO.driverId} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold">Driver Dashboard</h2>

      <div className="flex lg:w-full flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="p-4 bg-white shadow-md hover:scale-105 duration-300 rounded-lg lg:w-1/2">
          <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
          <p>
            <FaUser className="inline text-blue-500 mr-2" />
            <strong>Customer Name:</strong> {customerDetails.firstName}{" "}
            {customerDetails.lastName}
          </p>
          <p>
            <FaPhone className="inline text-blue-500 mr-2" />
            <strong>Customer Contact Number:</strong>{" "}
            {customerDetails.phoneNumber}
          </p>
        </div>

        <div className="p-4 bg-white shadow-md hover:scale-105 duration-300 rounded-lg lg:w-1/2">
          <h3 className="text-xl font-semibold mb-2">Taxi Details</h3>
          <p>
            <FaTaxi className="inline text-yellow-500 mr-2" />
            <strong>Taxi Model:</strong> {taxiDetails.model}
          </p>
          <p>
            <FaTaxi className="inline text-blue-500 mr-2" />
            <strong>Taxi Number Plate:</strong> {taxiDetails.numberPlate}
          </p>
          <p>
            <FaTaxi className="inline text-red-500 mr-2" />
            <strong>Taxi Color:</strong> {taxiDetails.color}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="p-4 bg-white shadow-md hover:scale-105 duration-300 rounded-lg lg:w-1/2">
          <h3 className="text-xl font-semibold mb-2">Location Details</h3>
          <p>
            <FaMapMarkerAlt className="inline text-red-500 mr-2" />
            <strong>Pickup Location:</strong>{" "}
            {currentBooking.pickupLocation === "??Current location"
              ? "📍Current location"
              : currentBooking.pickupLocation}
          </p>
          <p>
            <FaMapMarkerAlt className="inline text-green-500 mr-2" />
            <strong>Dropoff Location:</strong> {currentBooking.dropoffLocation}
          </p>
        </div>

        <div className="p-4 bg-white shadow-md hover:scale-105 duration-300  rounded-lg lg:w-1/2">
          <h3 className="text-xl font-semibold mb-2">Status & Actions</h3>
          <p>
            Status : <strong>{message}</strong>
          </p>

          <div className=" space-y-4 mt-12 justify-end flex">
            {rideStatus === "Confirmed" && (
              <button
                onClick={handleDepart}
                className="p-2 w-full bg-[#ee8c0a] text-white  hover:bg-white hover:text-[#ee8c0a] hover:border-[#ee8c0a] border-2 focus:outline-none"
              >
                Depart to Pickup Location
              </button>
            )}

            {rideStatus === "Departed" && (
              <button
                onClick={handleArrivedAtPickup}
                className="p-2 w-full bg-green-400 text-white  hover:bg-white hover:text-green-400 hover:border-green-400 border-2 focus:outline-none"
              >
                Arrived at Pickup Location
              </button>
            )}

            {rideStatus === "Arrived" && (
              <button
                onClick={handleStartRide}
                className="p-2 w-full bg-yellow-500 text-white hover:bg-white hover:text-yellow-400 hover:border-yellow-500 border-2 focus:outline-none"
              >
                Start Ride
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-1 border-2 border-dashed border-orange-400 shadow-lg shadow-gray-400">
        {isLoaded && currentBooking && (
          <GoogleMap
            options={{
              streetViewControl: true,
              mapTypeControl: true,
            }}
            mapContainerStyle={{
              height: "400px",
              width: "100%",
            }}
            // center={{
            //   lat: 12.9716,
            //   lng: 77.5946,
            // }}
            zoom={14}
          >
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: "#00509E",
                    strokeWeight: 5,
                  },
                }}
              />
            )}

            {carPosition && (
              <Marker
                icon={{
                  url: "https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png",
                  scaledSize: new window.google.maps.Size(20, 20),
                }}
                position={carPosition}
                title="Taxi"
              />
            )}
          </GoogleMap>
        )}
      </div>
      {loginResult && customerDetails &&<DriverChatPage driverId={loginResult.driverDTO.driverId} customerId = {customerDetails.userId}/>}
      <DriverCardDetails driverId={loginResult.driverDTO.driverId} />
    </div>
  );
};

export default DriverDashboard;
