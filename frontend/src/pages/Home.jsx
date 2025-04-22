import { Link } from "react-router-dom";
import ProductCard from "./products/ProductCard";
import { useEffect, useRef } from "react";
import { useGetAllProductsPageQuery } from "../redux/apis/productApiSlice";
import Footer from "../components/Footer";
import HomeWelcome from "../components/HomeWelcome";
import {
  changeToLight,
  changeToDark,
} from "../redux/features/changeColorSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  changeToDarkSearchbar,
  changeToLightSearchbar,
} from "../redux/features/hoemSearchbarEffect";
export default function Home() {
  const welcomeRef = useRef(null);
  const searchbarPosition = useSelector((state) => state.searchbarPosition);
  const showSearchResult = useSelector((state) => state.showSearchReasult);
  useEffect(() => {
    window.document.title = "Cloud Dream store";
    window.scrollTo(0, 0);
  }, []);

  
  const { data } = useGetAllProductsPageQuery({});
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (showSearchResult) return;
        if (entries[0].isIntersecting) {
          dispatch(changeToDark());
          if (window.innerWidth < 1024) dispatch(changeToDarkSearchbar());
        } else {
          dispatch(changeToLight());
          if (window.innerWidth < 1024) dispatch(changeToLightSearchbar());
        }
      },
      {
        threshold: 0.001,
      }
    );
    if (welcomeRef.current) {
      observer.observe(welcomeRef.current);
    }
    return () => {
      if (welcomeRef.current) {
        observer.unobserve(welcomeRef.current);
      }
    };
  }, [dispatch, welcomeRef, showSearchResult, searchbarPosition]);

  return (
    <>
      <div ref={welcomeRef}>
        <HomeWelcome />
      </div>
      <main className="px-4 mt-10 md:px-20 lg:px-30 space-y-10">
        {/* Top Rating Products */}
        <div>
          <h1 className=" text-2xl font-semibold italic ">Top Rating Products</h1>
          <div>
            <div
              className="grid z-0 grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 
              xl:grid-cols-5 2xl:grid-cols-6  gap-2  mt-[1rem] 
              mb-[2rem] space-y-2" 
            >
              {data?.data?.products?.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
