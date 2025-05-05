import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { GiFlamethrowerSoldier } from "react-icons/gi";
import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
  useRelatedProductsQuery,
  useGetReviewsProductByIdQuery,
  useCreateRatingMutation,
} from "../../redux/apis/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductsSlider from "../products/ProductsSlider";
import PageLoader from "../../components/PageLoader";
import DontHave from "../../components/DontHave";
import Review from "./Review";
import apiSlice from "../../redux/services/apiSlice";
import PriceDiscont from "./PriceDiscont";
import QuantitySelector from "./QuantitySelector";
import ImageZoom from "./ImageZoom";
import { prefixImageUrl } from "../../utils/constance";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantityBuyed, setQuantityBuyed] = useState(1);
  const [comment, setComment] = useState("");
  const [hoverStart, setHoveredStar] = useState(-1);
  const dispatch = useDispatch();
  const [shouldFetchReviews, setShouldFetchReviews] = useState(true);

  const {
    data: product,
    isLoading,
    isFetching,
    error,
  } = useGetProductByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const relatedProducts = useRelatedProductsQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const userInfo = useSelector((state) => state.auth.userInfo);
  const [createReview, { isLoading: isLoadingCreateReview }] =
    useCreateReviewMutation();
  const [createRating] = useCreateRatingMutation();
  const [pageReviews, setPageReviews] = useState(1);
  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isFetching: isFetchingReviews,
    isError: isErrorReviews,
  } = useGetReviewsProductByIdQuery(
    { id, page: pageReviews, limit: 10 },
    {
      skip: shouldFetchReviews,
      refetchOnMountOrArgChange: true,
    }
  );

  const loadMoreReviews = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetchingReviews &&
          !isErrorReviews &&
          reviews?.hasNextPage
        ) {
          setPageReviews((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreReviews.current) {
      observer.observe(loadMoreReviews.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [loadMoreReviews, isFetchingReviews, reviews, isErrorReviews]);

  useEffect(() => {
    setPageReviews(1);
    setShouldFetchReviews(false);
    setComment("");
    setHoveredStar(-1);
    setQuantityBuyed(1);
  }, [id]);

  useEffect(() => {
    // console.log(reviews?.data?.reviews[0]?.user._id);
    // console.log(userInfo?._id);
    if (reviews?.data?.reviews[0]?.user._id === userInfo?._id) {
      setHoveredStar(reviews?.data?.reviews[0]?.rating);
    }else{
      setHoveredStar(-1);
    }
  }, [userInfo, id, reviews]);

  const createOREditeRatingHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedRatingResponse = await createRating({
        id,
        rating: +e.target.value,
      }).unwrap();
      const createdRating = updatedRatingResponse.data.review;
      dispatch(
        apiSlice.util.updateQueryData(
          "getReviewsProductById",
          { id, page: 1 },
          (draft) => {
            if (draft.data.reviews[0]?.user._id === createdRating.user._id) {
              draft.data.reviews[0] = createdRating;
            }
          }
        )
      );
      // toast.success("Rating submitted successfully");
    } catch (error) {
      if (error.status < 500) {
        toast.error(error?.data?.message || "Please try again later.");
      } else {
        toast.error("Please try again later.");
      }
    }
  };
  const createReviewtHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedReviewResponse = await createReview({
        id,
        comment,
      }).unwrap();
      setComment("");
      console.log(updatedReviewResponse);
      dispatch(
        apiSlice.util.updateQueryData(
          "getReviewsProductById",
          { id, page: 1 },
          (draft) => {
            draft.data.reviews.unshift(updatedReviewResponse.data.review);
            draft.data.numComments = updatedReviewResponse.data.numComments;
          }
        )
      );
      // toast.success("Review submitted successfully");
    } catch (error) {
      if (error.status < 500) {
        toast.error(error?.data?.message || "Please try again later.");
      } else {
        toast.error("Please try again later.");
      }
    }
  };
  useEffect(() => {
    window.scrollTo(0, { behavior: "smooth" });
    setQuantityBuyed(1);
  }, []);

  const addToCartHandler = () => {
    if (userInfo) {
      dispatch(
        addToCart({
          ...product?.data?.product,
          totalQuantity: product?.data?.product?.quantity,
          quantity: quantityBuyed,
        })
      );
      // toast.success("Product added to cart");
    } else {
      toast.error("Please login first");
      navigate(`/login?redirect=/product/${product?.data?.product?._id}`);
    }
  };

  if (isLoading || isFetching) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Message variant="error">
        {error?.data?.message || error.message || "Something went wrong"}
      </Message>
    );
  }

  return (
    <>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl p-6"
        >
          {/* Image Section */}
          <div className="relative">
            <div className="sticky top-4 z-10">
              <div
                className="w-full  flex justify-center items-center
              rounded-lg  transition-transform duration-300 
              hover:scale-105 h-72 sm:h-96 lg:h-[28rem] "
              >
                <ImageZoom
                  src={`${prefixImageUrl}${product?.data?.product?.img
                    .split("/")
                    .pop()}`}
                  name={product?.name}
                />
              </div>
              <HeartIcon
                product={product?.data?.product}
                className={" right-2 bottom-2  "}
              />
              {product?.data?.product?.discount !== 0 && (
                <div
                  className="absolute top-0 left-0 bg-gray-800 text-white
                text-base sm:text-lg px-2 py-1 rounded-br-lg rounded-tl-md
                font-semibold "
                >
                  {product?.data?.product?.discount}% off
                </div>
              )}
              {product?.data?.product?.sold > 99 && (
                <div
                  className="absolute top-0 right-0 bg-yellow-500 text-white 
                text-base sm:text-lg px-2 py-1 rounded-bl-lg rounded-tr-md
                font-semibold"
                >
                  Best Seller
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              {/* <div className="flex mb-5 items-center justify-between"> */}
              {userInfo?.isAdmin && (
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/admin/product/update/${id}`)}
                    className="w-[100px] cursor-pointer bg-gradient-to-r 
                    from-indigo-600 to-purple-600 text-white py-2 px-6 
                    rounded-lg font-medium text-sm sm:text-base hover:from-indigo-700 
                    hover:to-purple-700 transition-all duration-300  shadow-md"
                  >
                    Update
                  </button>
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {product?.data?.product?.name}
              </h2>

              {/* </div> */}
              <p className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed">
                {product?.data?.product?.discription}
              </p>
              <PriceDiscont
                className="mt-4 gap-8"
                text="text-3xl font-bold"
                originalPrice={product?.data?.product?.originalPrice}
                price={product?.data?.product?.price}
                discount={product?.data?.product?.discount || 0}
              />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <p className="flex items-center text-gray-700 text-sm sm:text-base">
                  <FaStore className="mr-2 w-5 h-5 text-indigo-500" />{" "}
                  <span className="font-medium mr-1">Brand:</span>{" "}
                  {product?.data?.product?.brand}
                </p>
                <p className="flex items-center text-gray-700 text-sm sm:text-base">
                  <FaClock className="mr-2 w-5 h-5 text-indigo-500" />{" "}
                  <span className="font-medium mr-1">Added:</span>{" "}
                  {moment(product?.data?.product?.createdAt).fromNow()}
                </p>
                <p className="flex items-center text-gray-700 text-sm sm:text-base">
                  <FaStar className="mr-2 w-5 h-5 text-indigo-500" />{" "}
                  <span className="font-medium mr-1">Reviews:</span>{" "}
                  {product?.data?.product?.numRatings}
                </p>
                <Ratings
                  rating={product?.data?.product?.rating}
                  text={`(${product?.data?.product?.numRatings})`}
                  className="text-sm sm:text-base text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <p className="flex items-center text-gray-700 text-sm sm:text-base">
                  <FaStar className="mr-2 w-5 h-5 text-indigo-500" />{" "}
                  <span className="font-medium mr-1">Rating:</span>{" "}
                  {product?.data?.product?.rating.toFixed(2)}
                </p>
                <p className="flex items-center text-gray-700 text-sm sm:text-base">
                  <FaShoppingCart className="mr-2 w-5 h-5 text-indigo-500" />{" "}
                  <span className="font-medium mr-1">Quantity:</span>{" "}
                  {product?.data?.product?.quantity}
                </p>
                <p className="flex items-center text-gray-700 text-sm sm:text-base">
                  <GiFlamethrowerSoldier className="mr-2 w-5 h-5 text-indigo-500" />{" "}
                  <span className="font-medium mr-1">sold:</span>{" "}
                  {product?.data?.product?.sold}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-center mt-6">
              {product?.data?.product?.quantity > 0 && (
                <QuantitySelector
                  className={"w-7 h-6 sm:w-8 sm:h-7"}
                  increase={() =>
                    setQuantityBuyed(
                      quantityBuyed >= +product?.data?.product?.quantity
                        ? quantityBuyed
                        : quantityBuyed + 1
                    )
                  }
                  decrease={() => setQuantityBuyed(quantityBuyed - 1)}
                  quantityBuyed={quantityBuyed}
                  maxQuantity={product?.data?.product?.quantity}
                />
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={product?.data?.product?.quantity === 0}
              className="mt-6 w-full sm:w-auto cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-white py-3 px-6 rounded-lg font-medium text-sm sm:text-base  disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts?.data?.data?.products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="mt-12 shadow-lg p-4 rounded-2xl"
          >
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Related Products
            </h1>
            <hr className="my-4 border-gray-200" />
            {relatedProducts?.isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader />
              </div>
            ) : (
              <ProductsSlider relatedProducts={relatedProducts} />
            )}
          </motion.div>
        )}

        {/* Product Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-12 bg-white shadow-lg rounded-xl p-6"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            Product Reviews ({product?.data?.product?.numComments})
          </h1>
          <hr className="my-4 border-gray-200" />
          {userInfo && (
            <div className="mb-6">
              {/* Rating Slider with Tailwind */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  Your Rating:
                </span>
                <div className="flex flex-row gap-1">
                  <input
                    type="radio"
                    id="star0"
                    value="0"
                    onClick={(e) => {
                      setHoveredStar(0);
                      createOREditeRatingHandler(e);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="star0"
                    title="start 0"
                    className={`text-2xl cursor-pointer transition-colors 
                  duration-200 ${
                    hoverStart === 0 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  >
                    0
                  </label>
                  <input
                    type="radio"
                    id="star1"
                    value="1"
                    onClick={(e) => {
                      setHoveredStar(1);
                      createOREditeRatingHandler(e);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="star1"
                    title="start 1"
                    className={`text-2xl cursor-pointer transition-colors 
                  duration-200 ${
                    hoverStart >= 1 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  >
                    ★
                  </label>
                  <input
                    type="radio"
                    id="star2"
                    value="2"
                    onClick={(e) => {
                      setHoveredStar(2);
                      createOREditeRatingHandler(e);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="star2"
                    title="start 2"
                    className={`text-2xl cursor-pointer transition-colors 
                  duration-200 ${
                    hoverStart >= 2 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  >
                    ★
                  </label>
                  <input
                    type="radio"
                    id="star3"
                    value="3"
                    onClick={(e) => {
                      setHoveredStar(3);
                      createOREditeRatingHandler(e);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="star3"
                    title="start 3"
                    className={`text-2xl cursor-pointer transition-colors 
                  duration-200 ${
                    hoverStart >= 3 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  >
                    ★
                  </label>
                  <input
                    type="radio"
                    id="star4"
                    value="4"
                    onClick={(e) => {
                      setHoveredStar(4);
                      createOREditeRatingHandler(e);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="star4"
                    title="start 4"
                    className={`text-2xl cursor-pointer transition-colors 
                  duration-200 ${
                    hoverStart >= 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  >
                    ★
                  </label>
                  <input
                    type="radio"
                    id="star5"
                    value="5"
                    onClick={(e) => {
                      setHoveredStar(5);
                      createOREditeRatingHandler(e);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="star5"
                    title="start 5"
                    className={`text-2xl cursor-pointer transition-colors 
                  duration-200 ${
                    hoverStart >= 5 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  >
                    ★
                  </label>
                </div>
              </div>

              <textarea
                type="text"
                placeholder="Write your review..."
                name="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm sm:text-base shadow-sm placeholder-gray-400"
              ></textarea>
              {comment.length > 0 && (
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="py-2 px-6 bg-gray-200 cursor-pointer text-gray-700 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-300 transition-colors duration-300 shadow-sm"
                    onClick={() => setComment("")}
                  >
                    Clear
                  </button>
                  <button
                    className="py-2 px-6  cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 text-white rounded-lg font-medium text-sm sm:text-base  flex items-center gap-2 shadow-sm"
                    onClick={createReviewtHandler}
                  >
                    Submit
                    {isLoadingCreateReview && (
                      <Loader loaderColor="border-white" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          <section>
            {isLoadingReviews && (
              <div className="flex items-center justify-center h-32">
                <Loader />
              </div>
            )}
            {!isLoadingReviews && (
              <div>
                {reviews?.data?.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {reviews?.data?.reviews?.map((review) => (
                      <Review
                        productId={id}
                        key={review._id}
                        userInfo={userInfo}
                        review={review}
                      />
                    ))}
                    {isFetchingReviews && (
                      <div className="flex items-center justify-center h-16">
                        <Loader />
                      </div>
                    )}
                    <div className="h-1" ref={loadMoreReviews}></div>
                  </div>
                ) : (
                  <DontHave className="text-sm sm:text-base text-gray-600 py-6">
                    Be The First Reviewer
                  </DontHave>
                )}
              </div>
            )}
          </section>
        </motion.div>
      </div>
    </>
  );
}
