import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../../redux/apis/productApiSlice";
import SamallProduct from "./SamallProduct";
import Loader from "../../components/Loader";
import Review from "./Review";

export default function ProductTabs({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) {
  const { data: products, isloading } = useGetTopProductsQuery()
  const [activeTab, setActiveTab] = useState(2);
  
  
  if (isloading)
    return <Loader />
  const writeRatingsHandler = (e) => {
    e.preventDefault();
    let rating = e.target.value;
    if (!Number(rating)) {
      return
    } 
    rating = rating[rating.length - 1];
    if(rating > 5 || rating < 0) return
    setRating(rating);
  }
  const handleTabClick = (tab) => () => setActiveTab(tab);
  const addReviewAndRatingsHandler = () => { }
  return (
    <div className="w-full flex flex-col ">
      <section className="mr-[5rem] flex flex-row items-between ">
        <div
          className={` p-4 pl-0 cursor-pointer text-lg
        ${activeTab == 1 ? "font-bold underline decoration-pink-600" : ""}`}
          onClick={handleTabClick(1)}
        >
          Write Your Review
        </div>
        <div
          className={` p-4 cursor-pointer text-lg
        ${activeTab == 2 ? "font-bold underline decoration-pink-600" : ""}`}
          onClick={handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={` p-4 cursor-pointer text-lg
        ${activeTab == 3 ? "font-bold underline decoration-pink-600" : ""}`}
          onClick={handleTabClick(3)}
        >
          Related Products
        </div>
        <hr />
      </section>
      <section>
        {activeTab == 1 && (
          <div className="mt-4 ml-[0.5rem]">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label
                    htmlFor="rating"
                    className="block mb-2 text-xl font-medium text-gray-900"
                  >
                    Rating
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    name="rating"
                    id="rating"
                    value={rating}
                    onChange={writeRatingsHandler}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-1/2 p-2.5"
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="comment"
                    className="block mb-2 text-xl font-medium text-gray-900"
                  >
                    Comment
                  </label>
                  <textarea
                    type="text"
                    name="comment"
                    id="comment"
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-1/2 p-2.5"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="text-white py-2 px-4 rounded-lg focus:outline-none
                  focus:ring-2 focus:ring-pink-400 bg-[#0094D4] cursor-pointer
                  focus:ring-opacity-50"
                  disabled={loadingProductReview}
                  onClick={addReviewAndRatingsHandler}
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please{" "}
                <Link to="/login" className="text-pink-600">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}
      </section>
      <section>
        {activeTab == 2 && (
          <div className="mt-4 ml-[0.5rem]">
            {product.reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {product.reviews.map((review) => (
                  <Review key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <p className=" text-2xl text-red-400 font-semibold">No Reviews</p>
            )}
          </div>
        )}
      </section>
      <section>
        {activeTab === 3 && (
          <section className=" flex flex-wrap">
            {!products ? (
              <Loader />
            ) : (
              products?.data?.products.map((product) => (
                <div key={product._id}>
                  <SamallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
}
