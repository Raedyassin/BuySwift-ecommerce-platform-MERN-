import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";

export default function AdminMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`fixed z-50 p-2 rounded-full  cursor-pointer shadow-md hover:shadow-lg 
          transition-all duration-300 bg-gray-50 hover:bg-gray-100 text-gray-700 
            top-25 lg:top-20 right-2`}
        // isMenuOpen ? "top-25 lg:top-20 right-2" : "top-25 lg:top-20 right-2"
        // }`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? <FaTimes size={20} /> : <TiThMenu size={20} />}
      </button>
      {isMenuOpen && (
        <section
          className="fixed top-25 lg:top-20 right-7 bg-white shadow-xl rounded-xl p-4 
        w-64 z-40 transition-all duration-300 ease-in-out"
        >
          <ul className="list-none space-y-1">
            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/createproduct"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Manage Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Manage Users
              </NavLink>
            </li>

            <li>
              <NavLink
                className="block py-2.5 px-4 rounded-lg text-sm font-medium 
                text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "#615FFF" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Manage Category
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}
