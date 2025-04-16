import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const text = "Page Not Found".split("");
  const subText = "Oops! The page you're looking for doesn't exist.".split("");

  // Animation variants for letter-by-letter effect
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        ease: "easeOut",
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 1.2,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#4e46e58a",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6 max-w-lg"
      >
        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
          {text.map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        <div className="text-lg sm:text-xl lg:text-2xl text-gray-600">
          {subText.map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              custom={index + text.length}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>

        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="rounded-full"
        >
          <Link
            to="/"
            className="inline-flex items-center group gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaArrowLeft size={18} className=" animate-ping group-hover:animate-pulse" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
