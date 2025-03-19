import { useSelector } from "react-redux"
import {selectFavoriteProduct} from '../../redux/features/favorite/favoriteSlice'
import Product from "./Product";
import PageHeader from "../../components/PageHeader";
export default function Favorites() {
  const favoriteProducts = useSelector(selectFavoriteProduct);
  console.log("favoriteProducts", favoriteProducts);
  
  return (
    <div className="mx-[2rem] py-[2rem]">
      <div>
        <PageHeader>Favorite Products</PageHeader>
      </div>
      <div className="flex justify-center items-center md:flex-wrap md:flex-row flex-col gap-4 mt-6 mb-3">
        {favoriteProducts.map((product,index) => (
          <Product index={index} key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
