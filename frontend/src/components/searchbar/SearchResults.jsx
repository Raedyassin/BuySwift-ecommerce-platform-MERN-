import { useGetSearchedProductsQuery } from "../../redux/apis/productApiSlice";
import Ratings from "../../pages/products/Ratings";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { FaTimes } from "react-icons/fa";
import { motion } from "motion/react";
import { changeToRelative } from "../../redux/features/chagneSearchbarPosition";
import { hiddenSearchResult } from "../../redux/features/searchResult";
import {prefixImageUrl} from '../../utils/constance'
import { useDispatch } from "react-redux";
import PriceDiscont from "../../pages/products/PriceDiscont";
export default function SearchResults({ searchName }) {
  const { data: products, isFetching } = useGetSearchedProductsQuery({
    searchName,
    page: 1,
    limit: 20,
    selectedCategory: "",
    price: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToResult = () => {
    navigate(`/shop?search=${searchName}`);
    dispatch(hiddenSearchResult());
    dispatch(changeToRelative());
  };

  const closeResults = () => {
    dispatch(hiddenSearchResult());
    dispatch(changeToRelative());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed to-0 left-0 lg:left-[70px] w-full h-[87vh] md:h-[91vh]  
    bg-white flex flex-col  items-center"
      onClick={closeResults}
    >
      <div className="absolute ">
        {isFetching ? (
          <Loader />
        ) : (
          <FaTimes
            onClick={closeResults}
            className="p-2 rounded-full text-3xl cursor-pointer shadow-md hover:shadow-lg 
            transition-all duration-300 bg-gray-50 hover:bg-gray-100
            text-gray-700 top-25 lg:top-20 right-2"
          />
        )}
      </div>
      <div className="px-4 py-2 bg-white h-full w-full overflow-auto lg:w-[70%] ">
        {products?.data?.products.length === 0 && (
          <h1 className="text-xl italic w-full text-center my-10 text-gray-500 font-semibold">
            No products found
          </h1>
        )}
        <div
        // className="mt-8"
        >
          {products?.data?.products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              onClick={() => dispatch(hiddenSearchResult())}
              className="grid grid-cols-8 gap-4 mb-5 shadow-md p-2 rounded-lg 
                hover:bg-gray-50  hover:shadow-lg "
            >
              {/* image */}
              <div
                className="col-span-2 xl:col-span-1 h-30  md:h-35 flex items-center 
                  justify-center rounded-lg  bg-white"
              >
                <img
                  src={prefixImageUrl + product.img.split("/").pop()}
                  alt={product.name}
                  className="max-w-full max-h-full  rounded-lg "
                />
              </div>
              {/* text */}
              <div className="col-span-6 xl:col-span-7 h-full flex flex-col justify-start ">
                <span
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    dispatch(hiddenSearchResult());
                  }}
                  className="text-sm md:text-xl w-auto font-semibold
                  hover:text-indigo-700 cursor-pointer line-clamp-2"
                >
                  {product.name}
                </span>

                <p className="text-gray-500 text-sm md:text-base">
                  <PriceDiscont
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount || 0}
                  />
                </p>
                <p className="mb-2 text-xs md:text-sm line-clamp-2">
                  {product.discription}
                </p>
                <div className="text-sm md:text-base">
                  <Ratings rating={product.rating} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products?.hasNextPage && (
          <div className="flex justify-center items-center  ">
            <div
              onClick={goToResult}
              className="bg-indigo-500 hover:bg-indigo-700 mb-2  italic 
            text-white cursor-pointer p-2 px-4 rounded-full"
            >
              Show more
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}