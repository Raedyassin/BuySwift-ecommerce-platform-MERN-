import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Layout() {
  const [changeWidth, setChangeWidth] = useState(false);
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Sidebar setChangeWidth={setChangeWidth} />
      <main className={`main-content ${changeWidth ? "ml-[11%]" : "ml-[6%]"} `}>
        <Outlet />
      </main>
    </>
  );
}
