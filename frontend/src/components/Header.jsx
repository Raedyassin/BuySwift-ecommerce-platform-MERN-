import ProductCarousel from "../pages/products/ProductCarousel"
import SamallProduct from "../pages/products/SamallProduct"
// import ProductCard from "../pages/products/ProductCard"
import { useGetTopProductsQuery } from "../redux/apis/productApiSlice"
import Loader from "./Loader"
export default function Header() {
  const { data, isLoading, error } = useGetTopProductsQuery()
  if (isLoading) {
    return <Loader/>
  }
  if (error) {
    return <h1>ERROR </h1>
  }

  return (
    <>
      <div className="flex justify-between gap-5">
        <div className="xl:block">
          {/* lg:hidden md:hidden sm:hidden */}
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
            {data.data.products.slice(0, 4).map((product) => (
              <div key={product._id}>
                <SamallProduct product={product} />
                {/* <ProductCard product={product} /> */}
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel className="mr-2" />
      </div>
    </>
  );
}
