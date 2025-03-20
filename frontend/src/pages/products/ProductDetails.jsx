import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/apis/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
export default function ProductDetails() {
  const { id } = useParams();
  // const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const { data, isLoading, refetch, error } = useGetProductDetailsQuery(id);
  const product = data?.data?.product;

  const userInfo = useSelector((state) => state.auth.userInfo);

  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();
  
  const submitHandler = async (e) => { 
    e.preventDefault();
    try {
      await createReview({ id, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  const addToCartHandler = () => {
    if (userInfo) {
      dispatch(addToCart({ ...product, quantity }));
      toast.success("Product added to cart");
    } else {
      toast.error("Please login first");
      // navigate("/login");
    }
  }
  return (
    <>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-between pt-[2rem] ml-[3rem]">
            <div>
              <img
                src={`/uploads/${product.img.split("/").pop()}`}
                alt={product.name}
                className="w-full xl:w-[40rem] lg:w-[35rem] rounded  
                sm:w-[20rem] mr-[2rem]"
              />
              <HeartIcon product={product}  xPosition={"left-2"} yPosition={"top-2"} />
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className=" xl:w-[35rem] lg:w-[35rem] md:w-[30rem] my-4 text-[#808080] ">
                {product.discription}
              </p>
              <p className="text-4xl my-4 font-bold">${product.price}</p>
              <div className="flex items-center w-full justify-start">
                <div className="one  w-[15rem]">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2" /> Brand: {" " + product.brand}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaClock className="mr-2" /> Added:{" "}
                    {" " + moment(product.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2" /> Reviews:
                    {" " + product.numReview}
                  </h1>
                </div>
                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2" /> Rating:
                    {" " + product.rating}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2" /> Quantity:
                    {" " + product.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaBox className="mr-2" /> In Stock:
                    {" " + product.countInStock}
                  </h1>
                </div>
              </div>

              <div className="flex justify-start  flex-wrap">
                <Ratings
                  rating={product.rating}
                  text={`${product.numReview} reviews`}
                />
                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg text-black border border-gray-300 bg-gray-100"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="btn-container">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 cursor-pointer text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
                >
                  Add To Cart
                </button>
              </div>
                </div>
                

                {/* deleted part */}
            <div
              className="mt-[5rem] container flex flex-wrap items-start 
                justify-between mb-[5rem]"
            >
              <ProductTabs
                loadingProductReview={loadingReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
