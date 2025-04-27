import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useGetAllProductsPageQuery } from "../../redux/apis/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import PageHeader from "../../components/PageHeader";
import AdminMenu from "./AdminMenu";
import PageLoader from "../../components/PageLoader";
import { useEffect, useRef, useState } from "react";

export default function AllProduct() {
  const [page, setPage] = useState(1);
  const {
    data: products,
    isLoading,
    isError,
    isFetching,
    error,
  } = useGetAllProductsPageQuery({ limit: 50, page });
  const navigate = useNavigate();
  const loaderRef = useRef(null);
  useEffect(() => {
    window.document.title = "All Product";
    window.scrollTo(0, 0);
  },[])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          !isError &&
          products?.hasNextPage
        ) {
          setPage(page + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isError, isFetching, products?.hasNextPage, page]);

  if (isLoading) return <PageLoader />;
  if (isError)
    return (
      <Message variant="error">
        {error?.data?.message || error?.message || "Something went wrong"}
      </Message>
    );

  return (
    <>
      <div className="w-[80%] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-4">
              <PageHeader>
                All Products ({products.data.products.length})
              </PageHeader>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.data.products.map((product) => (
                <Link
                  key={product._id}
                  to={`/admin/product/update/${product._id}`}
                  className="block bg-white rounded-xl p-4 shadow-lg 
                  hover:shadow-xl transition-all duration-300 border 
                  border-gray-100  w-full  hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 rounded-lg flex justify-center items-center">
                      <img
                        src={"/uploads/" + product.img.split("/").pop()}
                        alt={product.name}
                        className=" max-h-full max-w-full rounded-lg "
                      />
                    </div>
                    <div className="relative flex-1 flex flex-col h-full justify-between">
                      <span
                        className="absolute top-0 right-0 bg-gray-900/80 
                      text-white text-xs px-1.5 py-0.5 rounded-full"
                      >
                        {moment(product.createdAt).format("MMM YYYY DD")}
                      </span>
                      <div>
                        <h5 className="text-base font-bold text-gray-900 mb-1 
                          line-clamp-2">
                          {product.name}
                        </h5>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {product.discription}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div
                          onClick={() =>
                            navigate(`/admin/product/update/${product._id}`)
                          }
                          className="group inline-flex items-center px-2 py-1  text-white rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 text-xs"
                        >
                          Update
                          <svg
                            className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </div>
                        <p className="text-base font-semibold text-gray-900">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {isFetching && (
              <>
                <div>
                  <div
                    className="
                        bg-white rounded-xl p-4 mt-5 
                        h-30 flex items-center justify-center"
                  >
                    <Loader />
                  </div>
                </div>
              </>
            )}
            {/* load more Orders */}
            <div ref={loaderRef} className="h-10"></div>
          </div>
        </div>
        <AdminMenu />
      </div>
    </>
  );
}
