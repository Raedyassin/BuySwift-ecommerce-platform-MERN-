import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
export default function Product({ product }) {
  
  return (
    <div
      className={`w-full  h-[20rem]  hover:scale-105 
        hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] transition-all duration-300
      relative rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]  `}
    >
      <div className="relative p-4 pb-2 ">
        <img
          src={product.img}
          alt={product.name}
          className="w-[100%] h-[10rem]   object-cover cursor-pointer rounded-xl"
        />
        <HeartIcon product={product} className={" right-5  bottom-5 "} />
      </div>
      <div className="px-4 mb-2 relative flex justify-between items-center">
        <Link to={`/product/${product._id}`}>
          <div
            className="text-lg text-black hover:text-purple-600 hover:underline 
            font-simibold italic line-clamp-2
            "
          >
            {product.name}
          </div>
        </Link>
        <span
          className="bg-indigo-800 text-sm font-medium
              px-2.5 py-0.5 rounded-full  text-white absolute top-1 right-4"
        >
          {"$ " + product?.originalPrice?.toFixed(2)}
        </span>
      </div>
      <p className="px-4 mb-4  font-normal text-gray-700 line-clamp-3">
        {product?.discription}
      </p>
    </div>
  );
}
