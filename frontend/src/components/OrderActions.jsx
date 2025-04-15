import { MdOutlinePendingActions } from "react-icons/md";
import { useState } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
// import PayPalContainer from "./PayPalContainer";
import Loader from "./Loader";
import {
  useMarkOrderAsPaidMutation,
  useMarkOrderPackedMutation,
  useMarkOrderTransitedMutation,
  useMarkOrderDeliverMutation,
  useMarkOrderCancelMutation
} from "../redux/apis/orderApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import apiSlice from "../redux/services/apiSlice";

export default function OrderActions({ order }) {
  const [showDetails, setShowDetails] = useState(true);
    const dispatch = useDispatch();

  const [markOrderAsPaid, { isLoading: loadingPaid }] =
    useMarkOrderAsPaidMutation();

  const [markOrderAsPacked, { isLoading: loadingPacked }] =
    useMarkOrderPackedMutation();

  const [markOrderAsTransited, { isLoading: loadingTransited }] =
    useMarkOrderTransitedMutation();

  const [markorderDeliver, { isLoading: loadingDeliver }] =
    useMarkOrderDeliverMutation();

  const [markOrderAsCancel, { isLoading: loadingCancel }] =
    useMarkOrderCancelMutation();

  const actionHandler = async (fun, processText) => {
    try {
      const respose = await fun({ id: order._id }).unwrap();
      toast.success("Order " + processText + " Successfully");
      updateOrderHandler(respose.data);
    } catch (error) {
      toast.error(error?.data?.message||"Something went wrong");
    }
  };

    const updateOrderHandler = (updatedOrder) => {
      dispatch(
        apiSlice.util.updateQueryData(
          "getOrderDetails",
          order?._id,
          (draft) => {
            draft.data = updatedOrder;
          }
        )
      );
    };

  return (
    <div>
      <div className="flex items-center justify-between  px-5 py-2   gap-2">
        <div className="flex items-center gap-2">
          <MdOutlinePendingActions size={24} />
          <h1 className="font-bold text-xl  italic">Order Actions</h1>
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
        <div className={`px-13 space-y-5 ${showDetails ? "mb-10" : "mb-0"}`}>
          {/* Packed */}
          <button
            className="rounded-md w-full bg-[#2DCCFF] hover:bg-indigo-600
            text-white font-bold cursor-pointer py-3"
            onClick={() => actionHandler(markOrderAsPacked, "Packed")}
          >
            {loadingPacked ? (
              <Loader
                loaderText="Packing"
                loaderColor="border-white"
                textColor="text-white"
              />
            ) : (
              "Make Order Packed"
            )}
          </button>

          {/* Transited */}
          <button
            className="rounded-md w-full bg-[#5b9bbb] hover:bg-indigo-600
            text-white font-bold cursor-pointer py-3"
            onClick={() => actionHandler(markOrderAsTransited, "Transited")}
          >
            {loadingTransited ? (
              <Loader
                loaderText="Transiting"
                loaderColor="border-white"
                textColor="text-white"
              />
            ) : (
              "Make Order Transited"
            )}
          </button>

          {/* Delivered */}
          <button
            className="rounded-md w-full bg-[#10B981] hover:bg-indigo-600
            text-white font-bold cursor-pointer py-3"
            onClick={() => actionHandler(markorderDeliver, "Deliver")}
          >
            {loadingDeliver ? (
              <Loader
                loaderText="Delivering"
                loaderColor="border-white"
                textColor="text-white"
              />
            ) : (
              "Make Order Deliver"
            )}
          </button>

          {/* Canceled */}
          <button
            className="rounded-md w-full bg-[#EF4444] hover:bg-indigo-600
            text-white font-bold cursor-pointer py-3"
            onClick={() => actionHandler(markOrderAsCancel, "Canceled")}
          >
            {loadingCancel ? (
              <Loader
                loaderText="Canceling"
                loaderColor="border-white"
                textColor="text-white"
              />
            ) : (
              "Make Order Canceled"
            )}
          </button>


          <button
            className="rounded-md w-full bg-[#2DCCFF] hover:bg-indigo-600
            text-white font-bold cursor-pointer py-3"
            onClick={() => actionHandler(markOrderAsPaid, "Paid")}
          >
            {loadingPaid ? (
              <Loader
                loaderText="paying"
                loaderColor="border-white"
                textColor="text-white"
              />
            ) : (
              "Make Order Paid"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
