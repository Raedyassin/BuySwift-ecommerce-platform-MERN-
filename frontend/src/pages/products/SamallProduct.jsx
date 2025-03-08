import { Link } from "react-router-dom"
import HeartIcon from "./HeartIcon";


export default function SamallProduct({product}) {
  return (
    <div className="lg:w-[20rem]  ml-[0.5rem] p-3">
      <div className="relative">
        <img
          src={`/uploads/${product.img.split("/").pop()}`}
          alt={product.name}
          className="h-auto block w-full rounded"
        />
        <HeartIcon product={product} />
        <div className="py-2">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center">
              <div>{product.name}</div>
              <span
                className=" bg-pink-100 text-pink-800 text-sm font-medium 
                mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300"
              >
                {"$ " + product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
