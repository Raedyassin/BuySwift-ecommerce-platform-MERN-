import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
export default function Product({ product }) {
  console.log("product", product.name);
  
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
            className="text-lg text-black hover:text-purple-600 hover:underline font-simibold italic
            "
          >
            {product.name.length > 20
              ? product.name.substring(0, 20) + "..."
              : product.name}
          </div>
        </Link>
        <span
          className="bg-indigo-800 text-sm font-medium
              px-2.5 py-0.5 rounded-full  text-white absolute top-1 right-4"
        >
          {"$ " + product.price}
        </span>
      </div>
      <p className="px-4 mb-4  font-normal text-gray-700">
        {product?.discription?.substring(0, 60)}
        <span className=" italic font-bold">
          {" "}
          {product?.discription?.length > 65 ? "..." : ""}
        </span>
      </p>
    </div>
  );
}
