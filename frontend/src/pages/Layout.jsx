import { useEffect, useState } from "react";
// import Searchbar from "../components/searchbar/Searchbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { clearCartItems } from "../redux/features/cart/cartSlice";

export default function Layout() {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const dispatch = useDispatch();

  // Clear cart items on mount
  useEffect(() => {
    dispatch(clearCartItems());
  }, [dispatch]);

  // Reset showSidebarMenu on window resize
  // useEffect(() => {
  //   let timeout;
  //   const debouncedResize = () => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       if (window.innerWidth > 1024) {
  //         setShowSidebarMenu(false);
  //       }
  //     }, 100);
  //   };
  //   window.addEventListener("resize", debouncedResize);
  //   return () => {
  //     window.removeEventListener("resize", debouncedResize);
  //     clearTimeout(timeout);
  //   };
  // }, []);

  return (
    <>
      <ToastContainer autoClose={2000} style={{ top: "100px" }} />
      <Sidebar
        showSidebarMenu={showSidebarMenu}
        setShowSidebarMenu={setShowSidebarMenu}
      />

      {/* Searchbar */}
      {/* <div
        style={{ zIndex: 9999 }}
        className="fixed bg-white w-full pl-[0px] lg:pl-[70px] shadow-sm"
      >
        <Searchbar setShowSidebarMenu={setShowSidebarMenu} />
      </div> */}

      <main className="pt-20 lg:pt-15 ml-[0px]  lg:ml-[70px]">
        <Outlet />
      </main>
    </>
  );
}
