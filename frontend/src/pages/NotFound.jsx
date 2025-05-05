import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const logo = "Dream Store".split("");
  const text = "404 Page Not Found".split("");
  const subText = "Oops! The page you're looking for doesn't exist in Dream Store.".split("");

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
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 
    flex  justify-center  px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6 max-w-lg lg:min-w-200 "
      >
        <motion.div
          initial={{y: -100,  opacity: 0 }}
          animate={{y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="flex  justify-center items-center text-4xl 
          lg:text-6xl font-bold text-gray-900"
        >
          <div className="md:pb-10 text-4xl lg:text-6xl pb-5 ">
            <svg
              stroke="currentColor"
              fill="#432DD7"
              strokeWidth="0"
              viewBox="0 0 256 256"
              className="text-3xl sm:text-4xl md:text-5xl font-bold group-hover:text-indigo-700"
              height="3em"
              width="3em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M248,160a48.05,48.05,0,0,1-48,48H152c-17.65,0-32-14.75-32-32.89s14.35-32.89,32-32.89a31,31,0,0,1,3.34.18A48,48,0,0,1,248,160ZM112,72a87.57,87.57,0,0,1,61.35,24.91A8,8,0,0,0,184.5,85.44,104,104,0,0,0,8,160v16a8,8,0,0,0,16,0V160A88.1,88.1,0,0,1,112,72Zm0,32a55.58,55.58,0,0,1,33.13,10.84A8,8,0,1,0,154.6,102,72,72,0,0,0,40,160v16a8,8,0,0,0,16,0V160A56.06,56.06,0,0,1,112,104Zm15.21,26.71a8,8,0,0,0-5.94-9.63A40,40,0,0,0,72,160v16a8,8,0,0,0,16,0V160a24,24,0,0,1,29.57-23.35A8,8,0,0,0,127.21,130.71Z"></path>
            </svg>
          </div>
          <div className="text-indigo-700 italic">{logo}</div>
        </motion.div>

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
            <FaArrowLeft
              size={18}
              className=" animate-ping group-hover:animate-pulse"
            />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
