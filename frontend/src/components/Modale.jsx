import { motion, AnimatePresence } from "motion/react";


export default function Modale({isOpen,isClose,children}) {
  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5  }}
          className="fixed flex inset-0 items-center justify-center  z-50">
          <div className="fixed inset-0 bg-gray-900 opacity-15"></div>
          <div
            className="absolute top-[30%] right-[25%] bg-white
            p-4 rounded-lg z-10 w-[50%] "
          >
            <button
              className="text-black font-semibold 
              focus:outline-none absolute right-[-25px] top-[-10px] mr-2 
              border-gray-500 border-solid border-2 cursor-pointer w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-500 hover:text-white "
              onClick={isClose}
            >
              <div className="flex items-center justify-center">X</div>
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

