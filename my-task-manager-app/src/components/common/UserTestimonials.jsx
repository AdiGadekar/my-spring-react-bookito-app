/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { getDriverRatings } from "../../services/api";
import AuthContext from "../../context/AuthContext";
import { LocalSpinnerAnimation } from "./Spinner";

const UserTestimonials = () => {
  const { userData } = useContext(AuthContext);
  const [driverRatings, setDriverRatings] = useState();
  const [customLoading, setcustomLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
     try{
      if (userData.driverDTO) {
        const response = await getDriverRatings(userData.driverDTO.driverId);
        setDriverRatings(response.data);
      } else {
        const response = await getDriverRatings(7);
        setDriverRatings(response.data);
      }
      setcustomLoading(false)
     }catch(error){
      console.error(error)
     }
    };
    fetchRatings();
  }, []);


  // useEffect(() => {
  //   throw new Error('Crashed!!!!');
  // }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg shadow-slate-400 mt-6 ml-5 p-6 space-y-4 mr-5 mb-4 ">
      <h2 className="text-[#00509E] text-xl font-semibold mb-4">
        Customer Feedback
      </h2>
      {customLoading === true ? (
        <LocalSpinnerAnimation />
      ) : (
        <ul className="space-y-4">
          {driverRatings.length>0 ? (
            driverRatings.map((driverRating, index) => (
              <li key={index} className="border-b pb-3">
                <p className="text-[#6C757D] italic">
                  &ldquo;{driverRating.comment}&ldquo;
                </p>
                <p className="text-sm text-[#6C757D]">
                  - {driverRating.customerName}
                </p>
              </li>
            ))
          ) : (
            <div>
              <p className="text-[#6C757D] italic">No Customer Feedback Yet.</p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserTestimonials;
