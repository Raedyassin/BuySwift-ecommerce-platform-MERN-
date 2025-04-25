import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  useGetAllProductsTableQuery,
  useDeleteProductMutation,
} from "../../redux/apis/productApiSlice";
import { motion } from "motion/react";
// import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";
import PageLoader from "../../components/PageLoader";
import PageHeader from "../../components/PageHeader";
import PageSlider from "../../components/PageSlider";
import { FaDeleteLeft } from "react-icons/fa6";
import { CiFilter, CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllCategoryQuery } from "../../redux/apis/categoryApiSlice";
import Message from "../../components/Message";
export default function UserList() {
  const navigate = useNavigate();
  const [loadCategory, setLoadCategory] = useState(true);
  const [searchBy, setSearchBy] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [finalFilterBy, setFinalFilterBy] = useState({
    id: "",
    name: "",
    price: "",
    brand: "",
    quantity: "",
  });

  const [filterSet, setFilterSet] = useState({
    createdAt: "",
    category: "",
    categoryName: "",
    rating: "",
  });

  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const {
    data: products,
    isFetching,
    error,
    isLoading,
  } = useGetAllProductsTableQuery({
    page,
    limit: 50,
    ...filterSet,
    ...finalFilterBy,
  });

  const { data: categories, isLoading: isLoadingCategory } =
    useGetAllCategoryQuery({ skip: loadCategory });

  useEffect(() => {
    if (
      products &&
      products.productsLength !== undefined &&
      products.pageSize !== undefined
    ) {
      setPagesCount(Math.ceil(products.productsLength / products.pageSize));
    }
  }, [products]);
  const slectedUserHandler = (userId) => {
    if (selectedProduct === userId) return setSelectedProduct(null);
    setSelectedProduct(userId);
  };
    const inputSearchHandler = (e) => {
      if (e.key === "Enter") searchByHandler();
    };


  const searchByHandler = () => {
    if (!searchValue) return toast.error("Search value is required");
    setFilterSet({
      createdAt: "",
      category: "",
      rating: "",
    });
    if (searchBy === "id") setFinalFilterBy({ id: searchValue });
    else if (searchBy === "name") setFinalFilterBy({ name: searchValue });
    else if (searchBy === "brand") setFinalFilterBy({ brand: searchValue });
    else if (searchBy === "price") setFinalFilterBy({ price: searchValue });
    else if (searchBy === "quantity")
      setFinalFilterBy({ quantity: searchValue });
    // setSearchValue("");
  };
  useEffect(() => {
    window.document.title = "Product Table";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (filterBy === "all") {
      setFilterSet({
        createdAt: "",
        category: "",
        rating: "",
      });
      setFinalFilterBy({
        id: "",
        name: "",
        price: "",
        brand: "",
        quantity: "",
      });
      return;
    }
  }, [filterBy]);

  const [deleteProduct] = useDeleteProductMutation();
  const handleDelete = (e, id) => {
    e.preventDefault();
    try {
      deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (error && error?.status < 500) {
      toast.error(error?.data?.data?.title || error?.data?.message);
    }
  }, [error]);
  if (isLoading) return <PageLoader />;
  if (error && error?.status >= 500) {
    return (
      <Message variant="error">
        {error?.data?.data?.title || error?.data?.message}
      </Message>
    );
  }

  return (
    <div className="mx-[2rem] pt-[2rem]">
      <AdminMenu />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <PageHeader>Products List ({products?.productsLength})</PageHeader>
      </motion.div>
      {/* filter */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center mt-6 mb-3  flex-wrap justify-between">
          <div
            className="flex items-center mt-2 order-2 lg:order-1 border-2 border-gray-100 rounded-2xl 
                  p-1 focus-within:border-gray-200"
          >
            <CiFilter className=" text-gray-500 w-7 h-7  " />
            <select
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-[8rem] mr-3 p-2 focus:outline-none placeholder:italic rounded-xl "
              defaultValue={"all"}
            >
              <option value="all">All</option>
              <option value="createdAt">Date</option>
              <option value="category" onClick={() => setLoadCategory(false)}>
                Category
              </option>
              <option value="rating">Rating</option>
            </select>
            {filterBy !== "all" && filterBy !== "" && (
              <div className="h-5 w-[1px] bg-gray-300"></div>
            )}
            {filterBy === "createdAt" && (
              <input
                onChange={(e) =>
                  setFilterSet({ ...filterSet, createdAt: e.target.value })
                }
                value={
                  filterSet.createdAt || new Date().toISOString().split("T")[0]
                }
                min={"2025-02-05"}
                type="date"
                className="w-[15rem] p-2 focus:outline-none placeholder:italic 
                      rounded-xl "
              />
            )}
            {filterBy === "rating" && (
              <select
                onChange={(e) => {
                  setFilterSet({
                    ...filterSet,
                    rating: e.target.selectedOptions[0].dataset.rating,
                  });
                }}
                className="w-[8rem] p-2 focus:outline-none placeholder:italic rounded-xl "
                defaultValue={""}
              >
                <option value="">All</option>
                <option data-rating="4.5 & above" value="4.5">
                  4.5 & above
                </option>
                <option data-rating="4 & above" value="4">
                  4 & above
                </option>
                <option data-rating="3.5 & above" value="3.5">
                  3.5 & above
                </option>
                <option data-rating="3 & above" value="3">
                  3 & above
                </option>
                <option data-rating="2.5 & above" value="2.5">
                  2.5 & above
                </option>
                <option data-rating="2 & above" value="2.5">
                  2 & above
                </option>
                <option data-rating="1.5 & above" value="1.5">
                  1.5 & above
                </option>
                <option data-rating="1 & above" value="1">
                  1 & above
                </option>
                <option data-rating="0 & above" value="0">
                  0 & above
                </option>
              </select>
            )}
            {filterBy === "category" && (
              <select
                onChange={(e) => {
                  setFilterSet({
                    ...filterSet,
                    category: e.target.value,
                    categoryName: e.target.selectedOptions[0].dataset.name,
                  });
                }}
                className="w-[8rem] p-2 focus:outline-none placeholder:italic rounded-xl "
                defaultValue={""}
              >
                {/* ["pending", "delivered", 'ontheroute',"packed", "cancelled"] */}
                <option value="">All</option>
                {isLoadingCategory ? (
                  <option
                    value={"loading"}
                    className="flex justify-center items-center h-60"
                  >
                    <Loader />
                  </option>
                ) : (
                  categories?.data?.categories?.map((category) => (
                    <option
                      data-name={category.name}
                      value={category._id}
                      key={category._id}
                    >
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
          {/*  */}

          <div
            className="border-2 mt-2 w-full justify-around lg:w-[30rem] lg:order-2 
          order-1 border-gray-100 rounded-2xl p-1 focus-within:border-gray-200 flex
          items-center gap-2"
          >
            <select
              className="w-[8rem] p-2 focus:outline-none placeholder:italic rounded-xl "
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="id"> Id</option>
              <option value="name"> Name</option>
              <option value="price"> Price</option>
              <option value="brand"> Brand</option>
              <option value="quantity"> Quantity</option>
            </select>
            <div className="h-5 w-[1px] bg-gray-300"></div>

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => inputSearchHandler(e)}
              placeholder={
                searchBy === "id"
                  ? "Enter user id"
                  : searchBy === "name"
                  ? "Enter user name"
                  : searchBy === "price"
                  ? "From $1 - To $100"
                  : searchBy === "brand"
                  ? "Enter product brand"
                  : "From 1 piece - To 100 piece"
              }
              className="p-1 lg:w-[15rem] w-full focus:outline-none placeholder:italic 
                rounded-xl "
            />
            {/* linke to order details */}
            <CiSearch
              onClick={searchByHandler}
              className=" text-gray-500 rounded-full p-1  w-9 h-9  cursor-pointer 
                hover:bg-[#FAFAFC] "
            />
          </div>
        </div>
        {(filterSet.createdAt || filterSet.category || filterSet.rating) && (
          <div className="flex gap-2 mb-3 mt-2 justify-start flex-wrap">
            {filterSet.rating && (
              <div
                className=" bg-[#e7f1f7] 
                      flex items-center rounded-full pl-4  pr-2 text-gray-500 italic"
              >
                Rating: {filterSet.rating}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, rating: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
            {filterSet.createdAt && (
              <div
                className=" bg-[#e7f1f7] 
                      flex items-center rounded-full pl-4  pr-2 text-gray-500 italic"
              >
                Create At: {filterSet.createdAt}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, createdAt: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
            {filterSet.category && (
              <div
                className=" bg-[#e7f1f7] 
                      flex items-center rounded-full pl-4  pr-2 text-gray-500 italic"
              >
                Category: {filterSet.categoryName}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, category: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="mb-[1rem] pb-5 mt-[1rem]  w-full overflow-x-auto  rounded shadow-[0px_2px_10px_rgba(0,0,0,0.1)]">
          <table className="w-full  ">
            <thead>
              <tr>
                <th className="p-4 pl-6 text-start bg-[#FAFAFC] ">ID</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Created At</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Name</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Price</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Rating</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Brand</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Category</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Quantity</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Actions</th>
              </tr>
            </thead>
            {error?.status < 500 && (
              <tbody className="text-gray-500">
                <tr>
                  <td colSpan={9} className="p-4 text-center">
                    {error?.data?.message || "Something went wrong"}
                  </td>
                </tr>
              </tbody>
            )}
            {products?.data?.products?.length === 0 && (
              <tbody className="text-gray-500">
                <tr>
                  <td colSpan={9} className="p-4 text-center">
                    No Products Found
                  </td>
                </tr>
              </tbody>
            )}
            {!isFetching && (
              <tbody className="text-gray-500">
                {products?.data?.products?.map((product) => (
                  <tr
                    key={product._id}
                    className={`${
                      selectedProduct === product._id && "bg-sky-50"
                    }`}
                  >
                    <td
                      className={`flex items-center gap-2 justify-start  
                          p-4 pl-6 min-w-40 `}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProduct === product._id}
                        onChange={() => slectedUserHandler(product._id)}
                        className="cursor-pointer w-4 h-4"
                      />
                      <Link
                        to={`/product/${product._id}`}
                        className="py-2 cursor-pointer  hover:text-indigo-600 hover:underline"
                      >
                        {product._id}
                      </Link>
                    </td>
                    <td className=" p-4   min-w-35 ">
                      {product.createdAt?.substring(0, 10)}
                    </td>
                    <td className=" flex items-center p-4 min-w-60 ">
                      <img
                        src={"/uploads/" + product.img.split("/").pop()}
                        alt={product.name}
                        className="h-10 w-10 mr-3 block object-cover rounded-full"
                      />
                      <p>
                        {product.name.length > 20
                          ? product.name.substring(0, 20) + "..."
                          : product.name}
                      </p>
                    </td>
                    <td className=" p-4 min-w-30 ">
                      {product.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td className=" p-4 min-w-30 ">
                      {product.rating.toFixed(2)}
                    </td>
                    <td className=" p-2 min-w-30 ">
                      {product.brand?.toUpperCase()}
                    </td>
                    <td className=" p-2 min-w-35 ">
                      {product?.category?.name}
                    </td>
                    <td className=" p-2 min-w-30 ">
                      {product?.quantity} Piece
                    </td>
                    <td className="flex min-w-30 justify-center p-4 items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/product/update/${product._id}`)
                          }
                          className="ml-2 cursor-pointer hover:bg-gray-100 bg-[#FAFAFC] text-blue-500 py-2 px-4 rounded-lg"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, product._id)}
                          className="bg-[#FAFAFC] hover:bg-gray-100 text-red-500 font-bold
                              p-2 rounded cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {isFetching && (
            <div className="flex justify-center h-[20rem] items-center gap-5">
              <Loader />
            </div>
          )}
        </div>
        {!isFetching && pagesCount > 1 && (
          <div className="flex justify-center  items-center gap-5">
            <PageSlider setPage={setPage} page={page} pagesCount={pagesCount} />
          </div>
        )}
        <div className=" h-15"></div>
      </motion.div>
    </div>
  );
}
