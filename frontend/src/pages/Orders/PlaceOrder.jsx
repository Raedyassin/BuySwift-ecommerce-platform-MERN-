import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PayPalContainer from "../../components/PayPalContainer";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/apis/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import EmptyCart from "../../components/EmptyCart";
import ProductShowTable from "../../components/ProductShowTable";
import PaymentShow from "../../components/PaymentShow";
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
    window.scrollTo(0, 0)
  }, []);

  const placeOrderHandler = async () => {
    try {
      await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/orderslist`);
      // navigate(`/order/${res.data.order._id}`);
    } catch (error) {
      toast.error(
        error.data.message || error.message || "Something went wrong"
      );
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
        <div className="lg:col-span-2 p-6 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl">
          <ProductShowTable
            showColor={true}
            orderItems={cart?.cartItems}
            px=""
          />
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl p-6">
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
              <PaymentShow paymentMethod={cart.paymentMethod} />
              {/* <PaymentShow paymentMethod={"VodafoneCash"} /> */}
            </div>

            <div className="mt-6">
              <h1 className="text-lg italic font-semibold text-indigo-800">
                Confirem Order
              </h1>
              {cart.paymentMethod === "PayPal" ? (
                <div className="mt-2">
                  <PayPalContainer
                    order={{
                      orderItems: cart.cartItems,
                      shippingAddress: cart.shippingAddress,
                    }}
                  />
                </div>
              ) : (
                <button
                  type="submit"
                  className="mt-2 w-full   cursor-pointer
                text-white py-3 px-4 rounded-lg font-semibold 
                transition-all duration-300 flex items-center justify-center 
                bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
                hover:to-purple-700 disabled:opacity-50"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  <span>Confirm Order</span>
                  {isLoading && <Loader loaderColor="border-white" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
