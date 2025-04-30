import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import {
  addToFavorite,
  removeFromFavorite,
  setFavorite,
} from "../../redux/features/favorite/favoriteSlice"
import {
  addFavoriteToLocalStorage,
  removeFavoriteFromLocalStorage,
  getFavoritesFromLocalStorage
} from '../../utils/localstorage'
import { useEffect } from 'react';
export default function HeartIcon({ product, colorText, className }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((item) => item._id === product._id);
  useEffect(() => {
    dispatch(setFavorite(getFavoritesFromLocalStorage()));
  }, []);
  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorite(product._id));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      // dispatch(addToFavorite(product));
      dispatch(
        addToFavorite({
          originalPrice: product.originalPrice,
          discription: product.discription,
          name: product.name,
          _id: product._id,
          img: product.img,
        })
      );
      addFavoriteToLocalStorage({
        originalPrice: product.originalPrice,
        discription: product.discription,
        name: product.name,
        _id: product._id,
        img: product.img,
      });
    }
  };
  return (
    <div
      // right-2 top-2
      className={`absolute ${className}
    cursor-pointer bg-black/15 p-2  rounded-full`}
    >
      {isFavorite ? (
        <FaHeart
          size={20}
          className="text-pink-600 "
          onClick={toggleFavorite}
        />
      ) : (
        <FaRegHeart
          size={20}
          className={`${
            (colorText || "not-black") !== "black" ? "text-white" : "text-black"
          }  font-bold`}
          onClick={toggleFavorite}
        />
      )}
    </div>
  );
}

// HeartIcon.defaultProps = {
//   colorText: "not-black",
//   xPosition: "right-2",
//   yPosition: "top-2",
// };