import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="w-full max-w-sm h-full rounded-lg shadow-md bg-white border
    border-gray-100 hover:shadow-lg transition-all duration-300 relative flex
    flex-col ">
      <section className="relative">
        <Link to={`/product/${product._id}`}>
          <span className="absolute bottom-3 right-3 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
          <img
            src={"/uploads/" + product.img.split("/").pop()}
            className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-2xl cursor-pointer p-2"
            alt={product.name}
          />
        </Link>
        <HeartIcon product={product} yPosition="top-3" xPosition="right-3" />
      </section>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <Link to={`/product/${product._id}`}>
              <h5 className="text-base sm:text-lg font-bold text-gray-900 hover:text-indigo-600 hover:underline transition-colors duration-200 line-clamp-1">
                {product.name}
              </h5>
            </Link>
            <p className="text-indigo-700 font-semibold text-sm sm:text-base">
              ${product.price}
            </p>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {product.discription.substring(0, 65)}
            {product.discription.length > 65 && "..."}
            {/* <Link
              to={`/product/${product._id}`}
              className="text-indigo-500 italic font-medium hover:text-indigo-600 transition-colors duration-200"
            >
              {" "}
              read more...
            </Link> */}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Ratings rating={product.rating} />
          <AiOutlineShoppingCart
            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
            className="text-indigo-600 cursor-pointer hover:text-indigo-900 
            transition-colors duration-200 w-6 h-6  lg:w-7 lg:h-7 
            xl:w-8 xl:h-8 2xl:w-9 2xl:h-9"
          />
        </div>
      </div>
    </div>
  );
}
