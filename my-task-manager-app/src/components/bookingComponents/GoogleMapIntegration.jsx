/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  FaLocationArrow,
  FaCalendarAlt,
  FaRoad,
  FaClock,
  FaIdeal,
  FaFilter,
  FaTaxi,
} from "react-icons/fa";
import { createBooking, viewAllAvialbleTaxiModel } from "../../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { SpinnerAnimation } from "../common/Spinner";
import useAuthData from "../../services/useAuthData";
import { useMemo } from "react";

function GoogleMapIntegration({ originVal,destinationVal }) {
  const{loading,loginResult} = useAuthData();
  const userData = loginResult;
  const navigate = useNavigate();
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const calculateButtonRef = useRef();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [taxis, setTaxis] = useState([]);
  const [selectedTaxi, setSelectedTaxi] = useState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [center, setCenter] = useState();
  const [maxPrice, setMaxPrice] = useState(1000);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [customLoading, setcustomLoading] = useState(false);
  const selectRef = useRef(null);

  const libraries = useMemo(() => ["places"], []);


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_URL,
    libraries,  
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          toast.error(
            "Unable to fetch your location. Using default location.",
            { autoClose: 800 }
          );
        }
      );
    }
  };
  if (!isLoaded) {
    return <><SpinnerAnimation/></>;
  }

  const handleToggle = () => {
    handleInputChange(  )
    setUseCurrentLocation((prev) => !prev);
    if (!useCurrentLocation) {
      originRef.current.value = "📍Current location";
      originRef.current.disabled = true;
      destinationRef.current?.focus();
    } else {
      originRef.current.value = "";
      originRef.current.disabled = false;
    }
  };

  async function calculateRoute() {
    setcustomLoading(true);
    setTimeout(() => {
      setcustomLoading(false);
    }, 1000);
    if (originRef.current.value.trim() === "" || destinationRef.current.value.trim() === "") {
      toast.warn("Enter the location details!!! ", { autoClose: 800 });
      return;
    }
    const directionsService = new google.maps.DirectionsService();

    try {
      setcustomLoading(true);
      const originLocation =
        originRef.current.value === "📍Current location"
          ? new google.maps.LatLng(center.lat, center.lng)
          : originRef.current.value.trim();

      const results = await directionsService.route({
        origin: originLocation,
        destination: destinationRef.current.value.trim(),
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
      
      try {
        const response = await viewAllAvialbleTaxiModel();
        setTaxis(response.data.body);
        setDropdownVisible(true);
      } catch (error) {
        toast.error("Error fetching available taxis. Please try after some time.",{autoClose:800})
        setTaxis([]);
      }
    } catch (error) {
      clearRoute();
      toast.error(
        "Error calculating route. Sorry, we don't provide service at this route",
        { autoClose: 2000 }
      );
    }finally{
      setcustomLoading(false);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setDropdownVisible(false);
    originRef.current.value = "";
    originRef.current.disabled = false;
    destinationRef.current.value = "";
    setTaxis([]);
    setSelectedTaxi(null);
    setUseCurrentLocation(false);
    setMaxPrice(1000);
  }

  const handleBooking = async () => {
    if (
      !originRef.current.value.trim() ||
      !destinationRef.current.value.trim() ||
      !distance ||
      !duration ||
      !selectedTaxi
    ) {
      toast.warn("Please fill all fields before submitting!");
      return;
    }

    const distanceValue = parseFloat(
      distance.replace(" km", "").replace(",", "")
    );

    const totalPrice = (selectedTaxi.pricePerKm * distanceValue).toFixed(2);

    const bookingDetailsHtml = `
       <div style="text-align: left;"> 
          <p><i class="fa fa-map-marker" style="color: #ee8c0a;"></i> <strong>Pickup Location:</strong> ${originRef.current.value.trim()}</p>
          <p><i class="fa fa-map-marker" style="color: #ee8c0a;"></i> <strong>Dropoff Location:</strong> ${destinationRef.current.value.trim()}</p>
          <hr/>
          <hr/>
          <hr/>
          <p><i class="fa fa-road" style="color: #ee8c0a;"></i> <strong>Distance:</strong> ${distance}</p>
          <p><i class="fa fa-clock-o" style="color: #ee8c0a;"></i> <strong>Duration:</strong> ${duration}</p>
          <p><i class="fa fa-taxi" style="color: #ee8c0a;"></i> <strong>Taxi Model:</strong> ${selectedTaxi.model}</p>
          <p><i class="fa fa-money" style="color: #ee8c0a;"></i> <strong>Total Price:</strong> ₹${totalPrice}</p>
        </div>
    `;

    const result = await Swal.fire({
      title: "Confirm Booking Details",
      html:bookingDetailsHtml ,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    });

    if (result.isConfirmed) {
      setcustomLoading(true);
      let pickupLocation = originRef.current.value;

      if (pickupLocation === "📍Current location") {
        pickupLocation = await getAddressFromCoordinates(
          center.lat,
          center.lng
        );
      }

      
      const bookingDTO = {
        userId: userData.userId,
        taxiId: selectedTaxi.taxiId,
        driverId: null,
        pickupLocation: pickupLocation,
        dropoffLocation: destinationRef.current.value.trim(),
        status: "Pending",
        distance: parseFloat(distance.replace(" km", "")),
        carModel: selectedTaxi.model,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        paymentDTO: null,
      };
      try {
        const response = await createBooking(bookingDTO);
        setcustomLoading(false);
        if (response.status ===  201) {
          setBookingDetails(response.data.body);
          setShowNotification(true);
          Swal.fire({
            title: "Booking Success",
            text: "Your booking has been successfully created!",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "custom-confirm-button",
            },
            timer: 1000,
            timerProgressBar: true,
          });
          setTimeout(() => {
            navigate("/www.bookito.com/customerTaxiBooking", {
              state: {
                userData: userData,
                actionType: "ShowCreatedBooking",
                bookingId: response.data.body.bookingId,
              },
            });
          }, 4000);
        } else {
          toast.error("Booking Not Completed due to: " + response.data.body);
          clearRoute();
        }
      } catch (error) {
        setcustomLoading(false);
        toast.error(
          error.response?.data.body ||
            "An error occurred during booking. Please try again."
        );
      }
    } else {
      // clearRoute();
    }
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_API_URL;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        console.error("Geocoding failed:", data.status);
        return "Unknown Location";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown Location";
    }
  };

  const handleTaxiChange = (e) => {
    const selectedTaxiId = e.target.value;
    const selectedTaxiObj = taxis.find(
      (taxi) => taxi.taxiId === parseInt(selectedTaxiId)
    );
    setSelectedTaxi(selectedTaxiObj);
  };

  if (!isLoaded) {
    return <div className="text-center"><SpinnerAnimation/></div>;
  }

  const handleInputChange = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setDropdownVisible(false);
  };

  const distanceValue =
    parseFloat(distance.replace(",", "").replace(" km", "")) || 0;

  const filteredTaxis = taxis.filter(
    (taxi) => (taxi.pricePerKm || 0) * distanceValue <= maxPrice
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-row items-center justify-center">
      {customLoading === true && <SpinnerAnimation />}

      <div className="flex flex-col md:flex-row w-full max-w-screen-2xl mx-auto p-4 gap-6">
        <div className="flex flex-col bg-white shadow-xl shadow-slate-500 rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border border-gray-300 rounded-lg">
              <Autocomplete>
                <input
                  maxLength={100}
                  type="text"
                  placeholder="Enter the Origin Location"
                  ref={originRef}
                  defaultValue={originVal || ""}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  disabled={useCurrentLocation}
                />
              </Autocomplete>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    maxLength={100}
                    type="checkbox"
                    className="hidden peer"
                    checked={useCurrentLocation}
                    onChange={handleToggle}
                  />
                  <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-orange-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:left-0 after:top-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all"></div>
                </div>
                <span className="text-gray-600 ml-2">Current Location</span>
              </label>
            </div>

            <div>
              <Autocomplete>
                <input
                  type="text"
                  onChange={handleInputChange}
                  placeholder="Enter the Destination Location"
                  ref={destinationRef}
                  defaultValue={destinationVal || ""}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </Autocomplete>
            </div>
          </div>

          <div className="flex flex-row space-x-4 mx-auto">
            <button
              ref={calculateButtonRef}
              className="customeApplicationButton rounded-lg"
              onClick={calculateRoute}
            >
              Calculate Route
            </button>
            {originRef.current && destinationRef.current && (
              <button
                className="px-4 py-2 border-2 bg-gray-500 hover:scale-100 duration-300 font-extrabold text-white rounded-lg hover:border-2  hover:bg-white hover:text-gray-500  hover:border-gray-500"
                onClick={clearRoute}
              >
                Clear Route
              </button>
            )}
          </div>
          {
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-40 h-px bg-slate-900 " />
              <span className="px-3 font-medium text-gray-900 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                {"🚕🚕🚕"}{" "}
              </span>
              <hr className="w-40 h-px bg-slate-900 " />
            </div>
          }
          <div className="flex  space-x-6 mt-4 text-lg items-center">
            {distance && (
              <div className="flex flex-row items-center text-gray-800">
                <FaRoad className="text-orange-400 text-xl mr-2" />
                <p className="font-semibold">Distance: </p>
                <span className="ml-1 underline">{distance}</span>
              </div>
            )}
            {duration && (
              <div className="flex flex-row items-start text-gray-800">
                <FaClock className="text-orange-400 text-xl mr-2 mt-1" />
                <p className="font-semibold">Duration:</p>
                <p className="ml-1 underline">{duration}</p>
              </div>
            )}
          </div>

          {dropdownVisible && (
            <div className="mt-6">
              <label className="flex flex-row font-semibold text-gray-700 mb-2">
                <FaFilter className="mt-1 mr-1 text-[#ee8c0a] text-xl" />
                Filter by Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="50000"
                color="#ee8c0a"
                step="100"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  {
                    console.log("click");
                  }
                  selectRef.current.focus();
                }}
                className="w-full accent-[#ee8c0a] bg-white rounded-lg"
              />
              <label className="flex flex-row font-semibold text-gray-700 mt-4">
                <FaTaxi className="mt-1 mr-1 text-orange-400 text-xl" />
                Select Taxi
              </label>
              <select
                ref={selectRef}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                value={selectedTaxi ? selectedTaxi.taxiId : ""}
                onChange={handleTaxiChange}
              >
                <option value="">-- Select a Taxi --</option>
                {filteredTaxis.length > 0 ? (
                  filteredTaxis.map((taxi) => {
                    const pricePerKm = taxi.pricePerKm || 0;
                    const distanceValue =
                      parseFloat(
                        distance.replace(",", "").replace(" km", "")
                      ) || 0;
                    return (
                      <option
                        key={taxi.taxiId}
                        value={taxi.taxiId}
                        className="p-2 text-lg font-medium"
                      >
                        {taxi.model} - ₹
                        {(pricePerKm * distanceValue).toFixed(2)}
                      </option>
                    );
                  })
                ) : (
                  <option>No taxis available</option>
                )}
              </select>
            </div>
          )}

          {dropdownVisible && (
            <button
              className="px-4 py-2 border-2 bg-green-500  font-extrabold text-white rounded-lg hover:border-2  hover:bg-white hover:text-green-500  hover:border-green-500"
              onClick={handleBooking}
            >
              Submit for Booking
            </button>
          )}

          {showNotification && bookingDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-55 z-50">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white rounded-t-2xl shadow-lg w-full max-w-screen-md px-6 py-6 fixed bottom-0 transform"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-green-600">
                    Hurrayyyy Booking Successful!🎉🎉
                  </h2>
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <FaIdeal className="text-blue-500 mr-2" />
                    <h3 className="text-md font-semibold text-gray-800">
                      Booking Details
                    </h3>
                  </div>
                  <ul className="ml-6 text-sm text-gray-600">
                    <li className="flex items-center mb-4">
                      <FaLocationArrow className="text-blue-500 mr-2" />
                      <strong className="mx-1">Pickup Location:</strong>{" "}
                      {bookingDetails.pickupLocation === "??Current location"
                        ? "📍Current location"
                        : bookingDetails.pickupLocation}
                    </li>
                    <li className="flex items-center mb-4">
                      <FaLocationArrow className="text-red-500 mr-2" />
                      <strong className="mx-1">Dropoff Location:</strong>
                      {bookingDetails.dropoffLocation}
                    </li>
                    <li className="flex items-center">
                      <FaCalendarAlt className="text-yellow-500 mr-2" />
                      <strong className="mx-1">Booked At:</strong>{" "}
                      {new Date(bookingDetails.createdAt).toLocaleString()}
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        <div className="flex-grow h-[450px] md:h-[600px] p-1 bg-gray-100 rounded-lg border-2 border-dashed border-[#ee8c0a] shadow-lg ">
          <GoogleMap
            center={center}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              streetViewControl: true,
              zoomControl: true,
            }}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default GoogleMapIntegration;
