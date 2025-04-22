import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import {numberReviewsHandler} from '../../utils/numberReviews'
import PriceDiscont from "./priceDiscont";
export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <div
      className="w-full max-w-sm  h-full rounded-lg  bg-white 
      hover:scale-103 hover:shadow-lg transition-all duration-300 
      relative flex flex-col shadow "
    >
      <section className="relative ">
        <Link to={`/product/${product._id}`}>
          <div
            className="relative w-full h-40 sm:h-48 md:h-52  rounded-lg 
            cursor-pointer p-2"
          >
            <img
              src={"/uploads/" + product.img.split("/").pop()}
              className="w-full h-full object-cover rounded-lg"
              alt={product.name}
            />
            {+product.discount !== 0 && (
              <div
                className="absolute top-0 left-0 bg-gray-800 text-white text-xs
              sm:text-sm px-2 py-1 rounded-br-lg rounded-tl-lg font-semibold"
              >
                {product.discount}% off
              </div>
            )}
          </div>
        </Link>
        <HeartIcon product={product} className={" bottom-3 right-3 "} />
      </section>
      <div className="p-3 py-0 pb-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between flex-col items-start space-y-1">
            <Link to={`/product/${product._id}`}>
              <h5
                className={`text-lg sm:text-xl font-bold text-gray-700 
              hover:text-indigo-600 hover:underline transition-colors 
              duration-200 line-clamp-2`}
              >
                {product.name}
              </h5>
            </Link>
            <Ratings
              rating={product.rating}
              text={`(${numberReviewsHandler(product.numReview)})`}
            />
            <div className="">
              <PriceDiscont price={product.price} discount={product.discount||0} />
            </div>
          </div>
          <p
            className={`text-gray-600 text-sm sm:text-base mt-1 
              line-clamp-3`}
          >
            {product.discription}
          </p>
        </div>
        <div className="flex justify-between items-center  pt-1 ">
          <span
            className="text-xs sm:text-sm bg-indigo-100
            text-indigo-900 font-bold  px-2 py-0.5 rounded-full"
          >
            {product.brand}
          </span>
          <AiOutlineShoppingCart
            onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
            className="text-indigo-600 cursor-pointer hover:text-indigo-900 
            transition-colors duration-200 text-2xl sm:text-3xl  
            "
          />
        </div>
      </div>
    </div>
  );
}
