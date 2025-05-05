import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import PriceDiscont from "./PriceDiscont";
import { prefixImageUrl } from "../../utils/constance";
export default function Product({ product }) {
  return (
    <div
      className={`w-full  h-[23rem]  hover:scale-105  
        hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] transition-all duration-300
      relative rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]  `}
    >
      <div className="relative p-4 pb-2 ">
        <Link
          to={`/product/${product._id}`}
          className="w-full h-[10rem] rounded-xl flex justify-center items-center"
        >
          <img
            src={prefixImageUrl + product.img?.split("/")?.pop()}
            alt={product.name}
            className=" max-h-full max-w-full rounded-lg"
          />
        </Link>
        <HeartIcon product={product} className={" right-5  bottom-5 "} />
      </div>
      <div className="px-4  relative flex justify-between items-center">
        <Link to={`/product/${product._id}`}>
          <div
            className="text-lg  hover:underline 
            font-simibold italic line-clamp-2
            sm:text-lg font-bold text-gray-700 
              hover:text-indigo-600
            "
          >
            {product.name}
          </div>
        </Link>
      </div>
      <div className="px-4 py-1">
        <PriceDiscont originalPrice={product.originalPrice} discount={0} />
      </div>

      <p
        className="px-4   font-normal  text-gray-600 
          text-xs sm:text-sm  line-clamp-4"
      >
        {product?.discription}
      </p>
    </div>
  );
}
