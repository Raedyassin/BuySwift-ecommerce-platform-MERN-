import { PiRainbowCloudFill } from "react-icons/pi";
import { Link } from "react-router-dom";

export default function WelcommingLogin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-gray-900 relative overflow-hidden lg:bg-gradient-to-r from-white to-gray-300 backdrop-blur-sm">
      {/* Particle Background */}
      <div className="flex text-5xl font-bold items-center gap-4 text-indigo-800 mb-6 animate-fade-in-scale">
        <PiRainbowCloudFill size={100} />
        Cloud Dream Store
      </div>
      <p className="text-2xl text-gray-700 font-semibold max-w-md leading-relaxed animate-fade-in-delay">
        Welcome to{" "}
        <span className="font-semibold text-indigo-700">Cloud Dream Store</span>
        . Unleash your imagination with our curated collection of unique finds.
        Sign up to begin your journey!
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-2  text-white font-semibold 
          rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
          hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer transition-all duration-300 
        "
      >
        Start Exploring
      </Link>
    </div>
  );
}
