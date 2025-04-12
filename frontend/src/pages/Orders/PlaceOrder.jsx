import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {motion} from 'motion/react'
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/apis/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import EmptyCart from "../../components/EmptyCart";

const PlaceOrder = () => {
  const [, dispatchPaypalLoader] = usePayPalScriptReducer();
  useEffect(() => {
    dispatchPaypalLoader({ type: "setLoadingStatus", value: "pending" });
  }, [dispatchPaypalLoader]);

  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
      useEffect(() => {
        window.document.title = "Place Order";
      }, []);


  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      }).unwrap();
      console.log("res", res);
      dispatch(clearCartItems());
      navigate(`/orderslist`);
      // navigate(`/order/${res.data.order._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  if (error?.status === 404) {
    toast.error(
      "Product with Name " + error?.data?.data?.products[0]?.name + " not found"
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <ProgressSteps step1 step2 step3 />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items Table */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-300 bg-clip-text text-transparent">
            Order Items
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <img
                        src={`/uploads/${item.img.split("/").pop()}`}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="p-4">
                      <Link
                        className="text-black font-medium hover:underline hover:text-purple-600 transition-colors duration-200"
                        to={`/product/${item._id}`}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-4 text-gray-600">{item.quantity}</td>
                    <td className="p-4 text-gray-600">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-indigo-600 font-bold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2
              className="text-xl font-bold mb-4  bg-gradient-to-r from-indigo-500 to-purple-300 bg-clip-text text-transparent
            "
            >
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Items:</span>
                <span>${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium ">Shipping:</span>
                <span>${cart.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Tax:</span>
                <span>${cart.taxPrice}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-800 border-t pt-2">
                <span className="italic text-indigo-800">Total:</span>
                <span>${cart.totalPrice}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg italic font-semibold text-indigo-800 mb-2">
                Shipping
              </h3>
              <p className="text-gray-600">
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-indigo-800 italic mb-2">
                Payment Method
              </h3>
              <p className="text-gray-600">{cart.paymentMethod}</p>
            </div>

            <button
              type="submit"
              className="mt-6 w-full   cursor-pointer
                text-white py-3 px-4 rounded-lg font-semibold 
                transition-all duration-300 flex items-center justify-center 
                bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
                hover:to-purple-700 disabled:opacity-50"
              disabled={cart.cartItems === 0}
              onClick={placeOrderHandler}
            >
              <span>Make Order</span>
              {isLoading && <Loader />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
