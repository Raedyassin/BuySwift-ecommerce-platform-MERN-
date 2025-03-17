import {  useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { clearCartItems } from "../redux/features/cart/cartSlice";
export default function Layout() {

  // const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearCartItems());
    // console.log("cart", cart);
  }, []);
  
  const [changeWidth, setChangeWidth] = useState(false);
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Sidebar setChangeWidth={setChangeWidth} />
      <main className={`main-content ${changeWidth ? "ml-[10%]" : "ml-[5%]"} `}>
        <Outlet />
      </main>
    </>
  );
}
