import ProductCard from "./products/ProductCard";
import { useEffect, useRef, useState } from "react";
import { useGetHomeProductsQuery } from "../redux/apis/productApiSlice";
import HomeWelcome from "../components/HomeWelcome";
import { motion } from "motion/react";
import {
  changeToLight,
  changeToDark,
} from "../redux/features/changeColorSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  changeToDarkSearchbar,
  changeToLightSearchbar,
} from "../redux/features/hoemSearchbarEffect";
import PageHeader from "../components/PageHeader";
import ProductLoader from "./products/ProductLoader";
export default function Home() {
  const welcomeRef = useRef(null);
  const searchbarPosition = useSelector((state) => state.searchbarPosition);
  const showSearchResult = useSelector((state) => state.showSearchReasult);
  useEffect(() => {
    window.document.title = "Cloud Dream store";
    window.scrollTo(0, 0);
  }, []);

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { data: homeProducts, isLoading } = useGetHomeProductsQuery();
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
        threshold: 0.3,
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

  useEffect(() => {
    const debouncedResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  const resizeWindow = () => {
    let size = 6;
    if (windowSize >= 640) {
      //sm
      size = 9;
    }
    if (windowSize >= 1024) {
      //lg
      size = 12;
    }
    if (windowSize >= 1280) {
      //xl
      size = 10;
    }
    if (windowSize >= 1536) {
      // 2xl
      size = 12;
    }
    return size;
  };

  return (
    <>
      <div ref={welcomeRef}>
        <HomeWelcome />
      </div>
      <main className="px-4 mt-10 md:px-15 lg:px-25 space-y-10">
        {[
          {
            product: homeProducts?.data?.topDiscountProducts,
            label: "Top Discount Products",
          },
          {
            product: homeProducts?.data?.topSoldProducts,
            label: "Top Sold Products",
          },
          {
            product: homeProducts?.data?.newProducts,
            label: "New Products",
          },
          {
            product: homeProducts?.data?.topRatingProducts,
            label: "Top Rated Products",
          },
        ].map((products, index) => (
          <div key={index} className="mt-[3rem]">
            <PageHeader className={"md:text-3xl md:h-15 text-2xl h-13 "}>
              {products.label}
            </PageHeader>
            <div>
              <div
                className="grid z-0 grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 
                    xl:grid-cols-5 2xl:grid-cols-6  gap-2  mt-[1.5rem] 
                    mb-[2rem] space-y-2  "
              >
                {isLoading
                  ? [...Array(6 + 6)]
                      .slice(0, resizeWindow())
                      .map((_, index) => (
                        <div key={index}>
                          <ProductLoader />
                        </div>
                        ))
                  : products.product
                      .slice(0, resizeWindow())
                      .map((product, i) => (
                        <motion.div
                          // className="flex justify-center items-center"
                          key={product._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.1 * (i % 10),
                            ease: "easeOut",
                          }}
                        >
                          <ProductCard product={product} sold={index === 1} />
                        </motion.div>
                      ))}
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
