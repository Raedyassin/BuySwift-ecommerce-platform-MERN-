import { Link} from "react-router-dom";
import ProductCard from "./products/ProductCard";
import { useEffect } from "react";
import { useGetAllProductsPageQuery } from "../redux/apis/productApiSlice";
import Footer from "../components/Footer";

export default function Home() {
  useEffect(() => {
    window.document.title = "Cloud Dream store";
  }, []);

  const { data } = useGetAllProductsPageQuery({
  });

  return (
    <>
      <div className="px-4 md:px-20 lg:px-30">
        <div className="w-full flex mt-[3rem] justify-between items-center ">
          <h1 className="  text-[3rem]">Special Products</h1>

          <Link
            to="/shop"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full py-2 
                px-10  "
          >
            Shop
          </Link>
        </div>

        <div>
          <div
            className="grid z-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2  mt-[2rem] 
          mb-[2rem] "
          >
            {data?.data?.products?.map((product) => (
              <div key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
        <div className="mt-20">
          <Footer />
        </div>
    </>
  );
}
