
export default function PriceDiscont({ price, discount, className, text }) {
  console.log(text);
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {+discount !== 0 ? (
        <p
          className={`text-indigo-700  ${
            text !== "" ? text : "font-semibold text-sm sm:text-base"
          } `}
        >
          ${(price * (1 - discount / 100)).toFixed(2)}
        </p>
      ) : (
        <p
          className={`text-indigo-700  ${
            text !== "" ? text : "font-semibold text-sm sm:text-base"
          }`}
        >
          ${price.toFixed(2)}
        </p>
      )}
      {+discount !== 0 && (
        <p
          className={`text-gray-400 italic line-through ${
            text !== "" ? text : "font-semibold text-sm sm:text-base"
          }`}
        >
          ${price.toFixed(2)}
        </p>
      )}
    </div>
  );
}
