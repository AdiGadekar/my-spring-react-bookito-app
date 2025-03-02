/* eslint-disable no-unused-vars */
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const carBrands = [
  { src: "../../../CarLogo/nissanLogo.png", name: "Nissan" },
  { src: "../../../CarLogo/toyotaLogo.png", name: "Toyota" },
  { src: "../../../CarLogo/hondaLogo.png", name: "Honda" },
  { src: "../../../CarLogo/fordLogo.png", name: "Ford" },
  { src: "../../../CarLogo/bmwLogo.png", name: "BMW" },
  { src: "../../../CarLogo/audiLogo.png", name: "Audi" },
  { src: "../../../CarLogo/mercedesLogo.png", name: "Mercedes-Benz" },
  { src: "../../../CarLogo/hyundaiLogo.png", name: "Hyundai" },
  { src: "../../../CarLogo/teslaLogo.png", name: "Tesla" },
  { src: "../../../CarLogo/kiaLogo.png", name: "Kia" },
  { src: "../../../CarLogo/volkswagenLogo.png", name: "Volkswagen" },
  { src: "../../../CarLogo/chevroletLogo.png", name: "Chevrolet" },
  { src: "../../../CarLogo/subaruLogo.png", name: "Subaru" },
  { src: "../../../CarLogo/mazdaLogo.png", name: "Mazda" },
  { src: "../../../CarLogo/jeepLogo.png", name: "Jeep" },
  { src: "../../../CarLogo/volvoLogo.png", name: "Volvo" },
  { src: "../../../CarLogo/landroverLogo.png", name: "Land Rover" },
  { src: "../../../CarLogo/porscheLogo.png", name: "Porsche" },
  { src: "../../../CarLogo/jaguarLogo.png", name: "Jaguar" },
  { src: "../../../CarLogo/fiatLogo.png", name: "Fiat" },
];

const ClientsCarousel = () => {
  return (
    <section className="pb-12 py-4 bg-[#f7f7f7] mx-1">
      <div className="container mx-auto text-center">
        <h2 className="text-5xl font-bold text-[#ee8c0a]">Our Car Brands</h2>
        <p className="text-slate-900 italic text-center mx-10 text-xl mt-4">
          Experience the pinnacle of luxury and impeccable service with our
          renowned car brands. Book a ride with us today and elevate your
          journey to new heights.
        </p>

        {[0, 10].map((startIndex) => (
          <Swiper
            key={startIndex}
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            className="mt-6"
          >
            {carBrands
              .slice(startIndex, startIndex + 10)
              .map((brand, index) => (
                <SwiperSlide
                  key={index}
                  className="flex justify-center p-2 border-0"
                >
                  <div className="shadow-lg transform hover:scale-105 hover:shadow-[#ee8c0a] hover:shadow-xl transition duration-300 shadow-slate-400 rounded-2xl p-5 w-30 h-30 flex flex-col items-center justify-center bg-white">
                    <img
                      src={brand.src}
                      alt={brand.name}
                      className="h-16 w-auto object-contain mb-2"
                    />
                    <p className="text-slate-900 italic text-lg font-medium">
                      {brand.name}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        ))}
      </div>
    </section>
  );
};

export default ClientsCarousel;
