import { useEffect, useState } from "react";
import Searchbar from "../components/searchbar/Searchbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { clearCartItems } from "../redux/features/cart/cartSlice";
import SearchResults from "../components/searchbar/SearchResults";
import { AnimatePresence } from "framer-motion";

export default function Layout() {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(true);
  const [showResults, setShowResults] = useState(false);


  const [searchName, setSearchName] = useState("");

  const dispatch = useDispatch();

  // Clear cart items on mount
  useEffect(() => {
    dispatch(clearCartItems());
  }, [dispatch]);

  // Reset showSidebarMenu on window resize
  useEffect(() => {
    let timeout;
    const debouncedResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerWidth > 1024) {
          setShowSidebarMenu(false);
          setShowAdminMenu(true);
        }
        if (window.innerWidth < 1024) {
          setShowAdminMenu(false);
        }
      }, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <ToastContainer autoClose={2000} style={{ top: "100px" }} />
      <Sidebar
        showSidebarMenu={showSidebarMenu}
        setShowSidebarMenu={setShowSidebarMenu}
        showAdminMenu={showAdminMenu}
        setShowAdminMenu={setShowAdminMenu}
        setShowResults={setShowResults}
      />

      {/* Searchbar */}
      <div
        style={{ zIndex: 9999 }}
        className="fixed bg-white w-full pl-[0px] lg:pl-[70px] "
      >
        <Searchbar
          searchName={searchName}
          setSearchName={setSearchName}
          setShowSidebarMenu={setShowSidebarMenu}
          setShowResults={setShowResults}
        />
        <AnimatePresence>
          {showResults && (
            <SearchResults
              setShowResults={setShowResults}
              searchName={searchName}
            />
          )}
        </AnimatePresence>
      </div>

      <main className="pt-20 lg:pt-15 ml-[0px]  lg:ml-[70px]">
        <Outlet />
      </main>
    </>
  );
}
