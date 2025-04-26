import { useDispatch, useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorite/favoriteSlice";
import Product from "./Product";
import PageHeader from "../../components/PageHeader";
import DontHave from "../../components/DontHave";
import { motion } from "motion/react";
import { useEffect } from "react";
import { clearFavorite } from "../../redux/features/favorite/favoriteSlice";
import { clearFavoriteFromLocalStorage } from "../../utils/localstorage";
export default function Favorites() {
  const favoriteProducts = useSelector(selectFavoriteProduct);
  useEffect(() => {
    window.document.title = "Favorite Product";
    window.scrollTo(0, 0);
  }, []);
  const dispatch = useDispatch();
  const clearFavoriteProducts = () => {
    dispatch(clearFavorite());
    clearFavoriteFromLocalStorage();
  };

  return (
    <>
      <div className="px-4  md:px-15 lg:px-25 py-[2rem] ">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-between items-center"
        >
          <PageHeader>Favorite Products ({favoriteProducts.length})</PageHeader>
          <button
            onClick={clearFavoriteProducts}
            className="mt-4 sm:mt-0 text-white font-bold    py-2 px-4 sm:px-6 
                rounded-xl  bg-gradient-to-r from-red-600 to-pink-600 
                hover:from-red-700 hover:to-pink-700 transition-all duration-300 
                shadow-md cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 
                text-sm sm:text-base "
          >
            Clear
          </button>
        </motion.div>
        {favoriteProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <DontHave>You have no favorite products</DontHave>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
          2xl:grid-cols-6 gap-4 mt-6 mb-3"
        >
          {favoriteProducts.map((product, index) => (
            <Product index={index} key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </>
  );
}
