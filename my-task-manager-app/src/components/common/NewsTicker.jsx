/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";



const NewsTicker = () => {
  const news = [
    {
      title: "New routes added to the system!",
      description:
        "We have introduced new routes to improve coverage across the city. Check them out today!",
    },
    {
      title: "Peak hours may experience delays.",
      description:
        "Please be aware of potential delays during peak hours. Plan your journey accordingly.",
    },
    {
      title: "Earn double rewards this weekend!",
      description:
        "This weekend only, earn double the rewards on all rides. Don't miss out!",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleDescription = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };
  // useEffect(()=>{
  // throw new Error('Crashed!!!!');
  // },[])
  return (
    <div className="p-6 text-justify bg-[#ee8c0a] shadow-slate-400 rounded-lg shadow-lg lg:mr-2 mx-auto mb-2 lg:mt-16  max-w-md">
      <div className="flex flex-row text-white text-2xl font-semibold mb-4 items-center justify-center text-center">
        <FaNewspaper className="mt-1 mr-1" />
        <h2>Latest Updates</h2>
      </div>
      <ul className="space-y-4">
        {news.map((item, index) => (
          <li
            key={index}
            className="p-4 bg-[#f7f7f7] rounded-lg duration-300 hover:scale-105 shadow-md"
          >
            <div
              onClick={() => toggleDescription(index)}
              className="cursor-pointer text-[#00509E] text-lg mb-2"
            >
              {item.title}
            </div>
            {openIndex === index && (
              <p className="text-[#6C757D] text-base">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsTicker;
