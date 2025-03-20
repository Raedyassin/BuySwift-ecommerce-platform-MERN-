import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/apis/productApiSlice";
import { useGetAllCategoryQuery } from "../redux/apis/categoryApiSlice";
// import Loader from "../components/Loader";
import {
  setChecked,
  setRadio,
  setCategories,
  setProduct,
} from "../redux/features/shop/shopSlice";
import { toast } from "react-toastify";
import ProductCard from "./products/ProductCard";
import PageLoader from "../components/PageLoader";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
export default function Shope() {
  const dispatch = useDispatch();
  const {  product, checked, radio } = useSelector(
    (state) => state.shop
  );

  const { data: categoriesData, isLoading: isLoadingCategory } =
    useGetAllCategoryQuery();
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [newInputRadio, setNewInputRadio] = useState("");
  const filterProducts = useGetFilteredProductsQuery({
    checked,
    // startPrice, endPrice => price range
    radio
  });
  
  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategories(categoriesData.data.categories));
    }
  }, [categoriesData, dispatch]);

  useEffect(() => {
    if (!filterProducts.isLoading) {
      dispatch(setProduct(filterProducts.data.data.products));
    }
  }, [filterProducts.isLoading, filterProducts.data, dispatch]);

  const selectedCategoryHandler = (category) => {
    setNewInputRadio("");
    if (checked.includes(category)) {
      return dispatch(
        setChecked(checked.filter((c) => c._id !== category._id))
      );
    }
    dispatch(setChecked([...checked, category]));
  };

  // i don't fethc brands fom backend so i fetch them from product
  // that is fetched from frontend
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filterProducts?.data?.data?.products
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const selectedBrandHandler = (brand, e) => {
    const productsByBrand = filterProducts.data?.data?.products?.filter(
      (product) => product.brand === brand
    );
    

    setNewInputRadio(e);
    dispatch(setProduct(productsByBrand));
  };
  const priceFilterHandler = (e) => {
    e.preventDefault();
    setStartPrice(Number(startPrice));
    setEndPrice(Number(endPrice));
    if (isNaN(startPrice) && isNaN(endPrice)) {
      toast.error("Price must be a number");
      return;
    }
    if (startPrice > endPrice) {
      toast.error("Start price must be less than end price");
      return;
    }
    if (startPrice < 0 || endPrice < 0) {
      toast.error("Price must be greater than or equal 0");
      return;
    }

    dispatch(setRadio([startPrice, endPrice]));
  };

  if (isLoadingCategory || filterProducts.isLoading) return <PageLoader height="h-screen" />;

  return (
    <div className="constainer mx-[2rem]">
      <h2 className="mb-3 pt-[2rem]  ">
        <PageHeader>Shopping</PageHeader>
      </h2>

      <div className="flex md:flext-row ">
        {/* filter */}
        <div>
          <div className="bg-[#151515] w-[16rem] rounded-lg my-5 p-3 ml-[1rem]">
            <h2 className="h4 text-center text-gray-100 py-2 bg-black rounded-full mt-1 mb-2">
              Filter By Category
            </h2>
            <div className="p-5 w-[15rem]">
              {categoriesData.data.categories.map((category) => (
                <div key={category._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={category._id}
                      onChange={() => selectedCategoryHandler(category)}
                      className="w-4 h-4 accent-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={category._id}
                      className="text-gray-100 ml-2"
                    >
                      {category.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h4 text-center text-gray-100 py-2 bg-black rounded-full mb-2">
              Filter by brands
            </h2>
            <div className="p-5">
              {uniqueBrands
                .map((brand, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex items-center mr-4">
                      <input
                        type="radio"
                        id={index}
                        value={index}
                        checked={+newInputRadio?.target?.value === index}
                        onChange={(e) => selectedBrandHandler(brand, e)}
                        className="w-4 h-4 accent-pink-400 bg-gray-100  focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={index} className="text-gray-100 ml-2">
                        {brand}
                      </label>
                    </div>
                  </div>
                ))
                .slice(0, 5)}
            </div>
            <h2 className="h4 text-center text-gray-100 py-2 bg-black rounded-full mb-2">
              Filter by price
            </h2>
            <div className="text-white space-y-3 p-5 ">
              <div className="flex items-center">
                <label htmlFor="start" className="font-simibold w-[3rem] ">
                  Start:
                </label>
                <input
                  type="number"
                  id="start"
                  className="w-3/4 appearance-none rounded text-white focus:border-pink-600 border-white border-1 p-1"
                  onChange={(e) => setStartPrice(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <label className="font-simibold w-[3rem]" htmlFor="end">
                  End:
                </label>
                <input
                  type="number"
                  id="end"
                  className="w-3/4 rounded text-white border-white focus:border-pink-600 border-1 p-1"
                  onChange={(e) => setEndPrice(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="w-1/3 bg-pink-600 py-1   cursor-pointer rounded-2xl"
                  onClick={priceFilterHandler}
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4 rounded  py-1 cursor-pointer text-white"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex flex-wrap ml-[1rem]">
            {
              //   product.length === 0 ? (
              //   <Loader />
              // ) : (
              product?.map((prod) => (
                <div className="p-3" key={prod._id}>
                  <ProductCard product={prod} />
                </div>
              ))
              // )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
