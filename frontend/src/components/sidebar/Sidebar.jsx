// import "./sidebar.css";
import {  useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";

import { CiHeart } from "react-icons/ci";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/apis/userApiSlice";
import { logOut } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import SelectedCounteSidebar from "../../pages/products/SelectedCounteSidebar";
import { FaTimes } from "react-icons/fa";

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
    // setChangeWidth((state) => !state);
  };
  const closeSidebar = () => {
    // setChangeWidth((state) => !state);
    setShowSidebar(false);
    setDropDownOpen(false);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [LogOutApi] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await LogOutApi().unwrap();
      dispatch(logOut());
      toast.success("You are logged out");
      setShowSidebarMenu(false)
      navigate("/login");
    } catch (err) {
      console.log(err.data.mesage);
    }
  };

  return (
    <div
      onMouseEnter={toggleSidebar}
      onMouseLeave={closeSidebar}
      style={{ zIndex: 10000 }}
      className={`${showSidebarMenu ? "block" : "hidden"}
      fixed top-0  w-full sm:w-[50%] border-r border-gray-200 lg:top-0 left-0  overflow-auto
      lg:flex  lg:transition-all lg:duration-500 
      lg:flex-col lg:overflow-hidden justify-between p-4 pt-2 bg-white lg:bg-gray-100  text-black lg:w-[70px] 
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
            <AiOutlineHome className="  my-[1rem] " size={26} />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] ">Home</span>
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
          className="flex cursor-pointer items-center flex-wrap justify-center 
          text-gray-800 focus:outline-none"
        >
          {userInfo ? (
            <span className="font-semibold hover:text-indigo-600">
              {userInfo.username}
            </span>
          ) : (
            <></>
          )}
          {userInfo &&
            (dropDownOpen ? (
              <RiArrowDropUpLine size={26} />
            ) : (
              <RiArrowDropDownLine size={26} />
            ))}
        </button>

        {(((dropDownOpen && userInfo) || (showSidebarMenu && userInfo))
          && (
            <ul
              className={`relative lg:absolute lg:left-0 mt-22 lg:mt-2 lg:space-y-1  lg:w-48
                lg:rounded overflow-auto
            text-gray-600 bottom-20 bg-white lg:bg-gray-100  lg:border lg:border-gray-200`}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowSidebarMenu(false)}
                      className={`block px-2 lg:px-4 py-2 rounded my-1  hover:bg-gray-200 hover:text-indigo-800 ${
                        window.location.pathname === "/admin/dashboard"
                          ? "text-indigo-600"
                          : ""
                      } `}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      onClick={() => setShowSidebarMenu(false)}
                      className={`block px-2 lg:px-4 py-2 rounded my-1 hover:bg-gray-200 hover:text-indigo-800 ${
                        window.location.pathname === "/admin/productlist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      onClick={() => setShowSidebarMenu(false)}
                      className={`block px-2 lg:px-4 py-2 rounded my-1 hover:bg-gray-200 hover:text-indigo-800 ${
                        window.location.pathname === "/admin/categorylist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      onClick={() => setShowSidebarMenu(false)}
                      className={`block px-2 lg:px-4 py-2 rounded my-1 hover:bg-gray-200 hover:text-indigo-800 ${
                        window.location.pathname === "/admin/orderlist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      onClick={() => setShowSidebarMenu(false)}
                      className={`block px-2 lg:px-4 py-2 rounded my-1 hover:bg-gray-200 hover:text-indigo-800 ${
                        window.location.pathname === "/admin/userlist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/profile"
                  onClick={() => setShowSidebarMenu(false)}
                  className={`block px-2 lg:px-4 py-2 rounded my-1 hover:bg-gray-200 hover:text-indigo-800 ${
                    window.location.pathname === "/profile"
                      ? "text-indigo-600"
                      : ""
                  } `}
                >
                  Profile
                </Link>
              </li>
              <li>
                <div
                  onClick={logoutHandler}
                  className={`w-full block px-2 lg:px-4 py-2 rounded my-1 hover:bg-gray-200 cursor-pointer
                  hover:text-indigo-800`}
                >
                  Logout
                </div>
              </li>
            </ul>
          ))}
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
              <AiOutlineLogin className=" mr-2 mt-[2rem]" size={26} />
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
