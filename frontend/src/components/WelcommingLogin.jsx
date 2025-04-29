import { PiRainbowCloudFill } from "react-icons/pi";

export default function WelcommingLogin() {
  return (
    <div
      className="h-full flex flex-col items-center justify-center p-12 
    text-center bg-gradient-to-br from-gray-200 to-cream-100 relative
    overflow-hidden rounded-l-2xl"
    >
      {/* Animated Wave */}
      <div className="flex items-center font-bold text-5xl text-indigo-500 gap-4 mb-6">
        <PiRainbowCloudFill size={100} />
        Cloud Dream Store
      </div>
      <p className="text-xl text-gray-700 max-w-md  ">
        Dive into{" "}
        <span className="font-semibold text-indigo-500">Cloud Dream Store</span>
        , where your dreams find a home. Discover unique treasures and start
        your adventure today!
      </p>
      <button
        className="mt-8 cursor-pointer px-6 py-2 
        bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
        text-white font-semibold rounded-lg  transition-colors duration-300"
      >
        Explore Now
      </button>
    </div>
  );
}
