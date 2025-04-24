import { PiRainbowCloudFill } from "react-icons/pi";
import { motion } from "framer-motion"; // Corrected import
import { PiArrowArcRightBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function HomeWelcome() {
  const navigate = useNavigate();
  const ecommerceNameWords = "Welcome to\nCloud Dream\n Store"
    .split("\n")
    .map((line) => line.trim().split(" "));
  const ecommerceDescriptionWords =
    `Your ultimate destination for premium products.\nExplore quality, style, and exclusive deals.`
      .split("\n")
      .map((line) => line.trim().split(" "));
  const textDescriptionVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.2, ease: "easeOut" },
    }),
  };
  const ecommerceNameVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.3 ,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div
      className="bg-gray-900 min-h-[calc(100vh-64px)] 
        lg:min-h-screen text-gray-300 flex flex-col items-center 
        px-4  sm:px-6 md:px-10 lg:pt-15 lg:px-30"
    >
      {/* Top */}
      <div className="flex flex-col lg:flex-row items-center justify-between md:justify-around w-full">
        <div className="w-full lg:w-2/4 text-center lg:text-left">
          {ecommerceNameWords.map((line, lineIndex) => (
            <div key={lineIndex} className={lineIndex > 0 ? "mt-2" : ""}>
              {line.map((word, wordIndex) => (
                <motion.span
                  key={`${lineIndex}-${wordIndex}`}
                  variants={ecommerceNameVariants}
                  initial="hidden"
                  animate="visible"
                  custom={lineIndex * line.length + wordIndex}
                  className={`text-5xl sm:text-6xl lg:text-8xl inline-block mr-2 ${
                    lineIndex === 1 ? "text-indigo-500 animate-pulse" : ""
                  }  italic font-bold`}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          ))}
        </div>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="order-first lg:order-last mt-4 lg:mt-0 lg:mr-10 "
        >
          <PiRainbowCloudFill
            className="text-[10rem] sm:text-[15rem] 
          animate-pulse lg:text-[20rem] text-indigo-500"
          />
        </motion.div>
      </div>
      {/* Bottom */}
      <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col lg:flex-row items-center justify-between md:justify-around w-full">
        <div className="border-2 w-full max-w-md md:max-w-lg m-3 sm:m-4 p-3 sm:p-4 rounded-2xl border-gray-400 border-s-indigo-600 border-e-indigo-600">
          <div className="text-base sm:text-lg lg:text-xl text-center whitespace-pre-wrap break-words">
            {ecommerceDescriptionWords.map((line, lineIndex) => (
              <div key={lineIndex} className={lineIndex > 0 ? "mt-2" : ""}>
                {line.map((word, wordIndex) => (
                  <motion.span
                    key={`${lineIndex}-${wordIndex}`}
                    variants={textDescriptionVariants}
                    initial="hidden"
                    animate="visible"
                    custom={lineIndex * line.length + wordIndex}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-lg sm:text-xl mb-5 lg:text-2xl text-center mt-4 sm:mt-5 
          lg:mt-0 flex items-center md:mr-30 gap-2"
        >
          <PiArrowArcRightBold className="text-xl mb-10 sm:text-2xl lg:text-3xl" />
          <button
            onClick={() => navigate("/shop")}
            className="cursor-pointer p-3  sm:p-4 rounded-full hover:bg-gray-800/70 
            bg-gray-800/40 transition-all duration-300"
          >
            Shop now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
