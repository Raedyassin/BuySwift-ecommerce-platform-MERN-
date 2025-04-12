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
export default function HeartIcon({ product, colorText, xPosition, yPosition }) {
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
          price: product.price,
          discription: product.discription,
          name: product.name,
          _id: product._id,
          img: product.img,
        })
      );
      addFavoriteToLocalStorage({
        price: product.price,
        discription: product.discription,
        name: product.name,
        _id: product._id,
        img: product.img,
      });
    }
  };
  return (
    <div className={`absolute ${xPosition || "right-2"} ${yPosition || "top-2"} cursor-pointer`}>
      {isFavorite ? (
        <FaHeart
          size={24}
          className="text-pink-600 "
          onClick={toggleFavorite}
        />
      ) : (
        <FaRegHeart
          size={24}
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