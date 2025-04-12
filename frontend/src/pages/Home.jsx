import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/apis/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
// import Product from "./products/Product";
import ProductCard from "./products/ProductCard";
import { useEffect } from "react";

export default function Home() {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword })
      useEffect(() => {
        window.document.title = "Cloud Dream store";
      }, []);

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <div className="">
          <div className="w-full flex mt-[3rem] justify-around items-center ">
            <h1 className="  text-[3rem]">
              {/* ml-[20rem] */}
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 
                px-10  "
              // mr-[18rem]
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center gap-2 flex-wrap mt-[2rem] mb-[2rem] ">
              {data.data.products.map((product) => (
                <div key={product._id}>
                  {/* <Product product={product} /> */}
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
