import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  clearCartItems,
  removeFromCart,
} from "../../redux/features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
import { motion } from "motion/react";
import EmptyCart from "../../components/EmptyCart";
import { useEffect } from "react";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.auth.userInfo);


      useEffect(() => {
        window.document.title = "Shopping Cart";
      }, []);


  const checkoutHandler = () => {
    if (userInfo) return navigate("/shipping");
    navigate("/login?redirect=/shipping");
  };

  const clearCartItemsHandler = () => {
    dispatch(clearCartItems());
  };

  const quantityChangeHandler = (e, item) => {
    e.preventDefault();
    dispatch(addToCart({ ...item, quantity: Number(e.target.value) }));
  };

  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen text-gray-800">
      {/* duplicate wiht checkout */}
      {cart.cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-2/3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold 
              bg-gradient-to-r  from-indigo-500 to-purple-300 bg-clip-text text-transparent "
              >
                Shopping Cart ({cart?.cartItems?.length})
              </h1>
              <button
                onClick={clearCartItemsHandler}
                className="mt-4 sm:mt-0 text-white font-bold    py-2 px-4 sm:px-6 
                rounded-xl  bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 
                text-sm sm:text-base "
              >
                Clear Cart
              </button>
            </div>
            <div className="space-y-4">
              {cart?.cartItems?.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-row items-start sm:items-center
                  bg-white p-4 rounded-xl border border-gray-200
                    transition-all duration-300 
                  shadow-sm hover:shadow-md"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24  flex-shrink-0">
                    <img
                      src={
                        item.img
                          ? `/uploads/${
                              item?.img?.split("/").pop() || "defaultImage.png"
                            }`
                          : "/userImge.png"
                      }
                      onError={(e) => (e.target.src = "/userImge.png")}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg border
                      border-gray-300 hover:border-indigo-400 
                      transition-colors"
                    />
                  </div>
                  <div className="flex-1 mt-4 sm:mt-0 ml-4">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-base sm:text-lg md:text-xl font-semibold 
                      text-black hover:underline hover:text-purple-600 transition-colors 
                      duration-300"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">
                      <span className="font-medium italic">Brand:</span>{" "}
                      {item.brand}
                    </p>
                    <p
                      className="text-sm sm:text-base md:text-lg font-bold 
                    text-indigo-600"
                    >
                      ${item.price}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center gap-3">
                    <div className="flex items-center">
                      <span
                        className="text-xs sm:text-sm md:text-base 
                      text-gray-600 italic mr-2"
                      >
                        Qty:
                      </span>
                      <select
                        value={item.quantity}
                        onChange={(e) => quantityChangeHandler(e, item)}
                        className="bg-gray-100 border border-gray-300 rounded-lg
                        text-sm sm:text-base text-gray-800  p-[2px]
                        focus:outline-none focus:ring-2 focus:ring-indigo-400 
                        transition-colors"
                      >
                        {[...Array(item.countInStock)].map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <FaTrash
                      onClick={() => removeFromCartHandler(item._id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer 
                      w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/3 mt-6 lg:mt-0"
          >
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h2
                className="text-lg font-bold sm:text-xl md:text-2xl 
                bg-gradient-to-r from-indigo-500 to-purple-300 bg-clip-text text-transparent mb-4"
              >
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm sm:text-base md:text-lg text-gray-600">
                  <span className="font-medium">Items Price:</span>
                  <span>${cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base md:text-lg text-gray-600">
                  <span className="font-medium">Shipping Price:</span>
                  <span>${cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base md:text-lg text-gray-600">
                  <span className="font-medium">Tax Price:</span>
                  <span>${cart.taxPrice}</span>
                </div>
                <hr className="border-gray-300" />
                  <div className="flex justify-between text-base sm:text-lg md:text-xl 
                font-bold text-indigo-900">
                  <span>Total Price:</span>
                  <span>${cart.totalPrice}</span>
                </div>
              </div>
              <button
                onClick={checkoutHandler}
                disabled={cart.cartItems?.length === 0}
                className="w-full mt-6 cursor-pointer text-white bg-gradient-to-r 
                from-indigo-600 to-purple-600 hover:from-indigo-700 
                hover:to-purple-700 
                transition-all duration-300  py-3 px-4 rounded-lg 
                disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
