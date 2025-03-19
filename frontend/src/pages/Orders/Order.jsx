
import { Link, useParams } from "react-router-dom";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useMarkorderDeliverMutation,
  useGetOrderDetailsQuery,
  
  useMarkOrderAsPaidMutation,

} from "../../redux/apis/orderApiSlice";
import PayPalContainer from "../../components/PayPalContainer";
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

  if (error) {
    return (
      <div className="pt-[1rem] pr-[1rem]">
        <Message variant="dangers">
          {error?.data?.message}{" "}
          <Link
            to={"/shop"}
            className="cursor-pointer text-pink-500 hover:text-pink-600 hover:underline font-bold italic"
          >
            Go To Shopping
          </Link>
        </Message>
      </div>
    );
  }
  
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.message}</Message>
  ) : (
    <div className="w-[95%] flex flex-col ml-[1rem] md:flex-row">
      <div className="w-[65%] pr-4">
        <div className="w-[100%] mt-5 p-4 mb-5">
          {order?.data?.order?.orderItems?.length === 0 ? (
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
          <PayPalContainer refetch={refetch} order={order} />
        </div>
      </div>
    </div>
  );
}
