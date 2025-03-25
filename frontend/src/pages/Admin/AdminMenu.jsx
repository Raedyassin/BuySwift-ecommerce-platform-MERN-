import { useState } from "react"
import { NavLink } from "react-router-dom"
import { FaTimes } from 'react-icons/fa'
import { TiThMenu } from "react-icons/ti";

export default function AdminMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  return (
    <>
      <button
        className={`${isMenuOpen ? "top-2 right-2" : "top-5 right-7"} 
        cursor-pointer p-2 fixed rounded-lg text-black hover:bg-gray-200 bg-gray-100`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? <FaTimes /> : <TiThMenu size={20} />}
      </button>
      {isMenuOpen && (
        <section className="bg-gray-50 rounded-2xl  fixed top-5 right-9">
          <ul className="list-none space-y-2 my-2">
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-gray-100 rounded-sm "
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "#0094D4" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-gray-100 rounded-sm "
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "#0094D4" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-gray-100 rounded-sm "
                to="/admin/createproduct"
                style={({ isActive }) => ({
                  color: isActive ? "#0094D4" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-gray-100 rounded-sm "
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "#0094D4" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-gray-100 rounded-sm "
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "#0094D4" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-gray-100 rounded-sm "
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "#0094D4" : "#000",
                  fontWeight: isActive ? "bold" : "normal",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
}
