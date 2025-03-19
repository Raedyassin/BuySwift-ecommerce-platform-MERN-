import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
export default function Product({ product }) {
  console.log("product", product);
  
  return (
    <div
      className={`w-[20rem] h-[20rem]  border-10 border-sky-50
      relative rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]  `}
    >
      <div className="relative p-4 pb-2 ">
        <img
          src={product.img}
          alt={product.name}
          className="w-[20rem] h-[10rem] object-fill cursor-pointer rounded-xl"
        />
        <HeartIcon product={product} />
      </div>
      <div className="px-4 mb-2 flex justify-between items-center">
        <Link to={`/product/${product._id}`}>
          <div
            className="text-lg text-gray-700 hover:text-pink-600 hover:underline font-simibold italic
            "
          >
            {product.name}
          </div>
        </Link>
        <span
          className="bg-pink-100 text-pink-800 text-sm font-medium
              px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 "
        >
          {"$ " + product.price}
        </span>
      </div>
      <p className="px-4 mb-4  font-normal text-gray-700">
        {product.discription.substring(0, 65)}
        <Link
          to={`/product/${product._id}`}
          className="text-pink-600 italic font-bold"
        >
          {" "}
          read more...
        </Link>
      </p>
    </div>
  );
}
