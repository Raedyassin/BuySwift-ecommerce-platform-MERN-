import { useState } from "react";
import { LuMapPin } from "react-icons/lu";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";

export default function ShippingAdress({ shippingAddress }) {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <>
      <div className="flex items-center justify-between  px-5 py-2   gap-2">
        <div className={`flex  items-center     gap-2`}>
          <LuMapPin size={24} />
          <h1 className="font-bold text-xl  italic">Delivering Adress</h1>
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
        <div className={`p-3 px-5 pl-13 ${showDetails ? "mb-10" : "mb-0"}`}>
          <h3 className="my-1 text-[#B0B0B0]">
            <span className="font-semibold inline-block w-[7rem]  text-gray-500">
              Country:{" "}
            </span>
            {shippingAddress?.country}
          </h3>
          <h3 className="my-1 text-[#B0B0B0]">
            <span className="font-semibold inline-block w-[7rem] text-gray-500">
              City:{" "}
            </span>
            {shippingAddress?.city}
          </h3>
          <h3 className="my-1  text-[#B0B0B0]">
            <span className="font-semibold inline-block w-[7rem] text-gray-500">
              Address:{" "}
            </span>
            {shippingAddress?.address}
          </h3>
          <h3 className="my-1   text-[#B0B0B0]">
            <span className="font-semibold inline-block w-[7rem] text-gray-500">
              Postal Code:{" "}
            </span>
            {shippingAddress?.postalCode}
          </h3>
          <h3 className="my-1    text-[#B0B0B0]">
            <span className="font-semibold inline-block w-[7rem] text-gray-500">
              Phone 1:{" "}
            </span>
            {shippingAddress?.firstPhone}
          </h3>
          {shippingAddress?.secondPhone && (
            <h3 className="my-1 text-[#B0B0B0]">
              <span className="font-semibold inline-block w-[7rem] text-gray-500">
                Phone 2:{" "}
              </span>
              {shippingAddress?.secondPhone}
            </h3>
          )}
        </div>
      )}
    </>
  );
}
