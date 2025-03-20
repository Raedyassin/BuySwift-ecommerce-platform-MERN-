import { useSelector } from "react-redux"
import {selectFavoriteProduct} from '../../redux/features/favorite/favoriteSlice'
import Product from "./Product";
import PageHeader from "../../components/PageHeader";
import DontHave from "../../components/DontHave";
import { motion } from "motion/react";
export default function Favorites() {
  const favoriteProducts = useSelector(selectFavoriteProduct);
  
  return (
    <div className="mx-[2rem] py-[2rem]">
      <motion.div
        initial={{ opacity: 0,y:-100 }}
        animate={{ opacity: 1,y:0 }}
        transition={{ duration: 1 }}
      >
        <PageHeader>Favorite Products</PageHeader>
      </motion.div>
      {favoriteProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0,y:100 }}
          animate={{ opacity: 1,y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <DontHave>You have no favorite products</DontHave>
        </motion.div>
      )}
        <motion.div
          initial={{ opacity: 0,y:100 }}
          animate={{ opacity: 1,y:0 }}
          transition={{ duration: 1 }}
          className="flex w-full justify-start items-center md:flex-wrap  
          md:flex-row flex-col gap-4 mt-6 mb-3">
          {favoriteProducts.map((product, index) => (
            <Product index={index} key={product._id} product={product} />
          ))}
        </motion.div>
    </div>
  );
}
