import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useMarkorderDeliverMutation,
  useGetOrderDetailsQuery,
  useMarkOrderAsPaidMutation,
  useGetPayPalClientIdQuery,
} from "../../redux/apis/orderSlice";
import { use } from "react";
export default function Order() {
  const { id } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(id);

  const [markOrderAsPaid, { isLoading: loadingPaid }] =
    useMarkOrderAsPaidMutation();
  const [markorderDeliver, { isLoading: loadingDeliver }] =
    useMarkorderDeliverMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, dispatchPayPal] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        dispatchPayPal({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        dispatchPayPal({ type: "setLoadingStatus", value: "pending" });
      };
      if (order.data.order && !order.data.order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, paypal, order, dispatchPayPal]);

  console.log(order?.data?.order?.orderItems);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.message}</Message>
  ) : (
    <div className="w-[95%] flex flex-col ml-[1rem] md:flex-row">
      <div className="w-[65%] pr-4">
        <div className="w-[100%] mt-5 p-4 mb-5">
          {order.data.order.orderItems.length === 0 ? (
            <Message variant="info">
              Order is Empty{" "}
              <Link
                to="/shop"
                className="text-yellow-400 font-bold italic text-center hover:text-yellow-500 hover:underline"
              >
                Shoping Now
              </Link>
            </Message>
          ) : (
            // <div className="w-[100%] overflow-x-auto ">
            <table className="w-full  bg-gray-100    rounded-xl">
              <thead className="border-b-2 border-gray-300  ">
                <tr>
                  <th className="px-2 py-5">Image</th>
                  <th className="px-2 py-5">Product</th>
                  <th className="px-2  py-5">Quantity</th>
                  <th className="px-2 py-5">Unit Price</th>
                  <th className="px-2 py-5">Total</th>
                </tr>
              </thead>

              <tbody className="py-5">
                {order?.data?.order?.orderItems.map((item, index) => (
                  <tr key={index} className="border-b-1  border-gray-200">
                    <td className="p-2 flex justify-center">
                      <Link to={`/product/${item.product}`}>
                        <img
                          src={"/uploads/" + item.image.split("/").pop()}
                          alt={item.name}
                          className="w-16 rounded h-16 object-cover"
                        />
                      </Link>
                    </td>
                    <td className="p-2 text-center">
                      <Link
                        className="text-pink-400 font-bold hover:text-pink-500 hover:underline"
                        to={`/product/${item.product}`}
                      >
                        {item.name}
                      </Link>
                    </td>

                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-center">{item.price}</td>
                    <td className="p-2 text-center">
                      $ {(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            // </div>
          )}
        </div>
      </div>
          <div className="w-[35%] border border-gray-300 my-10">
            <div className="p-4">
              but the payment logic and details
            </div>
          </div>
    </div>
  );
}
