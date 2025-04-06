import "./sidebar.css";
import { useState } from "react";
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

export default function zSidebar({ setChangeWidth }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    setChangeWidth((state) => !state);
  };
  const closeSidebar = () => {
    setChangeWidth((state) => !state);
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
      className={`${showSidebar ? "hidden" : "flex"} xl:flex lg:flex md:hidden 
      hidden flex-col justify-between p-4 bg-gray-100  text-black w-[5%]
      hover:w-[10%] h-[100vh] fixed `}
      id="navigation-container"
    >
      <div className="flex flex-col  justify-center space-y-2">
        <Link
          to="/"
          className="flex items-center transition-transform transform 
          hover:translate-x-2 "
        >
          <AiOutlineHome className=" mr-2 mt-[2rem]" size={26} />
          <span className=" hidden nav-item-name mt-[2rem] ">Home</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center transition-transform transform 
          hover:translate-x-2 "
        >
          <AiOutlineShopping className=" mr-2 mt-[2rem]" size={26} />
          <span className=" hidden nav-item-name mt-[2rem] ">Shop</span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform 
          hover:translate-x-2 "
        >
          <AiOutlineShoppingCart className=" mr-2 mt-[2rem]" size={26} />
          <span className=" hidden nav-item-name mt-[2rem] ">Cart</span>
          <SelectedCounteSidebar selectorinStore="cart.cartItems" />
        </Link>
        <Link
          to="/favorite"
          className="flex items-center transition-transform transform 
          hover:translate-x-2 "
        >
          <CiHeart className=" mr-2 mt-[2rem]" size={26} />
          <span className=" hidden nav-item-name mt-[2rem] ">Favorite</span>
          <SelectedCounteSidebar selectorinStore="favorites" />
        </Link>
        <Link
          to="/orderslist"
          className="flex items-center transition-transform transform 
          hover:translate-x-2 "
        >
          <CiDeliveryTruck className=" mr-2 mt-[2rem]" size={26} />
          <span className=" hidden nav-item-name mt-[2rem] ">Orders</span>
        </Link>
      </div>

      <div className="realtive">
        <button
          onMouseEnter={() => setDropDownOpen(true)}
          onClick={toggleDropDown}
          className="flex cursor-pointer items-center flex-wrap justify-center text-gray-800 focus:outline-none"
        >
          {userInfo ? <span>{userInfo.username}</span> : <></>}
          {userInfo &&
            (dropDownOpen ? (
              <RiArrowDropUpLine size={26} />
            ) : (
              <RiArrowDropDownLine size={26} />
            ))}
        </button>
        {dropDownOpen && userInfo && (
          <ul
            className={`absolute left-0 mt-2 space-y-1  w-48  rounded 
            text-gray-600 bottom-20 bg-gray-100  border border-gray-200`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2  hover:bg-gray-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                Profile
              </Link>
            </li>
            <li>
              <div
                onClick={logoutHandler}
                className="w-full block px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </div>
            </li>
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform 
            hover:translate-x-2 "
            >
              <AiOutlineLogin className=" mr-2 mt-[2rem]" size={26} />
              <span className=" hidden nav-item-name mt-[2rem] ">Login</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center transition-transform transform 
                  hover:translate-x-2 "
            >
              <AiOutlineUserAdd className=" mr-2 mt-[2rem]" size={26} />
              <span className=" hidden nav-item-name mt-[2rem] ">Register</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
