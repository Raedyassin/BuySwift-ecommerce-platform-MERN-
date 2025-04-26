import { RiProgress8Line, RiProgress8Fill } from "react-icons/ri";

export default function ProgressSteps({ step1, step2, step3 }) {
  return (
    <div className="flex justify-between items-center w-full max-w-lg mx-auto">
      {/* Step 1 */}
      <div
        className={`flex items-center space-x-2 ${
          step1 ? "text-green-500" : "text-gray-300"
        }`}
      >
        <RiProgress8Fill
          className={`w-8 h-8 ${step1 ? "text-green-500" : "text-gray-300"}`}
        />
        <span className="mr-2 italic text-xl">Cart</span>
      </div>

      {/* Step 2 */}
      {step2 && (
        <>
          <div
            className={`flex-1 h-[3px] ${
              step1 ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`flex items-center space-x-2 ${
              step2 ? "text-green-500" : "text-gray-300"
            }`}
          >
            <RiProgress8Fill
              className={`w-8 h-8 ${
                step2 ? "text-green-500" : "text-gray-300"
              }`}
            />
            <span className="mr-2 text-xl italic">Shipping</span>
          </div>
        </>
      )}

      {/* Line between Shipping and Summary (conditional gray or green) */}
      {step2 && (
        <div
          className={`flex-1 h-[3px] ${step3 ? "bg-green-500" : "bg-gray-300"}`}
        ></div>
      )}

      {/* Step 3 (Summary) */}
      <div
        className={`flex items-center space-x-2 ${
          step3 ? "text-green-500" : "text-gray-300"
        }`}
      >
        <RiProgress8Fill
          className={`w-8 h-8 ${step3 ? "text-green-500" : "text-gray-300"}`}
        />
        <span className="mr-2 text-xl italic">Comfirmation</span>
      </div>
    </div>
  );
}
