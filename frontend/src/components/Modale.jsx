import { motion, AnimatePresence } from "motion/react";
import { LiaTimesSolid } from "react-icons/lia";


export default function Modale({isOpen,isClose,children}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed flex inset-0 items-center justify-center  z-50"
        >
          <div
            onClick={isClose}
            className="fixed inset-0 bg-gray-200/50"
          ></div>
          <div
            className="absolute top-[30%] right-[25%] bg-white
            p-4 rounded-lg z-10 w-[50%] "
          >
            <button
              className="text-gray-500 font-semibold 
              focus:outline-none absolute right-[-25px] top-[-10px] mr-2 
              border-gray-200/50 border-solid border-2 cursor-pointer w-10 h-10 
              rounded-full bg-white hover:bg-gray-100 "
              onClick={isClose}
            >
              <div className="flex items-center p-2 justify-center">
                <LiaTimesSolid />
              </div>
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

