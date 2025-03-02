/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  cancelBooking,
  completeBooking,
  getAverageDriverRating,
  getBookingById,
  getDriverById,
  getTaxiById,
  rateDriver,
} from "../../services/api";
import {
  FaUser,
  FaTaxi,
  FaPhone,
  FaLocationArrow,
  FaStar,
  FaIdeal,
  FaCheck,
  FaRoad,
  FaRoute,
} from "react-icons/fa";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { ToastContainer, toast } from "react-toastify";
import { Stomp } from "@stomp/stompjs";
import Swal from "sweetalert2";
import { SpinnerAnimation } from "../common/Spinner";
import CustomerChatPage from "./ChatComponents/Customer_ChatPage";

const BookingInformation = ({ userData, bookingId }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const [driverRating, setDriverRating] = useState(0);
  const [taxiDetails, setTaxiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const libraries = useMemo(() => ["places"], []);
  const [message, setMessage] = useState(
    "Your booking has been confirmed. Please wait for further updates."
  );
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [carPosition, setCarPosition] = useState(null);
  const directionRef = useRef(null);
  const [customLoading, setcustomLoading] = useState(false);

  const navigate = useNavigate();

  const animateCarOnRoute = () => {
    const path = directionRef.current.routes[0].overview_path;
    let currentIndex = 0;
    const updatePosition = () => {
      if (currentIndex < path.length) {
        setCarPosition(path[currentIndex]);
        currentIndex++;
      } else {
        setCarPosition(null);
        clearInterval(animationInterval);
        toast.success("You are reaching at destination!!!");
      }
    };
    const animationInterval = setInterval(updatePosition, 500);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_URL,
    libraries,
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setcustomLoading(true);
      try {
        const bookingData = await getBookingById(bookingId);
        setBookingDetails(bookingData);
        const [driverRes, taxiRes, driverRat] = await Promise.all([
          bookingData.driverId
            ? getDriverById(bookingData.driverId)
            : Promise.resolve(null),
          bookingData.taxiId
            ? getTaxiById(bookingData.taxiId)
            : Promise.resolve(null),
          bookingData.driverId
            ? getAverageDriverRating(bookingData.driverId)
            : Promise.resolve(null),
        ]);

        setDriverDetails(driverRes?.data.body || null);
        setTaxiDetails(taxiRes?.data.body || null);
        setDriverRating(driverRat.data || 2.5);
        setBookingStatus(bookingData.status);

        switch (bookingData.status) {
          case "Confirmed":
            setMessage(
              "Your booking has been confirmed. Driver will depart shortly!!!"
            );
            break;
          case "Cancelled":
            setMessage("Your booking has been cancelled.");
            break;
          case "In_Progress":
            setMessage("Your ride is in progress. Enjoy your trip!");
            break;
          case "Departed":
            setMessage("Captain is departed towards your location.");
            break;
          case "Completed":
            setMessage(
              "Your ride has been completed. Thank you for choosing our service!"
            );
            break;
          default:
            setMessage("Unknown status. Please contact support.");
            break;
        }
        setLoading(false);

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(
          {
            origin: bookingData.pickupLocation,
            destination: bookingData.dropoffLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionRef.current = result;
              setDirectionsResponse(result);
            } else {
              console.error("Error fetching directions: ", status);
            }
          }
        );
      } catch (error) {
        console.error(error.response?.data.body ||"Failed to fetch booking details:");
        setLoading(false);
      } finally {
        setcustomLoading(false);
      }
    };
    fetchBookingDetails();
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe(
        `/topic/customer/${userData.userId}/depart`,
        (message) => {
          setBookingStatus("Departed");
          setMessage("Captain is departed towards your location.");
          toast.info("Your Captain has departed towards your location.", {
            autoClose: 3000,
          });
        }
      );

      stompClient.subscribe(
        `/topic/customer/${userData.userId}/started`,
        (message) => {
          setBookingStatus("Started");
          setMessage("Your ride is in progress. Enjoy your trip!");
          toast.info("Your ride has started. Sit comfortably!", {
            autoClose: 800,
          });
          animateCarOnRoute();
        }
      );

      stompClient.subscribe(
        `/topic/customer/${userData.userId}/completeRide`,
        (message) => {
          setBookingStatus("Completed");
          setMessage("Ride is Completed!!!");
          toast.success("Your ride is completed! Please proceed to payment.", {
            autoClose: 800,
          });
          handleCompleteBooking();
        }
      );

      stompClient.subscribe(
        `/topic/customer/${userData.userId}/driverArrived`,
        (message) => {
          setBookingStatus("Captain Arrived");
          setMessage(
            "Captain is Arrived arrived. Please reach towards pickup location"
          );
          toast.success("Your Captain has arrived at the pickup location.", {
            autoClose: 800,
          });
        }
      );
    });

    return () => stompClient.disconnect();
  }, [userData.userId]);

  const handleCancelBooking = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await cancelBooking(bookingId);
          if (response.status === 200) {
            setBookingStatus("Canceled");
            toast.success("Booking canceled successfully!", {
              autoClose: 1000,
            });
            setMessage("Your booking has been cancelled.");
            setTimeout(() => {
              navigate("/www.bookito.com/homePage");
            }, 2000);
          } else {
            toast.error("Failed to cancel booking. Already Driver Started");
          }
        } catch (error) {
          console.error(error.response?.data.body ||"Error canceling booking:", error);
        }
      }
    });
  };

  const handleCompleteBooking = async () => {
    const amount = bookingDetails.paymentDTO.amount;

    const bookingDetailsHtml = `
          <p><strong>Total Price:</strong> ₹${amount}</p>
      `;

    Swal.fire({
      title: "Confirm Payment",
      html: bookingDetailsHtml,
      icon: "warning",
      confirmButtonText: "Yes, complete it!",
      customClass: {
        confirmButton: "custom-confirm-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: paymentMethod } = await Swal.fire({
          title: "Select Payment Method",
          input: "select",
          inputOptions: {
            UPI: "UPI",
            Cash: "Cash",
          },
          inputPlaceholder: "Choose a payment method",
          showCancelButton: true,
          confirmButtonText: "Next",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "custom-confirm-button",
          },
        });

        if (paymentMethod) {
          setcustomLoading(true);
          try {
            await completeBooking(bookingId, paymentMethod);
            setTimeout(() => {
              setcustomLoading(false);
              Swal.fire({
                title: "Payment Done Successfully",
                text: "Your payment has been successfully processed!",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                  confirmButton: "custom-confirm-button",
                },
                timer: 1000,
                timerProgressBar: true,
              }).then(() => {
                setTimeout(() => {
                  Swal.fire({
                    title: "Rate Your Ride",
                    text: "Please rate your ride and provide feedback for the driver:",
                    showCancelButton: true,
                    confirmButtonText: "Submit",
                    customClass: {
                      confirmButton: "custom-confirm-button",
                    },
                    allowOutsideClick: false,
                    html: `
                                  <div className="flex w-full ">
                                      <label for="rating">Rating:</label>
                                      <div id="rating">
                                          <span class="smiley" data-value="1">&#128577;</span>
                                          <span class="smiley" data-value="2">&#128528;</span>
                                          <span class="smiley" data-value="3">&#128522;</span>
                                          <span class="smiley" data-value="4">&#128515;</span>
                                          <span class="smiley" data-value="5">&#128525;</span>
                                      </div>
                                  </div>
                                  <textarea id="feedback" class="swal2-textarea" placeholder="Enter your feedback here..."></textarea>
                              `,
                    didOpen: () => {
                      const smileys = document.querySelectorAll(".smiley");
                      smileys.forEach((smiley) => {
                        smiley.addEventListener("click", (e) => {
                          smileys.forEach(
                            (s) => (s.style.backgroundColor = "")
                          );
                          e.target.style.backgroundColor = "#ee8c0a";
                          e.target.setAttribute("data-selected", "true");
                        });
                      });
                    },
                    preConfirm: () => {
                      const selectedSmiley = document.querySelector(
                        '.smiley[data-selected="true"]'
                      );
                      const feedback =
                        document.getElementById("feedback").value;

                      if (!selectedSmiley || !feedback) {
                        Swal.showValidationMessage(
                          "Please provide both a rating and feedback."
                        );
                        return false;
                      }

                      const rating = selectedSmiley.getAttribute("data-value");
                      return { rating, feedback };
                    },
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      setcustomLoading(true);
                      const { rating, feedback } = result.value;
                      const ratingDTO = {
                        customerName:userData.firstName+" "+userData.lastName,
                        bookingId: bookingDetails.bookingId,
                        userId: userData.userId,
                        driverId: driverDetails.driverDTO.driverId,
                        ratingValue: rating,
                        comment: feedback,
                      };
                      try {
                        await rateDriver(ratingDTO);
                        toast.success("Thank you for your feedback");
                      } catch (error) {
                        console.log(error);
                      }
                     
                    }               
                    setcustomLoading(true);   
                    setTimeout(() => {
                      setcustomLoading(false);
                      navigate("/www.bookito.com/homePage");
                    }, 1000);
                  });
                }, 1000);
              });
            }, 1000);
          } catch (error) {
            toast.error(error.response?.data.body ||"Payment failed. Please try again.");
          }
        } else {
          toast.info("Payment method selection was canceled.");
        }
      }
    });
  };

  if (loading) return <div>Loading booking details...</div>;

  return (
    <div className="p-6 space-y-4 bg-[#f7f7f7]">
      {customLoading === true && <SpinnerAnimation />}

      <div className="w-full flex justify-start items-center  flex-row">
        <FaIdeal className="mt-2 text-xl text-[#00509E]" />
        <h2 className="text-3xl italic text-slate-800 mt-2 md:mt-0">
          Booking Details
        </h2>
      </div>
      <ToastContainer />

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="p-4 bg-white lg:w-1/2 shadow-md rounded-lg hover:scale-95 duration-300 shadow-gray-500">
          <h3 className="text-2xl font-semibold underline italic mb-2">
            <FaRoute className="inline mr-1 mb-1 text-blue-500" />
            Route Information
          </h3>
          <p className="mb-1">
            <FaLocationArrow className="inline text-blue-500 mr-2" />
            <strong>Origin:</strong>{" "}
            {bookingDetails.pickupLocation === "??Current location"
              ? "📍Current location"
              : bookingDetails.pickupLocation}
          </p>
          <p className="mb-1">
            <FaLocationArrow className="inline text-red-500 mr-2" />
            <strong>Destination:</strong> {bookingDetails.dropoffLocation}
          </p>
          <p className="mb-1">
            <FaRoad className="inline text-slate-500 mr-2" />
            <strong>Distance:</strong> {bookingDetails.distance} km
          </p>
        </div>

        {driverDetails && (
          <div className="p-4 bg-white lg:w-1/2 shadow-md rounded-lg hover:scale-95 duration-300 shadow-gray-500">
            <h3 className="text-xl italic font-semibold mb-2">
              Driver Information
            </h3>
            <p className="mb-1">
              <FaUser className="inline text-green-500 mr-2" />
              <strong>Driver Name:</strong> {driverDetails.firstName}{" "}
              {driverDetails.lastName}
            </p>
            <p className="mb-1">
              <FaPhone className="inline text-blue-500 mr-2" />
              <strong>Driver Contact:</strong> {driverDetails.phoneNumber}
            </p>
            <p className="mb-1">
              <FaStar className="inline text-yellow-400 mr-2" />
              <strong>Driver Rating:</strong> {driverRating}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8">
        <div className="p-4 bg-white lg:w-1/2 shadow-md rounded-lg hover:scale-95 duration-300 shadow-gray-500">
          <h3 className="text-xl italic font-semibold mb-2">
            Taxi Information
          </h3>
          <p className="mb-1">
            <FaTaxi className="inline text-yellow-400 text-lg mr-2" />
            <strong>Taxi Model:</strong> {bookingDetails.carModel}
          </p>
          {taxiDetails && (
            <div>
              <p className="mb-1">
                <FaTaxi className="inline text-blue-500 mr-2" />
                <strong>Taxi Number Plate:</strong> {taxiDetails.numberPlate}
              </p>
              <p className="mb-1">
                <FaTaxi className="inline text-red-500 mr-2" />
                <strong>Taxi Color:</strong> {taxiDetails.color}
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 min-h-full md:w-full">
          <div className="p-4 bg-white lg:w-3/5 md:w-full shadow-md h-full rounded-lg hover:scale-95 duration-300 shadow-gray-500">
            <div className="flex flex-row justify-start items-center">
              <FaCheck className="text-xl mr-1" />
              <h3 className="text-2xl font-medium italic mb-2">
                Booking Status
              </h3>
            </div>
            <p className="mb-1">
              <strong>Status:</strong> {bookingStatus}
            </p>{" "}
            {taxiDetails.status}
            {bookingStatus === "Departed" && (
              <p className="mb-1">
                <strong>OTP: </strong> {bookingDetails.userId}
                {bookingDetails.userId}
                {"11"}
              </p>
            )}
            {bookingStatus === "Confirmed" && (
              <div className="flex mt-3.5 justify-end justify-items-end bottom-0 w-full">
                <button
                  onClick={handleCancelBooking}
                  className="bg-red-500 border-2 text-white p-2 rounded hover:bg-white hover:text-red-500 hover:border-red-500"
                >
                  Cancel Booking
                </button>
              </div>
            )}
            {bookingStatus === "Captain Arrived" && (
              <div>
                <p>
                  <strong>Provide OTP to Driver: </strong>{" "}
                  {bookingDetails.userId}
                  {bookingDetails.userId}
                  {"11"}
                </p>
              </div>
            )}
            {bookingStatus === "Completed" && (
              <div>
                <button
                  onClick={handleCompleteBooking}
                  className="bg-[#ee8c0a] text-white p-2 hover:bg-white hover:text-[#ee8c0a] hover:border-[#ee8c0a] border-2 focus:outline-none w-full"
                >
                  Make Payment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoaded && directionsResponse && (
        <div className="bg-white shadow-md rounded-lg p-2 shadow-gray-500">
          <p className="text-2xl mb-2 mx-2">Hello: {message}</p>
          <hr className="w-full h-0.5 bg-slate-900 mb-2" />
          <div className="h-96 w-full p-1 border-2 border-dashed border-[#ee8c0a]">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              options={{
                streetViewControl: true,
                mapTypeControl: true,
              }}
              zoom={14}
            >
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: "#00509E",
                    strokeWeight: 5,
                  },
                }}
              />
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
          </div>
        </div>
      )}

      {userData && driverDetails && <CustomerChatPage customerId={userData.userId} driverId={driverDetails.driverDTO.driverId}/>}
    </div>
  );
};

export default BookingInformation;
