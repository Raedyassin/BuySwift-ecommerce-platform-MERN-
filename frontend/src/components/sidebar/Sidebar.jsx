import "./sidebar.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";

import SelectedCounteSidebar from "../../pages/products/SelectedCounteSidebar";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RiLoginCircleLine, RiProductHuntLine } from "react-icons/ri";
// import { CiDeliveryTruck, CiHeart } from "react-icons/ci";
import { TbTruckDelivery } from "react-icons/tb";

import { IoMdHeartEmpty } from "react-icons/io";

import { MdAdminPanelSettings, MdOutlineCategory } from "react-icons/md";
import { FaTimes, FaKeyboard, FaRegPlusSquare } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaUsersLine } from "react-icons/fa6";
import { LiaWalletSolid } from "react-icons/lia";
import { useLocation } from "react-router-dom";
import {
  changeToDark,
  changeToLight,
} from "../../redux/features/changeColorSidebar";
import { chageToFixed } from "../../redux/features/chagneSearchbarPosition";
import { changeToLightSearchbar } from "../../redux/features/hoemSearchbarEffect";
import { showSearchResult } from "../../redux/features/searchResult";
import { TbUserHexagon } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { logOut } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/apis/userApiSlice";

export default function Sidebar({
  showSidebarMenu,
  setShowAdminMenu,
  showAdminMenu,
  setShowSidebarMenu,
}) {
  const { userInfo } = useSelector((state) => state.auth);
  const sidebarColor = useSelector((state) => state.changeColorSidebar);
  const searchbarPosition = useSelector((state) => state.searchbarPosition);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchbarPosition === "fixed") {
      dispatch(changeToLight());
    }
  }, [searchbarPosition, dispatch]);
  useEffect(() => {
    if (location.pathname === "/") dispatch(changeToDark());
    else dispatch(changeToLight());
  }, [location, dispatch]);
  const toggleDropDown = () => {
    if (showSidebarMenu === true) return;
    setDropDownOpen(!dropDownOpen);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
    setDropDownOpen(false);
  };
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setShowAdminMenu(false);
    }
  }, [setShowAdminMenu]);

  const [LogOutApi] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await LogOutApi().unwrap();
      navigate("/");
      dispatch(logOut());
      toast.success("You are logged out");
    } catch (err) {
      console.error(err.data.mesage);
    }
  };

  return (
    <div
      onMouseEnter={toggleSidebar}
      onMouseLeave={closeSidebar}
      style={{ zIndex: 10000 }}
      className={`${showSidebarMenu ? "block" : "hidden"}
      fixed top-0  w-full sm:w-[50%]  lg:top-0 left-0  overflow-auto
      lg:flex  transition-all duration-300 
      lg:flex-col lg:overflow-hidden justify-between p-4 pb-8 pt-2
      ${
        sidebarColor == "light"
          ? "lg:bg-white lg:text-black"
          : "lg:bg-gray-900 lg:text-white"
      }
      bg-white text-black
      lg:w-[70px] 
      lg:hover:w-[160px] h-[100vh]  group `}
      id="navigation-container"
    >
      {/* bg-white text-black */}
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
        {/* search */}
        <div
          onClick={() => {
            dispatch(showSearchResult());
            dispatch(changeToLightSearchbar());
            dispatch(chageToFixed());
            // if (searchbarPosition === "fixed")
            //   return dispatch(changeToRelative());
          }}
          className={` items-center hidden lg:flex  cursor-pointer gap-2 transition-transform 
            transform hover:translate-x-2  hover:text-indigo-800  `}
        >
          <div>
            <FiSearch className="my-[1rem] font-bold" size={24} />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] ">
            Search
          </span>
        </div>
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
            <IoMdHeartEmpty className=" my-[1rem] font-bold  " size={26} />
            <SelectedCounteSidebar selectorinStore="favorites" />
          </div>
          <span className=" lg:hidden group-hover:block my-[1rem] ">
            Favorite
          </span>
        </Link>
        {userInfo && (
          <>
            <Link
              to="/orderslist"
              onClick={() => setShowSidebarMenu(false)}
              className={`flex items-center  gap-2 transition-transform transform 
              hover:translate-x-2  hover:text-indigo-800 ${
                window.location.pathname === "/orderslist"
                  ? "text-indigo-600"
                  : ""
              } `}
            >
              <div>
                <TbTruckDelivery className="my-[1rem] font-bold" size={26} />
              </div>
              <span className=" lg:hidden group-hover:block my-[1rem] ">
                Orders
              </span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setShowSidebarMenu(false)}
              className={`lg:hidden group-hover:flex 
                items-center  gap-2 transition-transform transform 
              hover:translate-x-2  hover:text-indigo-800 ${
                window.location.pathname === "/profile" ? "text-indigo-600" : ""
              } `}
            >
              <div>
                <TbUserHexagon className="my-[1rem] font-bold" size={26} />
              </div>
              <span className=" lg:hidden group-hover:block my-[1rem] ">
                Profile
              </span>
            </Link>
            <div
              onClick={logoutHandler}
              className={`lg:hidden group-hover:flex items-center  gap-2 
                transition-transform transform 
              hover:translate-x-2 cursor-pointer hover:text-indigo-800 `}
            >
              <div>
                <RiLogoutCircleLine className="my-[1rem] font-bold" size={26} />
              </div>
              <span className=" lg:hidden group-hover:block my-[1rem] ">
                Logout
              </span>
            </div>
          </>
        )}
      </div>

      {/* user name */}
      <div className="realtive ">
        {userInfo?.isAdmin && showAdminMenu && (
          <button
            onMouseEnter={() =>
              setDropDownOpen(showSidebarMenu === true ? false : true)
            }
            onClick={toggleDropDown}
            // text-gray-800
            className={`flex cursor-pointer items-center flex-col justify-center 
                  ${
                    sidebarColor == "light"
                      ? "bg-white text-black"
                      : "bg-gray-900 text-white"
                  }
                  focus:outline-none hover:text-indigo-400 gap-1 ${
                    dropDownOpen ? "text-indigo-400" : ""
                  } transition-all duration-300`}
            id="admin-cion"
          >
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
          </button>
        )}

        {((dropDownOpen && userInfo) || (showSidebarMenu && userInfo)) && (
          <ul
            className={`relative lg:absolute lg:left-0 lg:top-0 mt-22 lg:mt-0 lg:space-y-0  lg:w-48
                lg:rounded overflow-hidden overflow-y-auto transition-all duration-300
                ${
                  sidebarColor == "light"
                    ? "lg:bg-white lg:text-black"
                    : "lg:bg-gray-900 lg:text-white"
                }
              bg-white text-black bottom-20  `}
            // lg:mt-2 bg-white text-gray-600 lg:bg-gray-100  lg:border  lg:border-gray-200`}
          >
            {userInfo.isAdmin && (
              <>
                <li
                  className={`px-1 lg:px-4 my-1 mt-4 ${
                    ["/admin/dashboard", "/admin/allproductslist"].includes(
                      window.location.pathname
                    )
                      ? "text-indigo-800"
                      : ""
                  } `}
                >
                  SHOW
                </li>
                <li>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4 
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
                    to="/admin/allproductslist"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4 
                      rounded my-1 
                      hover:text-indigo-800
                      transition-transform transform hover:translate-x-2
                      ${
                        window.location.pathname === "/admin/allproductslist"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <LiaWalletSolid />
                    <span>All Products</span>
                  </Link>
                </li>
                <li
                  className={`px-1 lg:px-4 my-1 mt-4 ${
                    [
                      "/admin/createproduct",
                      "/admin/productlist",
                      "/admin/categorylist",
                      "/admin/userlist",
                      "/admin/orderlist",
                    ].includes(window.location.pathname)
                      ? "text-indigo-800"
                      : ""
                  } `}
                >
                  MANGEMENT
                </li>
                <li>
                  <Link
                    to="/admin/createproduct"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4  rounded my-1 
                      transition-transform transform hover:translate-x-2
                      hover:text-indigo-800 ${
                        window.location.pathname === "/admin/createproduct"
                          ? "text-indigo-600"
                          : ""
                      } `}
                  >
                    <FaRegPlusSquare />
                    <span>Create Product</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    onClick={() => setShowSidebarMenu(false)}
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4  rounded my-1 
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
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4  rounded my-1 
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
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4 rounded my-1 
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
                    className={`flex items-center gap-1 px-4 lg:px-6 py-2 lg:py-4 rounded my-1 
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
