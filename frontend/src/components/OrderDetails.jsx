import { useState } from "react";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import Status from "./Status";
import PaymentShow from "./PaymentShow";
export default function OrderDetails({ order }) {
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-between px-3 sm:px-5 py-2   gap-2">
        <div className="flex items-center gap-2">
          <FaMoneyBill1Wave size={24} />
          <h1 className="font-bold text-xl  italic">Order Details</h1>
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
        <div className={`px-9 ${showDetails ? "mb-10" : "mb-0"}`}>
          <div className="flex flex-row justify-between  px-4 py-3 ">
            <div className="font-semibold text-gray-500">Status</div>
            <Status status={order?.status} />
          </div>
          {/* payment method */}
            <div className="flex flex-row justify-between  px-4 py-3 ">
              <div className="font-semibold text-gray-500">Payment Method</div>
              <div>
                <PaymentShow paymentMethod={order?.paymentMethod} />
                {/* <PaymentShow paymentMethod={"PayPald"} /> */}
              </div>
            </div>
          <div className="flex flex-row justify-between  px-4 py-3 ">
            <div className="font-semibold text-gray-500">Is Paid</div>
            <div>
              {order?.isPaid ? (
                <span className="text-green-500 font-bold">Yes</span>
              ) : (
                <span className="text-red-500 font-bold">No</span>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between  px-4 py-3 ">
            <div className="font-semibold text-gray-500">Items Price</div>
            <div>${order?.itemsPrice}</div>
          </div>
          <div className="flex flex-row justify-between  px-4 py-3 ">
            <div className="font-semibold text-gray-500">Shipping Price</div>
            <div>${order?.shippingPrice}</div>
          </div>
          <div className="flex flex-row justify-between  px-4 py-3 ">
            <div className="font-semibold text-gray-500">Tax Price</div>
            <div>${order?.taxPrice}</div>
          </div>
          <div className="border-t-1 border-gray-300 mx-3 my-2"></div>
          <div className="flex flex-row justify-between  px-4 py-3  ">
            <div className="font-semibold text-gray-500">Total Price</div>
            <div>${order?.totalPrice}</div>
          </div>
        </div>
      )}
    </div>
  );
}
