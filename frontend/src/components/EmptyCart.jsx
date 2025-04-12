import { motion } from "motion/react";
import { Link } from "react-router-dom";
export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-500  ">
        Your Cart is Empty
      </h2>
      <Link
        to="/shop"
        className="mt-4 inline-block text-sm sm:text-base md:text-lg text-purple-500 hover:text-purple-700 underline transition-colors duration-300"
      >
        Explore the Shop
      </Link>
    </motion.div>
  );
}
