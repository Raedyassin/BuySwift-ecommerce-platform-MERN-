import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  clearCartItems,
  removeFromCart,
} from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };
  const clearCartItemsHandler = () => {
    dispatch(clearCartItems());
  };
  const quantityChangeHandler = (e, item) => {
    dispatch(addToCart({ ...item, quantity: Number(e.target.value) }));
  };
  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <>
      <div
        className="container flex justify-around items-start 
      mx-auto py-8 flex-wrap gap-4"
      >
        {cart.cartItems.length === 0 ? (
          <div className="text-xl font-bold">
            Your cart is empty{" "}
            <Link to="/shop" className="text-yellow-400 underline ">
              Go To Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-[80%]">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold mb-4">
                  Shopping Cart{" "}
                  <span className="text-pink-600">
                    ({cart.cartItems.length})
                  </span>
                </h1>
                <button
                  className="text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-600 cursor-pointer focus:ring-opacity-50"
                  onClick={clearCartItemsHandler}
                >
                  Clear Cart
                </button>
              </div>
              {cart.cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex mb-4  items-center bg-gray-100 p-4 rounded-lg"
                >
                  <div className="w-[5rem]  h-[5rem]">
                    <img
                      src={`/uploads/${item.img.split("/").pop()}`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold text-pink-800 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <div className="text-gray-600">
                      <span className="font-simibold italic">Brand:</span>{" "}
                      {item.brand}
                    </div>
                    <div className="text-gray-600 font-bold">${item.price}</div>
                  </div>
                  <div className="ml-4  flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      <span className="font-simibold italic">Quantity: </span>
                      <select
                        value={item.quantity}
                        onChange={(e) => quantityChangeHandler(e, item)}
                        className="mx-2 border w-14 border-gray-300 border-solid rounded"
                      >
                        {[...Array(item.countInStock)].map((x, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                      <FaTrash
                        onClick={() => removeFromCartHandler(item._id)}
                        className="ml-2 cursor-pointer text-red-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg space-y-4">
                  <div className="text-xl flex items-center  ">
                    <span className="font-semibold w-[10rem] ">
                      Items Price:
                    </span>
                    <span>{"  $" + cart.itemsPrice} </span>
                  </div>
                  <div className="text-xl flex items-center">
                    <span className="font-semibold w-[10rem]">
                      Shipping Price:
                    </span>
                    <span>{"  $" + cart.shippingPrice}</span>
                  </div>
                  <div className="text-xl flex items-center">
                    <span className="font-semibold w-[10rem]">Tax Price:</span>
                    <span>{"  $" + cart.taxPrice}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="text-xl flex items-center">
                    <span className="font-semibold w-[10rem]">
                      Total Price:
                    </span>
                    <span>{"  $" + cart.totalPrice}</span>
                  </div>

                  <button
                    className="cursor-pointer text-white bg-pink-600 mt-4 py-2 px-4 rounded-full text-lg w-full"
                    disabled={cart.cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
