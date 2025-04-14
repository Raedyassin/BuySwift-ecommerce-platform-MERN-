import { PiRainbowCloudFill } from "react-icons/pi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import {motion} from 'motion/react'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchForm from "./SearchForm";
import { toast } from "react-toastify";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useLogoutMutation } from "../../redux/apis/userApiSlice";
import { logOut } from "../../redux/features/auth/authSlice";
import { useState } from "react";
export default function Searchbar({
  setShowSidebarMenu,
  setSearchName,
  searchName,
  setShowResults,
}) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const goToHome = () => {
    navigate("/");
  };
  const [LogOutApi] = useLogoutMutation();
  const dispatch = useDispatch();
  const profileHandler = () => {
    navigate("/profile");
    setShowUserInfo(!showUserInfo);
  }
  const logoutHandler = async () => {
    try {
      await LogOutApi().unwrap();
      dispatch(logOut());
      toast.success("You are logged out");
      setShowUserInfo(false)
      navigate("/login");
    } catch (err) {
      console.log(err.data.mesage);
    }
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
        <SearchForm
          setSearchName={setSearchName}
          searchName={searchName}
          setShowResults={setShowResults}
        />
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
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative cursor-pointer"
          >
            <img
              onClick={() => setShowUserInfo(!showUserInfo)}
              onMouseEnter={() => setShowUserInfo(true)}
              onMouseLeave={() => setShowUserInfo(false)}
              src={userInfo?.img}
              alt={userInfo?.username}
              className="w-8 h-8 z-10 object-cover sm:w-10 sm:h-10 border-2 border-indigo-500 rounded-full cursor-pointer"
            />
            {showUserInfo && (
              <div
                className={`absolute   shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl pb-4 
                w-[8rem] md:w-[10rem] bg-white top-8  sm:top-10 right-0`}
              >
                <ul
                  onMouseLeave={() => setShowUserInfo(false)}
                  onMouseEnter={() => setShowUserInfo(true)}
                >
                  <li
                    className={`px-4 py-2 pt-4 font-semibold rounded text-[12px] sm:text-sm `}
                  >
                    {userInfo.username.length > 13
                      ? userInfo.username.subString(0, 13) + " ..."
                      : userInfo.username}
                  </li>
                  <li
                    className={`flex items-center gap-1 px-4 py-2 text-[12px] sm:text-sm rounded  
                        transition-transform transform hover:translate-x-2
                        hover:text-indigo-800 cursor-pointer`}
                    onClick={profileHandler}
                  >
                    <FaRegUserCircle />
                    <span>Profile</span>
                  </li>
                  <li>
                    <div
                      onClick={logoutHandler}
                      className={`w-full flex items-center  gap-1 px-4  py-2 rounded 
                        transition-transform transform hover:translate-x-2
                        cursor-pointer text-[12px] sm:text-sm 
                        hover:text-indigo-800`}
                    >
                      <RiLogoutCircleLine  />
                      <span>Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base cursor-pointer   text-gray-700 rounded-md border border-white hover:border-indigo-600 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base cursor-pointer   text-gray-700 rounded-md border border-white hover:border-indigo-600 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              // className="px-2 py-1 sm:px-3 sm:py-1 text-sm sm:text-base cursor-pointer bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        )}
        <TiThMenu
          onClick={() => setShowSidebarMenu((prev) => !prev)}
          className="text-xl text-gray-600 sm:text-2xl lg:hidden cursor-pointer 
          hover:text-indigo-600"
        />
      </div>
    </div>
  );
}
