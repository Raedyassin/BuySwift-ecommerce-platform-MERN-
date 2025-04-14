import "./sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectedCounteSidebar from "../../pages/products/SelectedCounteSidebar";

import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RiLoginCircleLine, RiProductHuntLine } from "react-icons/ri";
import { CiDeliveryTruck, CiHeart } from "react-icons/ci";
import { MdAdminPanelSettings, MdOutlineCategory } from "react-icons/md";
import { FaTimes, FaKeyboard } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaUsersLine } from "react-icons/fa6";

export default function Sidebar({ showSidebarMenu, setShowSidebarMenu }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropDown = () => {

    if(showSidebarMenu === true) return
    setDropDownOpen(!dropDownOpen);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
    setDropDownOpen(false);
  };

  return (
    <div
      onMouseEnter={toggleSidebar}
      onMouseLeave={closeSidebar}
      style={{ zIndex: 10000 }}
      className={`${showSidebarMenu ? "block" : "hidden"}
      fixed top-0  w-full sm:w-[50%]  lg:top-0 left-0  overflow-auto
      lg:flex  lg:transition-all lg:duration-500 
      lg:flex-col lg:overflow-hidden justify-between p-4 pb-8 pt-2 bg-white 
      text-black lg:w-[70px] 
      lg:hover:w-[150px] lg:h-[100vh]  group `}
      id="navigation-container"
    >
      {showSidebarMenu && (
        <FaTimes
          style={{ zIndex: 10000 }}
          onClick={() => setShowSidebarMenu(false)}
          className="absolute top-5 right-5 cursor-pointer p-2 rounded-full w-8 h-8
        shadow-md hover:bg-gray-300 hover:text-white
        "
        />
      )}

      {/* Links */}
      <div className="flex flex-col justify-center lg:space-y-2">
        <Link
          to="/"
          onClick={() => setShowSidebarMenu(false)}
          className={`flex items-center gap-2 transition-transform transform 
          hover:translate-x-2 hover:text-indigo-800
          ${window.location.pathname === "/" ? "text-indigo-600" : ""} `}
        >
          <div>
            <AiOutlineHome className="  my-[1rem] mt-[0.65rem]" size={26} />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] mt-[0.65rem ">
            Home
          </span>
        </Link>
        <Link
          to="/shop"
          onClick={() => setShowSidebarMenu(false)}
          className={`flex items-center gap-2 transition-transform transform 
          hover:translate-x-2  hover:text-indigo-800 ${
            window.location.pathname === "/shop" ? "text-indigo-600" : ""
          } `}
        >
          <div>
            <AiOutlineShopping className=" my-[1rem]" size={26} />
          </div>
          <span className=" lg:hidden group-hover:block  my-[1rem] ">Shop</span>
        </Link>
        <Link
          to="/cart"
          onClick={() => setShowSidebarMenu(false)}
          className={`flex  items-center gap-2 transition-transform transform 
          hover:translate-x-2 hover:text-indigo-800 ${
            window.location.pathname === "/cart" ? "text-indigo-600" : ""
          } `}
        >
          <div className="relative">
            <AiOutlineShoppingCart className=" my-[1rem]" size={26} />
            <SelectedCounteSidebar selectorinStore="cart.cartItems" />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] ">Cart</span>
        </Link>
        <Link
          to="/favorite"
          onClick={() => setShowSidebarMenu(false)}
          className={`flex  items-center  gap-2 transition-transform transform 
          hover:translate-x-2  hover:text-indigo-800 ${
            window.location.pathname === "/favorite" ? "text-indigo-600" : ""
          } `}
        >
          <div className="relative">
            <CiHeart className=" my-[1rem]" size={26} />
            <SelectedCounteSidebar selectorinStore="favorites" />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] ">
            Favorite
          </span>
        </Link>
        <Link
          to="/orderslist"
          onClick={() => setShowSidebarMenu(false)}
          className={`flex items-center  gap-2 transition-transform transform 
          hover:translate-x-2  hover:text-indigo-800 ${
            window.location.pathname === "/orderslist" ? "text-indigo-600" : ""
          } `}
        >
          <div>
            <CiDeliveryTruck className="my-[1rem]" size={26} />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] ">
            Orders
          </span>
        </Link>
      </div>

      {/* user name */}
      <div className="realtive ">
        <button
          onMouseEnter={() =>
            setDropDownOpen(showSidebarMenu === true ? false : true)
          }
          onClick={toggleDropDown}
          className={`flex cursor-pointer items-center flex-col justify-center 
          text-gray-800 focus:outline-none hover:text-indigo-400 gap-1 ${
            dropDownOpen ? "text-indigo-400" : ""
          }`}
          id="admin-cion"
        >
          {userInfo?.isAdmin && (
            <>
              <div
                className={`font-semibold text-sm italic `}
                id="text-admin-order"
              >
                Admin Menu{" "}
              </div>
              <div>
                <MdAdminPanelSettings size={26} />
                {/* <MdOutlineAdminPanelSettings size={26} /> */}
              </div>
            </>
          )}

        </button>

        {((dropDownOpen && userInfo) || (showSidebarMenu && userInfo)) && (
          <ul
            className={`relative lg:absolute lg:left-0 lg:top-0 mt-22 lg:mt-0 lg:space-y-0  lg:w-48
                lg:rounded 
              text-gray-600 bottom-20 bg-white `}
            // lg:mt-2 lg:bg-gray-100  lg:border  lg:border-gray-200`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-2 lg:px-4 py-2 lg:py-4 
                      rounded my-1 
                      hover:text-indigo-800
                      transition-transform transform hover:translate-x-2
                      ${
                        window.location.pathname === "/admin/dashboard"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <LuLayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-2 lg:px-4 py-2 lg:py-4  rounded my-1 
                      transition-transform transform hover:translate-x-2
                      hover:text-indigo-800 ${
                        window.location.pathname === "/admin/productlist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <RiProductHuntLine />
                    <span>Products</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-2 lg:px-4 py-2 lg:py-4  rounded my-1 
                      transition-transform transform hover:translate-x-2
                      hover:text-indigo-800 ${
                        window.location.pathname === "/admin/categorylist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <MdOutlineCategory />
                    <span>Category</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-2 lg:px-4 py-2 lg:py-4 rounded my-1 
                      transition-transform transform hover:translate-x-2
                      hover:text-indigo-800 ${
                        window.location.pathname === "/admin/orderlist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <FaKeyboard />
                    <span>Orders</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-2 lg:px-4 py-2 lg:py-4 rounded my-1 
                      transition-transform transform hover:translate-x-2
                      hover:text-indigo-800 ${
                        window.location.pathname === "/admin/userlist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <FaUsersLine />
                    <span>Users</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              onClick={() => setShowSidebarMenu(false)}
              className="flex items-center transition-transform transform 
                hover:translate-x-2 hover:text-indigo-800"
            >
              <RiLoginCircleLine className=" mr-2 mt-[2rem]" size={26} />
              <span className=" hidden group-hover:block mt-[2rem] ">
                Login
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              onClick={() => setShowSidebarMenu(false)}
              className="flex items-center transition-transform transform 
                  hover:translate-x-2 hover:text-indigo-800"
            >
              <AiOutlineUserAdd className=" mr-2 mt-[2rem]" size={26} />
              <span className=" hidden group-hover:block mt-[2rem] ">
                Register
              </span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
