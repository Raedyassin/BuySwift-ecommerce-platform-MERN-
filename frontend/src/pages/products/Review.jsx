import Ratings from "./Ratings";

export default function Review({ review }) {
  return (
    <div
      key={review._id}
      className=" bg-gray-100 p-4 rounded-lg  sm:ml-[0rem] xl:w-[50rem] sm:w-[24rem] mb-5"
    >
      <div className="flex justify-between">
        <strong className="text-[#B0B0B0]">{review.name}</strong>
        <p className="text-[#B0B0B0]">{review.createdAt.substring(0, 10)}</p>
      </div>
      <p className="my-4">{review.comment}</p>
      <Ratings rating={review.rating} text={``} />
    </div>
  );
}
