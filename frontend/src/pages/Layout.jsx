import { useEffect, useState } from "react";
import Searchbar from "../components/searchbar/Searchbar";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import SearchResults from "../components/searchbar/SearchResults";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { chageToFixed, changeToRelative } from "../redux/features/chagneSearchbarPosition";
import { changeToLightSearchbar } from "../redux/features/hoemSearchbarEffect";
import {hiddenSearchResult} from '../redux/features/searchResult'
import Footer from '../components/Footer'
export default function Layout() {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(true);
  const [showSearchbarInHome, setShowSearchbarInHome] = useState(false);
  const location = useLocation();
  const searchbarPosition = useSelector((state) => state.searchbarPosition);
  const showSearchResult = useSelector((state) => state.showSearchReasult);
  const [searchName, setSearchName] = useState("");
  const dispatch = useDispatch();

  useEffect(() => { 
    if (location.pathname !== "/") {
      dispatch(changeToLightSearchbar());
    } 
  },[location, dispatch])

  // show the searchbar in home when usr refresh the page in small screen 
  // less than 1024
  useEffect(() => {
    if(window.innerWidth < 1024){
      setShowSearchbarInHome(true);
    }
  },[])
  // Reset showSidebarMenu on window resize
  useEffect(() => {
    let timeout;
    const debouncedResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerWidth > 1024) {
          setShowSidebarMenu(false);
          setShowAdminMenu(true);
          dispatch(changeToRelative());
          setShowSearchbarInHome(false);
          // if showResult is true close it
          dispatch(hiddenSearchResult());
        }
        if (window.innerWidth < 1024) {
          setShowAdminMenu(false);
          dispatch(chageToFixed());
          setShowSearchbarInHome(true);
        }
      }, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeout);
    };
  }, [dispatch, searchbarPosition]);

  return (
    <div className="">
      <ToastContainer autoClose={2000} style={{ top: "100px" }} />
      <Sidebar
        showSidebarMenu={showSidebarMenu}
        setShowSidebarMenu={setShowSidebarMenu}
        showAdminMenu={showAdminMenu}
        setShowAdminMenu={setShowAdminMenu}
      />

      {/* Searchbar */}
      <AnimatePresence>
        {((location.pathname !== "/" &&
          location.pathname !== "/login" &&
          location.pathname !== "/register") ||
          searchbarPosition === "fixed" ||
          showSearchbarInHome === true) && (
          <div
            style={{ zIndex: 9999 }}
            className={`fixed ${
              searchbarPosition === "fixed" ? "lg:fixed" : "lg:relative"
            } bg-white w-full pl-[0px] lg:pl-[70px] `}
          >
            <Searchbar
              searchName={searchName}
              setSearchName={setSearchName}
              setShowSidebarMenu={setShowSidebarMenu}
            />
            {showSearchResult && (
              <div>
                <SearchResults searchName={searchName} />
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      <main className={`pt-24 sm:pt-15 lg:pt-0 ml-[0px] lg:ml-[70px]`}>
        <Outlet />
      </main>

      {!(location.pathname === "/orderslist" ||
        location.pathname === "/login" ||
        location.pathname === "/register") && (
        <div className="mt-[6rem] pl-[0px] lg:pl-[70px] ">
          <Footer />
        </div>
      )}
    </div>
  );
}
