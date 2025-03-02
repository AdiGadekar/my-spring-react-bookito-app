import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import useAuthData from "../../services/useAuthData";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const { loginResult } = useAuthData();
  return (
    <footer className="bg-cover bg-center bg-no-repeat py-10 px-5 text-white bg-slate-900">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img
            src="..../../../CarLogo/image-removebg-preview.png"
            alt="logo"
            className="w-20 h-10 mb-4"
          />

          <p className="text-gray-200 text-sm leading-6">
            BookiTo is your go-to platform for a seamless taxi booking
            experience. Discover the key features that enhance efficiency,
            transparency, and convenience for both customers and drivers.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-yellow-400">
                Features
              </a>
            </li>
            {loginResult?.role === "Customer" || loginResult?.role === "Admin" ? (
              <li>
                <NavLink
                  to={"/www.bookito.com/about"}
                  className="hover:text-yellow-400"
                >
                  About
                </NavLink>
              </li>
            ) : (
              <></>
            )}
            <li>
              <a href="#" className="hover:text-yellow-400">
                Geo Analytics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Partners
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400">
                Product Updates
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <address className="text-sm text-gray-200">
            <p>4830, West Kennedy Blvd Suite 600, Tampa, Florida, 33609, USA</p>
            <p>Plot No 10, Rajiv Gandhi Technology Park, Chandigarh - 160101</p>
            <p>
              1005, HDS Business Centre, Cluster M, Al Thanyah Fifth (JLT),
              Dubai, U.A.E.
            </p>
            <p className="mt-2">
              Email:{" "}
              <a href="#" className="text-yellow-400">
                taxi@bookito.in
              </a>
            </p>
          </address>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              target="_blank"
              className="text-xl text-gray-300 hover:text-yellow-400"
            >
              <FaFacebookF />
            </a>
            <a href="#" className="text-xl text-gray-300 hover:text-yellow-400">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-xl text-gray-300 hover:text-yellow-400">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
