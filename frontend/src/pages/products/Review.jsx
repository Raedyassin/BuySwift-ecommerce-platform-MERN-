import { useState } from "react";
import Ratings from "./Ratings";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { useEditeProductReviewMutation } from "../../redux/apis/productApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import apiSlice from "../../redux/services/apiSlice";

export default function Review({ review, userInfo, productId  }) {
  const [showMoreDescription, setShowMoreDescription] = useState([]);
  const dispatch = useDispatch();
  const [showEdite, setShowEdit] = useState(false);
  const [editeText, setEditeText] = useState(review.comment);
  const [editeProductReview, { isLoading: editeLoading }] =
    useEditeProductReviewMutation();

  const EditeReviewtHandler = async (e) => {
    if (editeText.trim() === review.comment.trim()) {
      toast.info("You Don't Edite The Comment");
      setShowEdit(false);
      return;
    }
    e.preventDefault();
    try {
      const updatedReviewResponse = await editeProductReview({
        id: productId,
        reviewId: review?._id,
        comment: editeText,
      }).unwrap();
      setShowEdit(false);
      const updatedReview = updatedReviewResponse.data.review;
      dispatch(
        apiSlice.util.updateQueryData(
          "getReviewsProductById",
          { id: productId, page: 1 },
          (draft) => {
            const reviewIndex = draft.data.reviews.findIndex(
              (r) => r._id === review._id
            );
            if (reviewIndex !== -1) {
              draft.data.reviews[reviewIndex] = {
                // ...draft.data.reviews[reviewIndex],
                ...updatedReview,
              };
            }
          }
        )
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Please try Edit your review again later.");
    }
  };
  return (
    <div key={review._id} className={`p-2 rounded-lg  sm:ml-[0rem]`}>
      <div className="flex justify-between">
        <div className="flex justify-start items-center gap-3">
          <img
            src={
              review?.user?.img
                ? "/uploads/user/" + review?.user?.img?.split("/").pop()
                : "../../../public/userImge.png"
            }
            alt={review?.user?.username}
            className="w-11 h-11 object-cover border-2 border-indigo-200 rounded-full"
          />
          <div className="text-sm sm:text-base flex items-center gap-2">
            <strong className="text-gray-600">{review?.user?.username}</strong>
            <p className="text-gray-400  text-xs sm:text-sm">
              {review?.updatedAt?.substring(0, 10)}
            </p>
          </div>
        </div>
        {review?.user?._id === userInfo?._id && (
          <div>
            <button
              className="mr-2 p-1 px-2 rounded-2xl bg-gray-200 italic text-gray-500 hover:text-gray-700 
              cursor-pointer text-xs sm:text-sm"
              onClick={() => {
                setShowEdit(!showEdite);
                setEditeText(review.comment);
              }}
            >
              Edite
            </button>
          </div>
        )}
      </div>

      <div className="ml-[3.5rem]">
        {editeLoading && (
          <div className=" h-[74px] flex items-center justify-center">
            <Loader />
          </div>
        )}
        {showEdite && !editeLoading ? (
          <div className=" mt-2">
            <textarea
              type="text"
              value={editeText}
              rows={4}
              onChange={(e) => setEditeText(e.target.value)}
              className="py-3 border-gray-200 border-1 focus:border-gray-400 
                px-4 rounded w-full focus:outline-none border-lg text-sm sm:text-base"
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                className="text-white py-2 px-4  rounded-full font-bold 
                      bg-gradient-to-r from-indigo-600 to-purple-600  text-sm sm:text-base 
                      hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 
                      shadow-md focus:outline-none cursor-pointer"
                onClick={() => setShowEdit(false)}
              >
                <IoCloseSharp className="text-md md:text-lg" />
              </button>
              <button
                className="text-white py-2 px-4 ml-2 rounded-full font-bold 
                      bg-gradient-to-r from-indigo-600 to-purple-600  text-sm sm:text-base 
                      hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 
                      shadow-md focus:outline-none cursor-pointer"
                onClick={(e) => EditeReviewtHandler(e)}
              >
                <IoMdCheckmark className="text-md md:text-lg" />
              </button>
            </div>
          </div>
        ) : (
          <p className="my-2 mt-1 text-gray-600 text-sm sm:text-base">
            {!showMoreDescription.includes(review._id) &&
            review?.comment?.length > 250 ? (
              <>
                <span>{review.comment.substring(0, 250)}</span>
                <span
                  onClick={() =>
                    setShowMoreDescription([showMoreDescription, review._id])
                  }
                  className="text-indigo-600 italic font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  {" "}
                  Read more...
                </span>
              </>
            ) : (
              <>
                <span>{review?.comment}</span>
                {showMoreDescription.includes(review._id) && (
                  <span
                    onClick={() =>
                      setShowMoreDescription(
                        showMoreDescription.filter((id) => id !== review._id)
                      )
                    }
                    className="text-indigo-600 italic font-semibold text-xs sm:text-sm cursor-pointer"
                  >
                    {" "}
                    Read less...
                  </span>
                )}
              </>
            )}
          </p>
        )}
        {review.rating !== -1 && (
          <Ratings rating={review.rating} text={``} />
        )}
      </div>
    </div>
  );
}
