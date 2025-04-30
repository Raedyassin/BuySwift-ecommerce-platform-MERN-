import { useState, useEffect, useRef } from "react";
import { useGetSearchedProductsQuery } from "../redux/apis/productApiSlice";
import { useGetAllCategoryQuery } from "../redux/apis/categoryApiSlice";
import { toast } from "react-toastify";
import ProductCard from "./products/ProductCard";
import PageLoader from "../components/PageLoader";
import { FiFilter } from "react-icons/fi";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
 import ProductLoader from "./products/ProductLoader";

export default function Shope() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [searchName, setSearchName] = useState(
    searchParams.get("search") || ""
  );
  const [showFilter, setShowFilter] = useState(false);
  const LoaderRef = useRef(null);
  const [page, setPage] = useState(1);

  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [newInputRadio, setNewInputRadio] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [price, setPrice] = useState("");

  const [showMoreBrand, setShowMoreBrand] = useState(false);
  const [showMoreCategory, setShowMoreCategory] = useState(false);

  const { data: categoriesData, isLoading: isLoadingCategory } =
    useGetAllCategoryQuery();
  const {
    data: filterData,
    isLoading: isLoadingProducts,
    isFetching,
    isError,
  } = useGetSearchedProductsQuery({
    selectedCategory: selectedCategory.toString(),
    searchName,
    price,
    page,
    // pageLoader make error when loader more product so change it to Loader
    limit: 25,
  });
  const navigate = useNavigate();
  const clearSearchResult = () => {
    setSearchName("");
    navigate("/shop");
  };
  useEffect(() => {
    setSearchName(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    window.document.title = "🛒 Shop";
    window.scrollTo(0, 0);
  }, []);

  // Infinite scroll logic with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          !isError &&
          filterData?.hasNextPage
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    const currentLoader = LoaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [isFetching, isError, filterData?.hasNextPage]);

  const selectedCategoryHandler = (category) => {
    const chekced = selectedCategory.includes(category);
    if (chekced) {
      setSelectedCategory(selectedCategory.filter((c) => c !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
    window.scrollTo(0, { behavior: "smooth" });
    setPage(1);
    setNewInputRadio(0);
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filterData?.data?.products
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const resetFilter = (e) => {
    e.preventDefault();
    setPrice("");
    setSelectedCategory("");
    setNewInputRadio(0);
    setEndPrice("");
    setStartPrice("");
    setPage(1);
  };

  const selectedBrandHandler = (index) => {
    setNewInputRadio(index + 1);
    window.scrollTo(0, { behavior: "smooth" });
  };

  const priceFilterHandler = (e) => {
    e.preventDefault();
    const start = Number(startPrice);
    const end = Number(endPrice);
    if (isNaN(startPrice) && isNaN(endPrice)) {
      toast.error("Price must be a number");
      return;
    }
    if (startPrice.trim() === "" && endPrice.trim() === "") {
      toast.error("Please enter start for equal and start-end for comparison");
      return;
    }
    if (start < 0 || end < 0) {
      toast.error("Price must be greater than or equal 0");
      return;
    }
    if (startPrice.trim() !== "" && endPrice.trim() !== "" && start > end) {
      toast.error("Start price must be less than or equal end price");
      return;
    }

    if (startPrice.trim() !== "" && endPrice.trim() === "") {
      setPrice(`${startPrice.trim()}`);
    } else {
      setPrice(`${startPrice.trim()},${endPrice.trim()}`);
    }
    setPage(1);
  };

  if (isLoadingCategory || isLoadingProducts)
    return <PageLoader height="h-screen" />;

  return (
    <>
      <div className="w-full  px-4 py-4  relative">
        <div
          className="fixed p-2 z-50 rounded-full shadow-lg bg-gray-50 border 
        border-gray-100 flex items-center justify-center top-25 right-4 md:hidden 
        cursor-pointer hover:bg-gray-100 transition-all duration-300 group"
          onClick={() => {
            if (!showFilter) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            setShowFilter(!showFilter);
          }}
        >
          <FiFilter className="text-xl text-gray-800 mr-2 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-700 group-hover:to-purple-700">
            Filter
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-1">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            className={`w-full my-5 lg:ml-5 md:w-64 flex-shrink-0 ${
              showFilter ? "block" : "hidden"
            } md:block`}
          >
            <div className="bg-gray-900 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-center text-gray-100 py-2 bg-gray-800 rounded-full mb-4">
                Filter by Category
              </h2>
              <div className="space-y-3 px-4">
                {categoriesData?.data?.categories
                  ?.slice(
                    0,
                    !showMoreCategory
                      ? 5
                      : categoriesData?.data?.categories?.length
                  )
                  ?.map((category) => (
                    <div key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={category._id}
                        checked={selectedCategory.includes(category._id)}
                        onChange={() => selectedCategoryHandler(category._id)}
                        className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 border-gray-600 rounded cursor-pointer"
                      />
                      <label
                        htmlFor={category._id}
                        className="text-gray-200 ml-2 text-sm"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
              </div>
              {categoriesData?.data?.categories?.length > 5 && (
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setShowMoreCategory(!showMoreCategory)}
                    className=" text-sm mt-4 text-white
                      p-2 rounded-full w-30 italic font-semibold cursor-pointer 
                      bg-indigo-600 hover:bg-indigo-700
                    "
                  >
                    {showMoreCategory ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}{" "}
              {uniqueBrands.length !== 0 && (
                <>
                  <h2
                    className="text-lg font-semibold text-center text-gray-100 
                  py-2 bg-gray-800 rounded-full mt-6 mb-4"
                  >
                    Filter by Brands
                  </h2>
                  <div className="space-y-3 px-4">
                    {uniqueBrands
                      .slice(0, showMoreBrand ? uniqueBrands.length : 5)
                      .map((brand, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="radio"
                            id={index}
                            value={index}
                            checked={newInputRadio === index + 1}
                            onChange={(e) =>
                              selectedBrandHandler(+e.target.value)
                            }
                            className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 
                          border-gray-600 rounded cursor-pointer"
                          />
                          <label
                            htmlFor={index}
                            className="text-gray-200 ml-2 text-sm"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                  </div>
                  {uniqueBrands.length > 5 && (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => setShowMoreBrand(!showMoreBrand)}
                        className=" text-sm mt-4 text-white
                    p-2 rounded-full w-30 italic font-semibold cursor-pointer 
                    bg-indigo-600 hover:bg-indigo-700
                  "
                      >
                        {showMoreBrand ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  )}
                </>
              )}
              <h2
                className="text-lg font-semibold text-center text-gray-100 py-2 
            bg-gray-800 rounded-full mt-6 mb-4"
              >
                Filter by Price
              </h2>
              <div className="space-y-4 px-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="start" className="text-gray-200 text-sm w-12">
                    Start:
                  </label>
                  <input
                    type="number"
                    id="start"
                    className="w-full p-2 bg-gray-800 text-white border 
                  border-gray-700 rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 transition-all duration-200"
                    onChange={(e) => setStartPrice(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="end" className="text-gray-200 text-sm w-12">
                    End:
                  </label>
                  <input
                    type="number"
                    id="end"
                    className="w-full p-2 bg-gray-800 text-white border 
                  border-gray-700 rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-indigo-500 transition-all duration-200"
                    onChange={(e) => setEndPrice(e.target.value)}
                  />
                </div>
                <button
                  className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
                  onClick={priceFilterHandler}
                >
                  Apply
                </button>
              </div>
              <div className="mt-6 px-4">
                <button
                  className="w-full bg-gray-700 cursor-pointer text-white py-2 
                rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
                  onClick={(e) => resetFilter(e)}
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>

          {/* header of the page */}

          {/* Product Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 p-3"
          >
            <div className="flex justify-between pt-7 md:pt-2 mb-3 items-center">
              {searchName.trim() !== "" && (
                <>
                  <PageHeader>
                    Results for{" "}
                    <span className="text-indigo-500">{searchName}</span>
                  </PageHeader>
                  <button
                    onClick={clearSearchResult}
                    className="p-2 px-4 text-white font-semibold rounded-2xl 
                bg-indigo-500 cursor-pointer hover:bg-indigo-700"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
            {filterData?.data?.products?.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="ml-[2rem]  "
              >
                <h1 className="text-2xl text-center font-semibold text-gray-500 w-full italic">
                  No products found
                </h1>
              </motion.div>
            )}
            <div
              className="grid grid-cols-2 md:grid-cols-2 
            lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3"
            >
              {filterData?.data?.products?.map((prod, index) => {
                if (newInputRadio !== 0) {
                  if (uniqueBrands[newInputRadio - 1] === prod.brand) {
                    return (
                      <motion.div
                        className="flex justify-center items-center"
                        key={prod._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 * (index % 10),
                          ease: "easeOut",
                        }}
                      >
                        <ProductCard product={prod} />
                      </motion.div>
                    );
                  }
                  return;
                }
                return (
                  <motion.div
                    className="flex justify-center items-center"
                    key={prod._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 * (index % 10),
                      ease: "easeOut",
                    }}
                  >
                    <ProductCard product={prod} />
                  </motion.div>
                );
              })}
              <div className=" h-60 " ref={LoaderRef}></div>
              {isFetching &&
                [...Array(6 + 6)].map((_, index) => (
                  <div key={index}>
                    <ProductLoader />
                  </div>
                ))
              }
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
