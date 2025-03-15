import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
// import Loader from "../../components/Loader";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="max-w-sm rounded w-[20rem] h-[310px]   shadow-lg relative">
      <section className="relative">
        <Link to={`/product/${product._id}`}>
          <span
            className="absolute bottom-5 right-3 bg-pink-100 text-pink-800 
          text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300"
          >
            {product.brand}
          </span>
          <img
            src={"/uploads/" + product.img.split("/").pop()}
            className="w-full p-3 rounded-xl cursor-pointer "
            alt={product.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={product} yPosition="top-4" xPosition="right-4" />
      </section>
      <div className="p-4 py-1">
        <div className="flex justify-between">
          <Link to={`/product/${product._id}`}>
            <h5
              className="mb-1 text-lg font-bold hover:underline hover:text-pink-800
              tracking-tight text-gray-900"
            >
              {product.name}
            </h5>
          </Link>
          <p className="text-pink-700 font-semibold ">{"$" + product.price}</p>
        </div>
        <p className="mb-1  font-normal text-gray-700">
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
      <div className="flex justify-between items-center p-3 py-1">
        <Ratings rating={product.rating} />
        <AiOutlineShoppingCart
          onClick={() => dispatch(addToCart({...product, quantity: 1}))}
          size={24}
          className="text-pink-600 cursor-pointer"
        />
      </div>
    </div>
  );
}
