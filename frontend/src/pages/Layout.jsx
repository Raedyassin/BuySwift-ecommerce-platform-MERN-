import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Layout() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Sidebar />
      <main className={`ml-[6%]`}>
        <Outlet />
      </main>
    </>
  );
}
