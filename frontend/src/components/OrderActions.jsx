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
  useMarkOrderCancelMutation,
} from "../redux/apis/orderApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import apiSlice from "../redux/services/apiSlice";

export default function OrderActions({ order }) {
  // const [stepsOfDeliveringOrder] = useState([
  //   "pending",
  //   "packed",
  //   "ontheroute",
  //   "delivered",
  //   "cancelled",
  // ]);
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
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const updateOrderHandler = (updatedOrder) => {
    dispatch(
      apiSlice.util.updateQueryData("getOrderDetails", order?._id, (draft) => {
        draft.data = updatedOrder;
      })
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
        <div className={`px-13 space-y-4 ${showDetails ? "my-5" : "mb-0"}`}>
          {[
            {
              label: "Packed",
              action: markOrderAsPacked,
              loading: loadingPacked,
              loaderText: "Packing",
              gradient: "from-cyan-400 to-blue-500",
            },
            {
              label: "Transited",
              action: markOrderAsTransited,
              loading: loadingTransited,
              loaderText: "Transiting",
              gradient: "from-blue-400 to-indigo-500",
            },
            {
              label: "Delivered",
              action: markorderDeliver,
              loading: loadingDeliver,
              loaderText: "Delivering",
              gradient: "from-green-400 to-emerald-500",
            },
            {
              label: "Paid Manually",
              action: markOrderAsPaid,
              loading: loadingPaid,
              loaderText: "Paying",
              gradient: "from-purple-400 to-pink-500",
            },
            {
              label: "Canceled",
              action: markOrderAsCancel,
              loading: loadingCancel,
              loaderText: "Canceling",
              gradient: "from-red-400 to-rose-500",
            },
          ]
            .filter((label,index) => {
              if(order?.status === "cancelled") return false;
              else if (order?.status === "delivered") return false;
              else if (label.label === "Packed" && order?.status !== "pending")return false;
              else if (label.label === "Transited" && order?.status !== "packed") return false;
              else if (label.label === "Paid Manually") {
                return order?.isPaid === true ? false : true;
              }
              return true;
            })
            .map(({ label, action, loading, loaderText, gradient }, idx) => (
              <button
                key={idx}
                className={`w-full bg-gradient-to-r ${gradient} text-white py-3 
              px-6 rounded-xl font-semibold shadow-md hover:scale-[1.02]
              active:scale-[0.98] transition-all duration-200 cursor-pointer`}
                onClick={() => actionHandler(action, label)}
              >
                {loading ? (
                  <Loader
                    loaderText={loaderText}
                    loaderColor="border-white"
                    textColor="text-white"
                  />
                ) : (
                  label
                )}
              </button>
            ))}
          <div className="text-center font-bold text-rose-500">
            {order?.status === "cancelled" && "Order Cancelled"}
          </div>
          <div className="text-center font-bold text-emerald-500">
            {order?.status === "delivered" && "Order Delivered"}
          </div>
        </div>
      )}
    </div>
  );
}
