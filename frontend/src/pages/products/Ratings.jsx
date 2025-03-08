import { 
  FaRegStar,
  FaStar,
  FaStarHalfAlt
} from 'react-icons/fa'
export default function Ratings({ text, rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = (rating - fullStars) >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  console.log(fullStars, halfStar, emptyStars)
  return (
    <div className="flex items-center w-[15rem]">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className="text-yellow-400 ml-1" />
      ))}
      {halfStar === 1 && <FaStarHalfAlt className="text-yellow-400 ml-1" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className="text-gray-400 ml-1" />
      ))}

      <span className="rating-text ml-2 text-gray-600 font-bold">{text}</span>
    </div>
  );
}
