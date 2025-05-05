import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { PiRainbowCloudFill } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export default function Footer() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Placeholder for newsletter subscription logic
    toast.success(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="bg-gray-900 text-gray-100"
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 lg:py-8 ">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
            <div
              className="flex items-center gap-2 mb-3 cursor-pointer group "
              onClick={() => navigate("/")}
            >
              <PiRainbowCloudFill className="text-2xl sm:text-3xl lg:text-4xl text-indigo-500 group-hover:text-indigo-700 transition-all duration-300" />
              <span className="text-lg sm:text-xl lg:text-2xl  font-semibold italic text-indigo-500 group-hover:text-indigo-700 transition-all duration-300">
                BuySwift
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-200 mb-4">
              Your ultimate destination for premium products. Explore quality,
              style, and exclusive deals.
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              © {new Date().getFullYear()} BuySwift. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", to: "/" },
                { name: "Shop", to: "/shop" },
                // { name: "Orders", to: "/orderslist" },
                { name: "Favorite", to: "/favorite" },
                // { name: "Cart", to: "/cart  " },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-sm sm:text-base text-gray-200 hover:text-indigo-500 hover:underline transition-all duration-300 hover:scale-105 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {userInfo && (
                <li>
                  <Link
                    to={"/profile"}
                    className="text-sm sm:text-base text-gray-200 hover:text-indigo-500 hover:underline transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Profile
                  </Link>
                </li>
              )}
              {!userInfo && (
                <>
                  <li>
                    <Link
                      to={"/login"}
                      className="text-sm sm:text-base text-gray-200 hover:text-indigo-500 hover:underline transition-all duration-300 hover:scale-105 inline-block"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/register"}
                      className="text-sm sm:text-base text-gray-200 hover:text-indigo-500 hover:underline transition-all duration-300 hover:scale-105 inline-block"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Connect */}
          <div className="sm:col-span-2 sm:flex sm:justify-center lg:block  lg:col-span-1 ">
            <div className="w-full sm:w-[80%] lg:w-full  bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-lg sm:text-xl  text-gray-400 font-semibold  mb-3">
                Connect With Us
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-2">
                Will be available soon
              </p>
              <p className="text-sm sm:text-base text-gray-200 mb-4">
                Join our newsletter for exclusive offers and updates.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className="mt-6 sm:mt-8 lg:mt-10 border-t border-gray-700 pt-4 flex 
        flex-col sm:flex-row justify-between items-center"
        >
          <p
            className="text-xs sm:text-sm text-gray-400 hover:text-indigo-500 
          transition-all duration-300"
          >
            Powered by Raed Yassin
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {[
              { Icon: FaFacebook, href: "https://facebook.com" },
              { Icon: FaTwitter, href: "https://twitter.com" },
              { Icon: FaInstagram, href: "https://instagram.com" },
              { Icon: FaLinkedin, href: "https://linkedin.com" },
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 transition-all duration-300 transform hover:scale-125"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
