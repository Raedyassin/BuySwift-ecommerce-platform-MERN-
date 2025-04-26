import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

export default function QuantitySelector({ className ,increase, decrease, quantityBuyed, maxQuantity }) {
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={quantityBuyed === 1}
        onClick={decrease}
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded font-bold flex items-center justify-center
                        cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white 
                        text-sm sm:text-base  transition-all duration-300 
                        disabled:bg-gray-400 disabled:cursor-not-allowed
                        ${className} shadow-md`}
      >
        <FaMinus size={10} />
      </button>
      <div
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center
                  bg-indigo-50/40 ${className}`}
      >
        <p className="text-sm sm:text-base font-semibold">{quantityBuyed}</p>
      </div>
      <button
        onClick={increase}
        disabled={quantityBuyed === maxQuantity}
        className={`w-4 h-4 sm:w-5 sm:h-5 rounded font-bold flex items-center justify-center
                  cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white 
                  text-sm sm:text-base  transition-all duration-300
                  disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md
                  ${className}`}
      >
        <FaPlus size={10} />
      </button>
    </div>
  );
}
