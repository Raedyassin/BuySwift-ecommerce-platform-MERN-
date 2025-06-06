import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { FaSitemap } from "react-icons/fa";
import { prefixImageUrl } from "../utils/constance";

export default function ProductShowTable({ orderItems, px, showColor, className }) {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <>
      <div className={`flex items-center justify-between ${px}  py-2   gap-2`}>
        <div className={`flex font-bold items-center gap-2`}>
          <FaSitemap
            size={24}
            className={`${showColor ? "text-indigo-500" : ""}`}
          />
          <h1
            className={`font-bold text-xl  italic  ${
              showColor
                ? " bg-gradient-to-r from-indigo-500 to-purple-300 bg-clip-text text-transparent"
                : ""
            }`}
          >
            Order Items
          </h1>
        </div>
        {showDetails ? (
          <MdKeyboardArrowDown
            MdKeyboardArrowUp
            className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
            onClick={() => setShowDetails(false)}
          />
        ) : (
          <MdKeyboardArrowUp
            className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
            onClick={() => setShowDetails(true)}
          />
        )}
      </div>

      {showDetails && (
        <div
          className={`overflow-x-auto ${className} rounded-2xl
            ${showDetails ? "my-5" : "mb-0"}`}
        >
          <table className="w-full border-collapse ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4 flex w-16 h-16 items-center justify-center">
                    <img
                      src={
                        item?.product?.img
                          ? `${prefixImageUrl}${item.product.img
                              .split("/")
                              .pop()}`
                          : item.img
                          ? `${prefixImageUrl}${item.img.split("/").pop()}`
                          : `${prefixImageUrl}${item.image.split("/").pop()}`
                      }
                      alt={item?.product?.name || item.name}
                      className=" max-h-full max-w-full rounded-lg"
                      onError={(e) => (e.target.src = "")}
                    />
                  </td>
                  <td className="p-4">
                    <Link
                      className="text-black font-medium text-xs sm:text-sm hover:underline 
                      hover:text-purple-600 line-clamp-3 md:line-clamp-2"
                      to={`/product/${item?.product?._id || item._id}`}
                    >
                      {item?.product?.name || item.name}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-600 text-xs sm:text-sm">
                    {item.quantity}
                  </td>
                  <td className="p-4 text-gray-600 text-xs sm:text-sm">
                    $
                    {item?.product?.price?.toFixed(2) || item.price?.toFixed(2)}
                  </td>
                  <td className="p-4 text-indigo-600 font-bold text-xs sm:text-sm">
                    $
                    {(
                      item.quantity * (item?.product?.price || item.price)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
