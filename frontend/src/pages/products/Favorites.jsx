import { useSelector } from "react-redux"
import {selectFavoriteProduct} from '../../redux/features/favorite/favoriteSlice'
import Product from "./Product";
export default function Favorites() {
  const favoriteProducts = useSelector(selectFavoriteProduct);
  return (
    <div
      className="ml-[3rem]"
    >
      <h1 className="text-lg font-bold ml-[3rem] pt-[3rem]">
        FAVORITE PRODUCTS
      </h1>
      <div className="flex flex-wrap">
        {
          favoriteProducts.map((product) => ( 
            <Product key={product._id} product={product} />
          ))
        }
      </div>
    </div>
  )
}
