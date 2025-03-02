import React from "react";
import CustomerNavbar from "../navbarComponents/CustomerNavbar";
import Footer from "./Footer";

const WhyBookiTo = () => {
  const sections = [
    {
      title: "What is BookiTo?",
      description:
        "BookiTo is a smart taxi booking platform designed to automate ride-hailing services, ensuring a seamless experience for both passengers and drivers. It offers real-time tracking, automated driver allocation, and multi-city operations to streamline mobility services efficiently.",
      imgSrc: "../../../public/Illustration/whatIsUndraw.png",
    },
    {
      title: "How BookiTo Works",
      description: (
        <ul className="list-decimal list-inside text-gray-600 text-lg mt-6 leading-relaxed">
          <li>Enter Ride Details: The user selects the pickup and drop-off location.</li>
          <li>Fare Calculation: The system calculates the fare based on the distance (per km) and car model pricing.</li>
          <li>Automated Driver Allocation: The nearest available driver is assigned automatically.</li>
          <li>Ride Tracking: Users receive real-time updates on driver location and ride status.</li>
          <li>Payment & Ratings: After ride completion, users can pay and rate the driver.</li>
        </ul>
      ),
      imgSrc: "../../../public/Illustration/wokringUndraw.png",
    },
    {
      title: "Dynamic Pricing Model",
      description:
        "Fares are calculated based on distance (per km) and car model pricing for fair and transparent pricing. Prices adapt based on demand and vehicle type.",
      imgSrc: "../../../public/Illustration/dyanmicPricing.png",
    },
    {
      title: "Automated Dispatch System",
      description:
        "The nearest available drivers are assigned automatically, reducing wait times and ensuring efficient ride allocation. Real-time tracking and notifications keep both customers and drivers informed.",
      imgSrc: "../../../public/Illustration/software.png",
    },
    {
      title: "Multi-City Operations",
      description:
        "Enables seamless taxi operations in multiple cities. Centralized fleet management ensures smooth and scalable business expansion.",
      imgSrc: "../../../public/Illustration/multicit.png",
    },
  ];

  return (
    <React.Fragment>
      <CustomerNavbar />
      <section className="pt-10 pb-10 bg-[#f7f7f7]">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-[#ee8c0a]">
              About us
            </h2>
            <p className="text-gray-700 text-justify mx-10 text-xl mt-4">
              BookiTo is your go-to platform for a seamless taxi booking experience.
              Discover the key features that enhance efficiency, transparency, and convenience
              for both customers and drivers.
            </p>
          </div>

          {sections.map((section, index) => (
            <div
              key={index}
              className={`text-center mb-12 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} flex flex-col lg:flex-row items-center mt-6 lg:mx-20 mx-16`}
            >
              <div className="lg:w-1/3 mx-2 my-2 flex justify-center">
                <img
                  className="w-full hover:scale-105 duration-300 max-w-md h-auto rounded-lg shadow-2xl"
                  src={section.imgSrc}
                  alt={section.title}
                />
              </div>
              <div className="lg:w-2/3 text-justify mt-4 lg:mt-0 lg:pl-12 lg:text-left">
                <h3 className="text-3xl font-semibold text-black">
                  {section.title}
                </h3>
                <div className="text-gray-600 text-lg mt-6 leading-relaxed">
                  {section.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </React.Fragment>
  );
};

export default WhyBookiTo;
