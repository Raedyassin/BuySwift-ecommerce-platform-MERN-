import { useEffect, useRef, useState } from "react";
import { useGetUserOrdersQuery } from "../../redux/apis/orderApiSlice";
import Message from "../../components/Message";
import { useNavigate } from "react-router-dom";
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { FaOrcid } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { FaSitemap } from "react-icons/fa";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import ShippingAdress from "../../components/ShippingAdress";
import OrderProgress from "../../components/OrderProgress";
import { motion } from "motion/react";
import Loader from "../../components/Loader";
import PageLoader from "../../components/PageLoader";
import OrderDetails from "../../components/OrderDetails";
import { Link } from "react-router-dom";
export default function Orders() {
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(0);
  const [showOrderItems, setShowOrderItems] = useState(true);
  const showMoreOrdersObserver = useRef();
  const navigate = useNavigate();
  const [openOrders, setOpenOrders] = useState(false);
  const { data, isLoading, isFetching, isError, error } = useGetUserOrdersQuery(
    {
      page,
      limit: 10,
    }
  );

  useEffect(() => {
    window.document.title = "Orders";
        window.scrollTo(0, 0);

  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isFetching &&
          !isError &&
          data?.hasNextPage
        ) {
          setPage(page + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (showMoreOrdersObserver.current) {
      observer.observe(showMoreOrdersObserver.current);
    }
    return () => {
      if (showMoreOrdersObserver.current) {
        observer.unobserve(showMoreOrdersObserver.current);
      }
    };
  }, [isError, isFetching, data?.hasNextPage, page]);

  if (isLoading) {
    return <PageLoader height="h-screen" />;
  }
  if (isError) {
    return (
      <div className="pt-4 px-4 max-w-7xl flex flex-col gap-4 items-center mx-auto">
        <div className="w-full">
          <Message variant="error">
            {error?.data?.message || error?.data || "Something went wrong"}{" "}
          </Message>
        </div>
        <Link
          to={"/shop"}
          className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-semibold"
        >
          Go To Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className=" ">
      <div className=" mx-auto px-4 sm:px-6 lg:pl-8 py-8">
        <div className="lg:flex lg:flex-row relative">
          {/* Left Sidebar  */}
          {data?.ordersLength > 0 && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ zIndex: 1000 }}
              className={`fixed  left-0 lg:left-[70px] top-22 sm:top-24 
                md:top-14  lg:top-0 w-[50%] bg-white  overflow-auto shadow-[0px_10px_10px_rgba(0,0,0,0.1)]
                  h-[87.5%] sm:h-[86%] lg:h-screen lg:ml-2 lg:w-[15rem] lg:block  pb-20 lg:pb-0 ${
                    openOrders ? "block" : "hidden"
                  }`}
            >
              <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded flex justify-center h-20 items-center">
                <h1 className="text-lg font-bold italic">
                  (<span className="text-indigo-600">{data?.ordersLength}</span>
                  ) Order
                </h1>
              </div>
              {data?.data?.orders?.map((order, index) => {
                const formattedDate = new Date(order.createdAt).toLocaleString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                );
                const fomattedTime = new Date(order.createdAt).toLocaleString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  }
                );
                return (
                  <div
                    className="px-5 shadow-[0px_0px_5px_rgba(0,0,0,0.1)] h-20 mt-2 hover:bg-gray-100 cursor-pointer py-2"
                    key={order._id}
                    onClick={() => {
                      setSelectedItem(index);
                      setOpenOrders(false);
                    }}
                  >
                    <div className="flex justify-start gap-0.5 mt-2 items-center">
                      <MdOutlineDateRange />
                      <h1 className="font-medium">{formattedDate}</h1>
                    </div>
                    <div className="flex mt-2 justify-between">
                      <div className="flex gap-0.5 font-medium items-center text-sm">
                        <IoMdTime />
                        <h3 className="text-gray-500">At {fomattedTime}</h3>
                      </div>
                      <h3 className="italic font-semibold">
                        <span className="text-indigo-500">
                          {order.orderItems.length}
                        </span>{" "}
                        item{order.orderItems.length > 1 && "s"}
                      </h3>
                    </div>
                  </div>
                );
              })}
              {isFetching && (
                <div>
                  <div className="px-5 flex items-center justify-center shadow-[0px_0px_10px_rgba(0,0,0,0.1)] h-20 mt-5 hover:bg-gray-100 cursor-pointer py-2">
                    <Loader />
                  </div>
                  <div className="px-5 flex items-center justify-center shadow-[0px_0px_10px_rgba(0,0,0,0.1)] h-20 mt-5 hover:bg-gray-100 cursor-pointer py-2">
                    <Loader />
                  </div>
                </div>
              )}
              <div ref={showMoreOrdersObserver} className="h-10"></div>
            </motion.div>
          )}

          {/* Right Content */}
          <div className="flex-1 lg:ml-8 mt-8 lg:mt-0">
            {data?.data?.orders.length === 0 ? (
              <motion.div
                key={selectedItem}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="pt-4  max-w-7xl flex flex-col gap-4 items-center mx-auto">
                  <div className="w-full">
                    <Message variant="info">{"You have no orders"} </Message>
                  </div>
                  <Link
                    to={"/shop"}
                    className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-semibold"
                  >
                    Go To Shopping
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 ">
                {/* Header */}
                <motion.div
                  key={selectedItem}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white p-6 rounded-xl lg:ml-[13rem] 
                  shadow-[0px_0px_10px_rgba(0,0,0,0.1)] "
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <FaOrcid className="text-indigo-600" size={28} />
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Order #{data?.data?.orders[selectedItem]?._id}
                      </h1>
                    </div>
                    <GoListOrdered
                      onClick={() => setOpenOrders(!openOrders)}
                      className="lg:hidden h-10 w-10 p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer transition-colors duration-200"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <IoTime className="text-emerald-500" size={22} />
                    <h3 className="text-sm sm:text-base font-medium text-gray-600">
                      Created At:{" "}
                      <span className="font-semibold text-gray-800">
                        {new Date(
                          data?.data?.orders[selectedItem]?.createdAt
                        ).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    </h3>
                  </div>
                </motion.div>

                {/* the right side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:ml-[13rem]">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="lg:col-span-2 space-y-6"
                  >
                    {/* Order Details */}
                    <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6  transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                      <OrderDetails order={data?.data?.orders[selectedItem]} />
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl py-1 px-4 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]  transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <FaSitemap size={24} />
                          <h1 className="text-xl font-bold italic text-gray-900">
                            Order Items
                          </h1>
                        </div>
                        {showOrderItems ? (
                          <MdKeyboardArrowDown
                            size={24}
                            className="cursor-pointer  font-bold  rounded-full w-8 h-8 p-1 transition-colors duration-200"
                            onClick={() => setShowOrderItems(false)}
                          />
                        ) : (
                          <MdKeyboardArrowUp
                            className="cursor-pointer text-gray-500 font-bold  rounded-full w-8 h-8 p-1 transition-colors duration-200"
                            onClick={() => setShowOrderItems(true)}
                          />
                        )}
                      </div>
                      {showOrderItems && (
                        <div className="p-6 px-10 space-y-4">
                          {data?.data?.orders[selectedItem]?.orderItems.map(
                            (item) => (
                              <div
                                key={item.product._id}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                              >
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                  <div className="flex items-center justify-center w-full sm:w-24 sm:h-24 rounded-lg bg-white">
                                    <img
                                      className="max-w-full max-h-full rounded-lg"
                                      src={`/uploads/${item.product.img
                                        .split("/")
                                        .pop()}`}
                                      onError={(e) =>
                                        (e.target.src =
                                          "../../../public/userImge.png")
                                      }
                                      alt={item.product.name}
                                    />
                                  </div>
                                  <div className="flex flex-col text-gray-600 space-y-1">
                                    <h1
                                      onClick={() =>
                                        navigate(`/product/${item.product._id}`)
                                      }
                                      className=" text-gray-700 font-bold hover:text-indigo-800 hover:underline cursor-pointer transition-colors duration-200"
                                    >
                                      {item.product.name}
                                    </h1>
                                    <p>
                                      <span className="font-medium">
                                        Brand:
                                      </span>{" "}
                                      {item.product.brand}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Quantity:
                                      </span>{" "}
                                      {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center mt-4 sm:mt-0">
                                  <h1 className="font-bold text-indigo-700">
                                    ${item.product.price.toFixed(2)}
                                  </h1>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    key={selectedItem}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {/* Order Progress */}
                    <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6  transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                      <OrderProgress
                        progress={
                          data?.data?.orders[selectedItem]?.orderProgress
                        }
                        createAt={data?.data?.orders[selectedItem]?.createdAt}
                      />
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6  transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                      <ShippingAdress
                        shippingAddress={
                          data?.data?.orders[selectedItem]?.shippingAddress
                        }
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
