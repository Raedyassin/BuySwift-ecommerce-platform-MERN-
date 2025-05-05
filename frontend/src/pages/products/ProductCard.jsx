import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { numberReviewsHandler } from "../../utils/numberReviews";
import PriceDiscont from "./PriceDiscont";
import { prefixImageUrl } from "../../utils/constance";
export default function ProductCard({ product, sold }) {
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
            <div
              className="w-full h-full flex justify-center items-center 
              "
            >
              <img
                src={prefixImageUrl + product.img.split("/").pop()}
                alt={product?.name}
                className=" max-h-full max-w-full rounded-lg "
              />
            </div>
            {+product.discount !== 0 && (
              <div
                className="absolute top-0 left-0 bg-gray-800 text-white text-xs
              sm:text-sm px-2 py-1 rounded-br-lg rounded-tl-lg font-semibold"
              >
                {product.discount}% off
              </div>
            )}
            {(+product.sold > 99 || sold) && (
              <div
                className="absolute top-0 right-0 bg-yellow-500 text-white text-xs
              sm:text-sm px-2 py-1 rounded-bl-lg rounded-tr-lg font-semibold"
              >
                Best Seller
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
                className={`sm:text-lg font-bold text-gray-700 
              hover:text-indigo-600 hover:underline transition-colors 
              duration-200 line-clamp-2`}
              >
                {product.name}
              </h5>
            </Link>
            <Ratings
              rating={product.rating}
              text={`(${numberReviewsHandler(product.numRatings)})`}
            />
            <div className="">
              <PriceDiscont
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount || 0}
              />
            </div>
          </div>
          <p
            className={`text-gray-600 text-xs sm:text-sm mt-1 
              line-clamp-3`}
          >
            {product.discription}
          </p>
        </div>
        <div className="flex justify-between items-center  pt-1 ">
          <span
            className="text-xs sm:text-sm bg-indigo-100
            text-indigo-900 font-bold  px-2 py-0.5 rounded-full line-clamp-1"
          >
            {product.brand}
          </span>
          <AiOutlineShoppingCart
            onClick={() =>
              dispatch(
                addToCart({
                  ...product,
                  totalQuantity: product.quantity,
                  quantity: 1,
                })
              )
            }
            className="text-indigo-600 cursor-pointer hover:text-indigo-900 
            transition-colors duration-200 text-2xl sm:text-3xl  
            "
          />
        </div>
      </div>
    </div>
  );
}
