import { useGetSearchedProductsQuery } from "../../redux/apis/productApiSlice";
import Ratings from "../../pages/products/Ratings";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { FaTimes } from "react-icons/fa";
import { motion } from "motion/react";

export default function SearchResults({ searchName, setShowResults }) {
  const { data: products, isFetching } = useGetSearchedProductsQuery({
    searchName,
    page: 1,
    limit: 20,
    selectedCategory: "",
    price: "",
  });
  const navigate = useNavigate();
  const goToResult = () => {
    navigate(`/shop?search=${searchName}`);
    setShowResults(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed to-0 left-0 lg:left-[70px] w-full h-[85vh] md:h-[91vh]  
    bg-gray-200/50 flex flex-col  items-center"
    >
      <div className="px-4 py-2 bg-white h-full w-full overflow-auto lg:w-[70%] ">
        <div className="flex  justify-end mb-2">
          <FaTimes
            onClick={() => setShowResults(false)}
            className="p-2 rounded-full text-3xl cursor-pointer shadow-md hover:shadow-lg 
            transition-all duration-300 bg-gray-50 hover:bg-gray-100
            text-gray-700 top-25 lg:top-20 right-2"
          />
        </div>
        {products?.data?.products.length === 0 && (
          <h1 className="text-xl italic w-full text-center my-10 text-gray-500 font-semibold">
            No products found
          </h1>
        )}
        {isFetching && (
          <div className="flex justify-center items-center ">
            <Loader />
          </div>
        )}
        {products?.data?.products.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            onClick={() => setShowResults(false)}
            className="flex items-center mb-5 shadow-md p-2 rounded-lg 
            hover:bg-gray-100 hover:shadow-lg gap-2"
          >
            <img
              src={"/uploads/" + product.img.split("/").pop()}
              alt={product.name}
              className="w-33 h-40 object-cover rounded-lg "
            />
            <div className="h-full flex flex-col justify-start ">
              <span
                onClick={() => {
                  navigate(`/product/${product._id}`);
                  setShowResults(false);
                }}
                className="text-xl w-auto font-semibold hover:text-indigo-700 cursor-pointer"
              >
                {product.name}
              </span>

              <p className="text-gray-500">${product.price}</p>
              <p className="mb-2">
                {product.discription.substring(0, 190)}
                {product.discription.length > 199 ? " ..." : ""}
              </p>
              <Ratings rating={product.rating} />
            </div>
          </Link>
        ))}
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

// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 100)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 50)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 190)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 190)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 190)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 190)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
// <div className="flex items-center mb-5 shadow-md p-2 rounded-lg  gap-2">
//   <img
//     src="../../../public/Cloud Dream.png"
//     alt="line"
//     className="w-33 h-40 rounded-lg "
//   />
//   <div className="h-full flex flex-col justify-start ">
//     <h1 className="text-xl font-semibold">Search Results</h1>
//     <p className="text-gray-500">$50</p>
//     <p className="mb-2">
//       {test.substring(0, 190)}
//       {test.length > 199 ? "..." : ""}
//     </p>
//     <Ratings rating={5} />
//   </div>
// </div>
