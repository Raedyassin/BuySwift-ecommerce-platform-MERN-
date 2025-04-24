
export default function PriceDiscont({ price, originalPrice, discount, className, text }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {+discount !== 0 ? (
        <p
          className={`text-indigo-700 font-bold ${
            text !== "" ? text : "font-semibold text-sm sm:text-base"
          } `}
        >
          ${price.toFixed(2)}
        </p>
      ) : (
        <p
          className={`text-indigo-700 font-bold ${
            text !== "" ? text : "font-semibold text-sm sm:text-base"
          }`}
        >
          ${(originalPrice||price).toFixed(2)}
        </p>
      )}
      {+discount !== 0 && (
        <p
          className={`text-gray-400 italic line-through ${
            text !== "" ? text : "font-semibold text-sm sm:text-base"
          }`}
        >
          ${(originalPrice || price).toFixed(2)}
        </p>
      )}
    </div>
  );
}
