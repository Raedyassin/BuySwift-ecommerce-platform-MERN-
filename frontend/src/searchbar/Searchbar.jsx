import { PiRainbowCloudFill } from "react-icons/pi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
// import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchForm from "./SearchForm";

export default function Searchbar({ setShowSidebarMenu }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  return (
    <div
      className="flex items-center flex-wrap w-full justify-between gap-2 
    px-4 py-2 sm:px-6 "
    >
      {/* Left side (Logo) */}
      <div
        onClick={goToHome}
        className="flex items-center gap-2 group text-indigo-500 cursor-pointer"
      >
        <PiRainbowCloudFill className="text-3xl sm:text-4xl md:text-5xl font-bold group-hover:text-indigo-700" />
        <span className="text-xl sm:text-2xl font-bold italic group-hover:text-indigo-700">
          Cloud Dream
        </span>
      </div>

      {/* Middle (Search Form) */}
      <div
        className="flex order-3 md:order-2 w-full  
      md:w-[50%] lg:w-[40%] items-center gap-2"
      >
        <SearchForm />
      </div>

      {/* Right side (Notifications, User, Menu) */}
      <div className="flex order-2 md:order-3 items-center gap-2 sm:gap-3">
        <div className="relative">
          <IoIosNotificationsOutline className="text-2xl sm:text-3xl cursor-pointer hover:text-indigo-600" />
          <div
            className="absolute text-[10px] sm:text-[12px] top-[-6px] sm:top-[-8px] left-[-3px] sm:left-[-4px] bg-indigo-500 
            rounded-full w-4 h-4 sm:w-5 sm:h-5 flex justify-center items-center text-white font-bold"
          >
            1
          </div>
        </div>
        {userInfo ? (
          <img
            src={userInfo?.img}
            alt="avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-indigo-500 rounded-full cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base cursor-pointer bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base cursor-pointer bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        )}
        <TiThMenu
          onClick={() => setShowSidebarMenu(prev => !prev)}
          className="text-xl text-gray-600 sm:text-2xl lg:hidden cursor-pointer 
          hover:text-indigo-600"
        />
      </div>
    </div>
  );
}
