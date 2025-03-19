import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/apis/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
const PlaceOrder = () => {
  const [, dispatchPaypalLoader] = usePayPalScriptReducer();
  useEffect(() => {
    // When user reaches checkout, load the PayPal SDK
    // setLoadingStatus do load the PayPal SDK and run the default option of the PapPalScriptProvider
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

  // the problem you change the create order in backend and this will make error
  // also untill know i think i should splite this to create order adn create
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
      }).unwrap();
      console.log(res);
      
      dispatch(clearCartItems());
      navigate(`/order/${res.data.order._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  if (error?.status === 404) {
    toast.error(
      "Product with Name " + error?.data?.data?.products[0]?.name + " not found"
    ); //{error.data.data.title}</Message>
  }
  if (cart.cartItems.length === 0) {
    return (
      <div className="py-[5rem] text-center pr-[1rem]">
        <Message variant="danger">
          Your cart is empty{" "}
          <Link
            to="/shop"
            className="text-yellow-400 underline font-bold italic"
          >
            Go To Shop
          </Link>
        </Message>
      </div>
    );
  }
  return (
    <>
      <div className="py-[2rem] ">
        <ProgressSteps step1 step2 step3 />
      </div>

      <div className="  ml-[5rem] mr-[5rem] my-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse ">
            <thead className=" bg-gray-100 rounded">
              <tr>
                <td className="px-2 py-2 text-left align-top">Image</td>
                <td className="px-1 py-2 text-left">Product</td>
                <td className="px-1 py-2 text-left">Quantity</td>
                <td className="px-1 py-2 text-left">Price</td>
                <td className="px-1 py-2 text-left">Total</td>
              </tr>
            </thead>

            <tbody>
              {cart.cartItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-2">
                    <img
                      src={`/uploads/${item.img.split("/").pop()}`}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>

                  <td className="p-2">
                    <Link
                      className="text-pink-400 font-bold underline hover:text-pink-600"
                      to={`/product/${item._id}`}
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.price.toFixed(2)}</td>
                  <td className="p-2">
                    $ {(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-15">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-gray-100 rounded">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">Items:</span> $
                {cart.itemsPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Shipping:</span> $
                {cart.shippingPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Tax:</span> $
                {cart.taxPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> $
                {cart.totalPrice}
              </li>
            </ul>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <div className="flex justify-center mb-[5rem]">
            <button
              type="submit"
              className="bg-pink-500 cursor-pointer hover:bg-pink-600 text-white py-2 
              px-4 rounded text-lg w-2/5 mt-4 mb-[5rem] flex items-center justify-center"
              disabled={cart.cartItems === 0}
              onClick={placeOrderHandler}
            >
              <span>
                Place Order {" "}
              </span>
              {isLoading && <Loader/>}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
