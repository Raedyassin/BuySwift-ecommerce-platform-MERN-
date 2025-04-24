import { 
  FaRegStar,
  FaStar,
  FaStarHalfAlt
} from 'react-icons/fa'
export default function Ratings({ text, rating ,className}) {
  const fullStars = Math.floor(rating)<0 ? 0 : Math.floor(rating);
  const halfStar = (rating - fullStars) >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return (
    <div className={`flex items-center  ${className}`}>
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className="text-gray-500 mr-1" />
      ))}
      {halfStar === 1 && <FaStarHalfAlt className="text-gray-500 mr-1" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className="text-gray-400 mr-1" />
      ))}

      <span className="rating-text text-sm ml-1 text-gray-600 font-bold">
        {text}
      </span>
    </div>
  );
}
