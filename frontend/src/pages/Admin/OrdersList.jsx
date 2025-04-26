import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { motion } from "motion/react";
import {
  // useGetAllOrdersQuery,
  useGetAllOrdersByAdminQuery,
} from "../../redux/apis/orderApiSlice";
import PageLoader from "../../components/PageLoader";
import Message from "../../components/Message";
import Status from "../../components/Status";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import { CiFilter } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import Loader from "../../components/Loader";
import PageSlider from "../../components/PageSlider";
import AdminMenu from "./AdminMenu";
export default function OrdersList() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const [searchById, setSearchById] = useState("");
  const [filterSet, setFilterSet] = useState({
    status: "",
    createdAt: "",
    price: "",
    payment: "",
  });
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const navigate = useNavigate();
  const {
    data: orders,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllOrdersByAdminQuery({ page, limit: 50, ...filterSet });
  
  useEffect(() => {
    if (
      orders &&
      orders.ordersLength !== undefined &&
      orders.pageSize !== undefined
    ) {
      setPagesCount(Math.ceil(orders.ordersLength / orders.pageSize));
    }
  }, [orders]);

  const searchByIdhandler = () => {
    if (/^[0-9a-fA-F]{24}$/.test(searchById)) {
      navigate(`/order/${searchById}`);
    } else {
      toast.error("Invalid order id");
    }
  };
  const inputSearchHandler = (e) => {
    if (e.key === "Enter") searchByIdhandler();
  };


  const addPriceFilterHandler = () => {
    if (isNaN(startPrice) || isNaN(endPrice)) {
      return toast.error("Price must be a number");
    }
    if (!startPrice && !endPrice) {
      return toast.error("Please enter start and end or one of them price");
    }
    if (parseFloat(startPrice) < 0 || parseFloat(endPrice) < 0)
      return toast.error("Price must be greater than or equal 0");
    if (startPrice && endPrice) {
      if (parseFloat(startPrice) <= parseFloat(endPrice)) {
        setFilterSet({ ...filterSet, price: `${startPrice}-${endPrice}` });
      } else {
        return toast.error("Start price must be less than or equal end price");
      }
    } else if (startPrice && !endPrice) {
      setFilterSet({ ...filterSet, price: `${startPrice}-` });
    } else if (!startPrice && endPrice) {
      setFilterSet({ ...filterSet, price: `-${endPrice}` });
    }
  };

  const slectedUserHandler = (userId) => {
    if (selectedOrder === userId) return setSelectedOrder(null);
    setSelectedOrder(userId);
  };
      useEffect(() => {
        window.document.title = "Orders Table";
        window.scrollTo(0, 0);
      }, []);


  useEffect(() => {
    if (error && error?.status < 500) {
      toast.error(error?.data?.data?.title || error?.data?.message);
    }
  }, [error]);
  if (isLoading) return <PageLoader />;
  if (error && error.status >= 500) {
    return (
      <Message variant="danger">
        {error?.data?.message || error?.message || "Something went wrong"}
      </Message>
    );
  }

  if (isError && error?.data?.data?.title) {
    return (
      <Message variant="error">
        (error?.data?.data?.title || error?.message)
      </Message>
    );
  }
  console.log(orders);
  return (
    <div className={`mx-[3rem] pt-[2rem]  `}>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <PageHeader>Orders List ({orders?.ordersLength}) </PageHeader>
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
              defaultValue={""}
            >
              <option value="">All</option>
              <option value="createdAt">Date</option>
              <option value="status">Status</option>
              <option value="price">Price</option>
              <option value="payment">Payment</option>
            </select>
            {filterBy !== "" && <div className="h-5 w-[1px] bg-gray-300"></div>}
            {filterBy === "createdAt" && (
              <input
                onChange={(e) =>
                  setFilterSet({ ...filterSet, createdAt: e.target.value })
                }
                value={
                  filterSet.createdAt || new Date().toISOString().split("T")[0]
                }
                min={"2025-03-16"}
                type="date"
                className="w-[15rem] p-2 focus:outline-none placeholder:italic 
                rounded-xl "
              />
            )}
            {filterBy === "status" && (
              <select
                onChange={(e) =>
                  setFilterSet({ ...filterSet, status: e.target.value })
                }
                className="w-[8rem] p-2 focus:outline-none placeholder:italic rounded-xl "
                defaultValue={""}
              >
                {/* ["pending", "delivered", 'ontheroute',"packed", "cancelled"] */}
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="packed">Packed</option>
                <option value="ontheroute">On The Route</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
            {filterBy === "payment" && (
              <select
                onChange={(e) =>
                  setFilterSet({ ...filterSet, payment: e.target.value })
                }
                className="w-[8rem] p-2 focus:outline-none placeholder:italic rounded-xl "
                defaultValue={""}
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="notpaid">Not Paid</option>
              </select>
            )}
            {filterBy === "price" && (
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => setStartPrice(e.target.value)}
                  placeholder="from or equal"
                  value={startPrice}
                  type="number"
                  className=" w-[7rem] ml-2 p-2 focus:outline-none placeholder:italic 
                rounded-xl "
                />
                {/* <div className="h-5  text-gray-400">to</div> */}
                <input
                  placeholder="to"
                  onChange={(e) => setEndPrice(e.target.value)}
                  value={endPrice}
                  type="number"
                  className="w-[5rem] ml-2 p-2 focus:outline-none placeholder:italic 
                rounded-xl "
                />
                <div
                  className="p-2 w-10 rounded-full text-center bg-gray-50
                cursor-pointer text-gray-500   hover:bg-gray-100"
                  onClick={addPriceFilterHandler}
                >
                  go
                </div>
              </div>
            )}
          </div>
          <div
            className="border-2 mt-2 w-full justify-between lg:w-[20rem] 
          lg:order-2 order-1 border-gray-100 rounded-2xl p-2
          focus-within:border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={searchById}
              onChange={(e) => setSearchById(e.target.value)}
              onKeyDown={(e) => inputSearchHandler(e)}
              placeholder="Enter order id"
              className="p-1 lg:w-[15rem] w-full focus:outline-none placeholder:italic 
              rounded-xl "
            />
            {/* linke to order details */}
            <CiSearch
              onClick={searchByIdhandler}
              className=" text-gray-500 rounded-full p-1  w-9 h-9  cursor-pointer 
            hover:bg-[#FAFAFC] "
            />
          </div>
        </div>
        {(filterSet.price ||
          filterSet.createdAt ||
          filterSet.status ||
          filterSet.payment) && (
          <div className="flex gap-2 mb-3 mt-2 justify-start flex-wrap">
            {filterSet.price && (
              <div
                className=" bg-[#e7f1f7] 
                flex items-center rounded-full pl-4  pr-2 text-gray-500 italic"
              >
                Price: ${filterSet.price.split("-")[0]} - $
                {filterSet.price.split("-")[1]}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, price: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
            {filterSet.status && (
              <div
                className={` bg-[${
                  filterSet.status === "pending"
                    ? "#FCF6F0"
                    : filterSet.status === "packed"
                    ? "#f0f9fc"
                    : filterSet.status === "ontheroute"
                    ? "#ECF4FF"
                    : filterSet.status === "delivered"
                    ? "#EEFAF6"
                    : "#FDEAE9"
                }] 
                flex items-center rounded-full    pr-2 text-gray-500 italic`}
              >
                <Status border={false} status={filterSet.status} />
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, status: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
            {filterSet.payment && (
              <div
                className={` ${
                  filterSet.payment === "paid"
                    ? "text-green-300 font-bold italic   rounded-full px-3 py-0"
                    : "text-red-300 font-bold italic     rounded-full px-3 py-0"
                }
                flex items-center rounded-full pl-4 bg-[#e7f1f7]  pr-2 text-gray-500 italic`}
              >
                {filterSet.payment === "paid" ? "Paid" : "Not Paid"}{" "}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, payment: "" })}
                  className="cursor-pointer hover:text-red-600 text-gray-500"
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
          </div>
        )}
      </motion.div>
      <AdminMenu />

      {/* order table */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="  mb-[1rem] pb-5   w-full overflow-x-auto  rounded shadow-[0px_2px_10px_rgba(0,0,0,0.1)]"
      >
        <table className=" w-full ">
          <thead>
            <tr>
              <th className="p-4 pl-6 text-start bg-[#FAFAFC] "> ID</th>
              <th className="p-4 text-start bg-[#FAFAFC]"> Create At</th>
              <th className="p-4 text-start bg-[#FAFAFC]"> Cutomer</th>
              <th className="p-4 text-start bg-[#FAFAFC]"> Status</th>
              <th className="p-4 text-start bg-[#FAFAFC]"> $Price</th>
              <th className="p-4 text-start bg-[#FAFAFC]"> Payment</th>
            </tr>
          </thead>
          {error?.status < 500 && (
            <tbody className="text-gray-500">
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  {error?.data?.message || "Something went wrong"}
                </td>
              </tr>
            </tbody>
          )}
          {orders?.data?.orders?.length === 0 && (
            <tbody className="text-gray-500">
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No Orders Found
                </td>
              </tr>
            </tbody>
          )}
          {!isFetching && (
            <tbody className="text-gray-500">
              {!error &&
                orders?.data?.orders?.map((order) => (
                  <tr
                    key={order._id}
                    className={`${selectedOrder === order._id && "bg-sky-50"}`}
                  >
                    <td className="min-w-60 p-4 pl-6 flex items-center gap-2 ">
                      <input
                        type="checkbox"
                        checked={selectedOrder === order._id}
                        onChange={() => slectedUserHandler(order._id)}
                        className="cursor-pointer w-4 h-4"
                      />
                      <span
                        className=" cursor-pointer hover:text-indigo-500 hover:underline "
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        {order._id}
                      </span>
                    </td>
                    <td className="min-w-40 p-4">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="min-w-50 p-4">{order.user?.username}</td>
                    <td className="min-w-50 p-4">
                      <Status border={true} status={order.status} />
                    </td>
                    <td className="min-w-50 p-4">${order.totalPrice}</td>
                    <td className="min-w-40 min p-4">
                      {order.isPaid ? (
                        <span className="text-green-300 font-semibold italic border-1 border-green-300 rounded-full px-3 py-1">
                          Paid
                        </span>
                      ) : (
                        <span className="text-red-300 font-semibold italic border-1 border-red-300 rounded-full px-3 py-1">
                          Not Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
        {isFetching && (
          <div className=" flex justify-center items-center  w-full h-[20rem]  ">
            <Loader />
          </div>
        )}
      </motion.div>
      {!isFetching && pagesCount > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center  items-center gap-5"
        >
          <PageSlider setPage={setPage} page={page} pagesCount={pagesCount} />
        </motion.div>
      )}
      <div className=" h-15"></div>
    </div>
  );
}
