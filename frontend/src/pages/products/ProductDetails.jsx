import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useRelatedProductsQuery,
  useGetReviewsProductByIdQuery,
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
import ProductsSlider from "../products/ProductsSlider";
import PageLoader from "../../components/PageLoader";
import DontHave from "../../components/DontHave";
import Review from "./Review";
import apiSlice from "../../redux/services/apiSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [quantityBuyed, setQuantityBuyed] = useState(1);
  console.log("quantityBuyed", quantityBuyed);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const [shouldFetchReviews, setShouldFetchReviews] = useState(true);

  const {
    data: product,
    isLoading,
    isFetching,
    error,
  } = useGetProductDetailsQuery(id, {
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

  const [pageReviews, setPageReviews] = useState(1);
  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isFetching: isFetchingReviews,
    isError: isErrorReviews,
  } = useGetReviewsProductByIdQuery(
    { id, page: pageReviews, limit: 5 },
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
    if (
      !isFetchingReviews &&
      reviews?.data?.reviews[0]?.user === userInfo._id
    ) {
      setRating(reviews?.data?.reviews[0]?.rating);
    }
  }, [reviews, isFetchingReviews, userInfo]);

  useEffect(() => {
    setPageReviews(1);
    setShouldFetchReviews(false);
  }, [id]);

  const createReviewtHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedReviewResponse = await createReview({
        id,
        rating,
        comment,
      }).unwrap();
      setComment("");
      const createdReview = updatedReviewResponse.data.review;
      dispatch(
        apiSlice.util.updateQueryData(
          "getReviewsProductById",
          { id, page: 1 },
          (draft) => {
            draft.data.reviews.unshift(createdReview);
            draft.totalReviews += 1;
          }
        )
      );
      toast.success("Review submitted successfully");
    } catch (error) {
      if (error.status < 500) {
        toast.error(error?.data?.message || "Please try again later.");
      } else {
        toast.error("Please try again later.");
      }
    }
  };

  const addToCartHandler = () => {
    if (userInfo) {
      dispatch(
        addToCart({ ...product?.data?.product, quantity: quantityBuyed })
      );
      toast.success("Product added to cart");
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
      <div className="relative pt-[2rem] mx-[2rem]">
        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Image Section */}
          <div className="relative flex-shrink-0">
            <img
              src={`/uploads/${product?.data?.product?.img.split("/").pop()}`}
              alt={product?.data?.product?.name}
              className="w-full rounded-lg object-fill h-64 sm:h-80 md:h-96 lg:h-100"
            />
            <HeartIcon
              product={product?.data?.product}
              xPosition={"left-2"}
              yPosition={"top-2"}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between w-full lg:w-auto">
            <h2 className="text-xl sm:text-2xl font-bold">
              {product?.data?.product?.name}
            </h2>
            <p className="w-full sm:w-80 md:w-96 lg:w-[30rem] xl:w-[35rem] my-2 sm:my-4 text-[#808080] text-sm sm:text-base">
              {product?.data?.product?.discription}
            </p>
            <p className="text-2xl sm:text-3xl my-2 sm:my-4 font-bold">
              ${product?.data?.product?.price}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full">
                <h1 className="flex items-center mb-2 sm:mb-4 text-sm sm:text-base">
                  <FaStore className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Brand:{" "}
                  {product?.data?.product?.brand}
                </h1>
                <h1 className="flex items-center mb-2 sm:mb-4 text-sm sm:text-base">
                  <FaClock className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Added:{" "}
                  {moment(product?.data?.product?.createdAt).fromNow()}
                </h1>
                <h1 className="flex items-center mb-2 sm:mb-4 text-sm sm:text-base">
                  <FaStar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Reviews:{" "}
                  {product?.data?.product?.numReview}
                </h1>
              </div>
              <div className="w-full">
                <h1 className="flex items-center mb-2 sm:mb-4 text-sm sm:text-base">
                  <FaStar className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Rating:{" "}
                  {product?.data?.product?.rating}
                </h1>
                <h1 className="flex items-center mb-2 sm:mb-4 text-sm sm:text-base">
                  <FaShoppingCart className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{" "}
                  Quantity: {product?.data?.product?.quantity}
                </h1>
                <h1 className="flex items-center mb-2 sm:mb-4 text-sm sm:text-base">
                  <FaBox className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> In Stock:{" "}
                  {product?.data?.product?.countInStock}
                </h1>
              </div>
            </div>

            {/* Ratings and Quantity Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 my-2 sm:my-4">
              <Ratings
                rating={product?.data?.product?.rating}
                text={`${product?.data?.product?.numReview} reviews`}
                className="text-xs sm:text-sm"
              />
              {product?.data?.product?.countInStock > 0 && (
                <div>
                  <select
                    value={quantityBuyed}
                    onChange={(e) => setQuantityBuyed(Number(e.target.value))}
                    className="p-1 sm:p-2 w-20 sm:w-24 rounded-lg text-black border border-gray-300 bg-gray-100 text-sm sm:text-base"
                  >
                    {[
                      ...Array(product?.data?.product?.countInStock).keys(),
                    ].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="btn-container">
              <button
                onClick={addToCartHandler}
                disabled={product?.data?.product?.countInStock === 0}
                className="bg-pink-600 cursor-pointer text-white py-2 px-4 sm:px-6 rounded-lg text-sm sm:text-base hover:bg-pink-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts?.data?.data?.products.length > 0 && (
          <div className="mt-8">
            <h1 className="text-xl sm:text-2xl font-bold italic text-gray-600">
              Related OR Top Products
            </h1>
            <hr className="mb-4 mt-2 text-gray-200" />
            {relatedProducts?.isLoading ? (
              <div className="flex items-center justify-center h-50">
                <Loader />
              </div>
            ) : (
              <ProductsSlider relatedProducts={relatedProducts} />
            )}
          </div>
        )}

        {/* Product Reviews */}
        <div className="mt-8 w-full xl:w-[50rem] md:w-[35rem]">
          <h1 className="text-xl sm:text-2xl font-bold italic text-gray-600">
            Product reviews ({product?.data?.product?.numReview})
          </h1>
          <hr className="mb-4 mt-2 text-gray-200" />
          {userInfo && (
            <div>
              <textarea
                type="text"
                placeholder="Add Your Review"
                name="comment"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="py-3 placeholder:italic placeholder:font-blod border-gray-200 border-2 focus:border-gray-400 px-4 rounded-lg focus:outline-none border-lg w-full text-sm sm:text-base"
              ></textarea>
              {comment.length > 0 && (
                <div className="flex justify-end">
                  <button
                    className="text-white py-2 px-4 rounded-full font-bold bg-gradient-to-r bg-[#a4c8d7] hover:from-[#0083d4] hover:to-[#00b3a3] focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer text-sm sm:text-base"
                    onClick={() => setComment("")}
                  >
                    Clear
                  </button>
                  <button
                    className="text-white py-2 px-4 bg-gradient-to-r ml-2 flex items-center justify-center from-[#0094D4] to-[#00C4B4] font-bold rounded-full hover:from-[#0083d4] hover:to-[#00b3a3] focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer text-sm sm:text-base"
                    onClick={createReviewtHandler}
                  >
                    Submit{" "}
                    {isLoadingCreateReview && (
                      <div className="flex items-center justify-center">
                        <Loader />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          <section>
            {isLoadingReviews && (
              <div className="flex items-center justify-center h-50">
                <Loader />
              </div>
            )}
            {!isLoadingReviews && (
              <div className="mt-4">
                {reviews?.data?.reviews?.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {reviews?.data?.reviews?.map((review) => (
                      <Review
                        productId={id}
                        key={review._id}
                        userInfo={userInfo}
                        review={review}
                      />
                    ))}
                    {isFetchingReviews && (
                      <div className="flex h-15 items-center justify-center">
                        <Loader />
                      </div>
                    )}
                    <div className="h-1" ref={loadMoreReviews}></div>
                  </div>
                ) : (
                  <DontHave className={"h-full text-sm sm:text-base"}>
                    Be The First Reviewer
                  </DontHave>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="mt-[5rem] h-1"></div>
      </div>
    </>
  );
}
