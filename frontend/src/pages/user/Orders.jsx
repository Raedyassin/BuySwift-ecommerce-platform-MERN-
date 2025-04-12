import { useEffect, useRef, useState } from "react";
import { useGetUserOrdersQuery } from "../../redux/apis/orderApiSlice";
import { MdOutlineDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import Message from "../../components/Message";
import { useNavigate } from "react-router-dom";
import { FaOrcid } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import ShippingAdress from "../../components/ShippingAdress";
import OrderProgress from "../../components/OrderProgress";
import { FaSitemap } from "react-icons/fa";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import Status from "../../components/Status";
import { GoListOrdered } from "react-icons/go";
import { motion } from "motion/react";
import Loader from "../../components/Loader";
import PageLoader from "../../components/PageLoader";
export default function Orders() {
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(0);
  const [showOrderItems, setShowOrderItems] = useState(true);
  const [showDetails, setshowDetails] = useState(true);
  const showMoreOrdersObserver = useRef();
  const navigate = useNavigate();
  const [openOrders, setOpenOrders] = useState(false);
  const { data, isLoading, isFetching, isError, error } = useGetUserOrdersQuery(
    {
      page,
      limit: 10,
    }
    // {
    //   // Keep data from previous pages in cache
    //   refetchOnMountOrArgChange: true,
    // }
  );

      useEffect(() => {
        window.document.title = "Orders";
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
      <Message variant="error">
        {error?.data?.message || error?.message || "Something went wrong"}
      </Message>
    );
  }
  return (
    <div className="container lg:flex lg:flex-row   ">
      {/* the left side */}
      {/* h-screen overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded */}
      {/* {data?.ordersLength > 0 && ( */}
      {data?.ordersLength > 0 && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className={`fixed z-1000  left-0 lg:left-[70px] top-22 sm:top-24 md:top-14  
            lg:top-15 w-[50%]  bg-white 
            h-screen overflow-auto lg:h-[90%]  lg:ml-2   lg:w-[15rem] lg:block  
            mt-2  pb-20 lg:pb-0 ${openOrders ? "block" : "hidden"}  `}
        >
          <div className="shadow-[5px_0px_8px_rgba(0,0,0,0.1)]  rounded flex  justify-center h-20 items-center ">
            <h1 className=" text-lg   font-bold italic">
              (<span className="text-indigo-600">{data?.ordersLength}</span>){" "}
              Order{" "}
            </h1>
          </div>
          {data?.data?.orders?.map((order, index) => {
            const formattedDate = new Date(order.createdAt).toLocaleString(
              "en-US",
              {
                month: "long", // "March"
                day: "numeric", // "15"
                year: "numeric", // "2025"
              }
            );
            const fomattedTime = new Date(order.createdAt).toLocaleString(
              "en-US",
              {
                hour: "2-digit", // "06"
                minute: "2-digit", // "26"
                second: "2-digit", // "55"
                hour12: false, // 24-hour format; remove for 12-hour (AM/PM)
              }
            );
            return (
              <div
                className="px-5  shadow-[5px_2px_10px_rgba(0,0,0,0.08)] h-20 mt-2
                hover:bg-gray-100 cursor-pointer   py-2"
                key={order._id}
                onClick={() => {
                  setSelectedItem(index);
                  setOpenOrders(false);
                }}
              >
                <div className="flex justify-start gap-0.5 mt-2 items-center ">
                  <MdOutlineDateRange />
                  <h1 className="font-medium">{formattedDate}</h1>
                </div>
                <div className="flex mt-2 justify-between">
                  <div className="flex gap-0.5 font-medium items-center text-sm ">
                    <IoMdTime />
                    <h3 className="text-gray-500">At {fomattedTime}</h3>
                  </div>
                  <h3 className="italic font-semibold">
                    <span className=" text-indigo-500">
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
              <div className="px-5 flex items-center justify-center shadow-[5px_2px_10px_rgba(0,0,0,0.08)] h-20 mt-5 hover:bg-gray-100 cursor-pointer   py-2">
                <Loader />
              </div>
              <div className="px-5 flex items-center justify-center shadow-[5px_2px_10px_rgba(0,0,0,0.08)] h-20 mt-5 hover:bg-gray-100 cursor-pointer   py-2">
                <Loader />
              </div>
            </div>
          )}
          {/* load more Orders */}
          <div ref={showMoreOrdersObserver} className="h-10"></div>
        </motion.div>
      )}

      {/* the right side */}
      <div className="flex flex-col lg:flex-grow lg:ml-[15rem]">
        {data?.data?.orders.length === 0 ? (
          <motion.h1
            key={selectedItem}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="font-semibold text-xl "
          >
            <Message>You have no orders</Message>
          </motion.h1>
        ) : (
          <div className="w-full p-10">
            {/* header of the right side */}
            <motion.div
              key={selectedItem}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="flex justify-between  items-center ">
                <div className="flex justify-start gap-0.5 items-center ">
                  <FaOrcid size={26} />{" "}
                  <h1 className="text-2xl font-bold">
                    {data?.data?.orders[selectedItem]?._id}
                  </h1>
                </div>
                <GoListOrdered
                  onClick={() => setOpenOrders(!openOrders)}
                  className="lg:hidden h-9 w-9  cursor-pointer
                    p-2 shadow-md hover:shadow-lg transition-all duration-300 
                    bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold 
                    rounded-full"
                />
              </div>
              <div className="flex justify-start gap-0.5 items-center mt-5">
                <IoTime size={20} color="green" />
                <h3 className="font-medium  text-[#b6bec1]">
                  Created At:{" "}
                  <span className="font-semibold text-gray-500">
                    {new Date(
                      data?.data?.orders[selectedItem]?.createdAt
                    ).toLocaleString("en-US", {
                      month: "long", // "March"
                      day: "numeric", // "15"
                      year: "numeric", // "2025"
                      hour: "2-digit", // "06"
                      minute: "2-digit", // "26"
                      second: "2-digit", // "55"
                      hour12: false, // 24-hour format; remove for 12-hour (AM/PM)
                    })}
                  </span>
                </h3>
              </div>
            </motion.div>

            <div className="flex flex-col  lg:flex-row mt-10">
              <motion.div
                // key={selectedItem}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="lg:w-[60%]   w-full flex flex-col "
              >
                <div className="shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]  border-gray-200 mb-5 rounded">
                  <div className="flex items-center justify-between  px-5 py-2   gap-2">
                    <div className="flex items-center gap-2">
                      <FaMoneyBill1Wave size={24} />
                      <h1 className="font-bold text-xl  italic">
                        Order Details
                      </h1>
                    </div>
                    {showDetails ? (
                      <MdKeyboardArrowDown
                        MdKeyboardArrowUp
                        className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
                        onClick={() => setshowDetails(false)}
                      />
                    ) : (
                      <MdKeyboardArrowUp
                        className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
                        onClick={() => setshowDetails(true)}
                      />
                    )}
                  </div>
                  {showDetails && (
                    <div className="">
                      <div className="flex flex-row justify-between  px-4 py-3 ">
                        <div className="font-semibold text-gray-500">
                          Status
                        </div>
                        <Status
                          status={data?.data?.orders[selectedItem]?.status}
                        />
                      </div>
                      {data?.data?.orders[selectedItem]?.isPaid && (
                        <div className="flex flex-row justify-between  px-4 py-3 ">
                          <div className="font-semibold text-gray-500">
                            Payment Method
                          </div>
                          <div>
                            {data?.data?.orders[selectedItem]?.paymentMethod}
                          </div>
                        </div>
                      )}
                      <div className="flex flex-row justify-between  px-4 py-3 ">
                        <div className="font-semibold text-gray-500">
                          Is Paid
                        </div>
                        <div>
                          {data?.data?.orders[selectedItem]?.isPaid ? (
                            <span className="text-green-500 font-bold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-500 font-bold">No</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row justify-between  px-4 py-3 ">
                        <div className="font-semibold text-gray-500">
                          Items Price
                        </div>
                        <div>
                          ${data?.data?.orders[selectedItem]?.itemsPrice}
                        </div>
                      </div>
                      <div className="flex flex-row justify-between  px-4 py-3 ">
                        <div className="font-semibold text-gray-500">
                          Shipping Price
                        </div>
                        <div>
                          ${data?.data?.orders[selectedItem]?.shippingPrice}
                        </div>
                      </div>
                      <div className="flex flex-row justify-between  px-4 py-3 ">
                        <div className="font-semibold text-gray-500">
                          Tax Price
                        </div>
                        <div>${data?.data?.orders[selectedItem]?.taxPrice}</div>
                      </div>
                      <div className="border-t-1 border-gray-300 mx-3 my-2"></div>
                      <div className="flex flex-row justify-between  px-4 py-3  ">
                        <div className="font-semibold text-gray-500">
                          Total Price
                        </div>
                        <div>
                          ${data?.data?.orders[selectedItem]?.totalPrice}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className=" shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]  mb-20 rounded">
                  <div className="flex items-center justify-between  px-5 py-2   gap-2">
                    <div className="flex items-center gap-2">
                      <FaSitemap size={24} />
                      <h1 className="font-bold text-xl  italic">Order Items</h1>
                    </div>
                    {showOrderItems ? (
                      <MdKeyboardArrowDown
                        className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
                        onClick={() => setShowOrderItems(false)}
                      />
                    ) : (
                      <MdKeyboardArrowUp
                        className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
                        onClick={() => setShowOrderItems(true)}
                      />
                    )}
                  </div>
                  {showOrderItems && (
                    <div className=" ">
                      {data?.data?.orders[selectedItem]?.orderItems.map(
                        (item) => (
                          <div
                            key={item._id}
                            className="flex flex-row justify-between mt-5 p-4 py-2 border-b-1 border-gray-200 "
                          >
                            <div className="flex flex-row gap-3">
                              <img
                                className="w-30 h-20 rounded"
                                src={`/uploads/${item.image.split("/").pop()}`}
                                onError={(e) =>
                                  (e.target.src =
                                    "../../../public/userImge.png")
                                }
                                alt={item.name}
                              />
                              <div className="flex flex-col justify-start  text-gray-500 ">
                                <h1
                                  onClick={() =>
                                    navigate(`/product/${item._id}`)
                                  }
                                  className="underline font-bold italic hover:text-pink-600 hover:underline cursor-pointer"
                                >
                                  {item.name}
                                </h1>
                                <h1>
                                  <span className="font-semibold">Brand:</span>{" "}
                                  {item.brand}
                                </h1>
                                <h1>
                                  <span className="font-semibold">
                                    Quantity:
                                  </span>{" "}
                                  {item.quantity}
                                </h1>
                              </div>
                            </div>
                            <div className="my-auto">
                              <h1 className="font-bold">
                                ${item.price.toFixed(2)}
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
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col p-0 lg:p-5 lg:pt-0  pt-0  lg:w-[30rem] w-full"
              >
                {/* <div className=" border-2  shadow-md mb-5 rounded border-gray-100"> */}
                <div className=" shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] mb-5 rounded">
                  <OrderProgress
                    progress={data?.data?.orders[selectedItem]?.orderProgress}
                    createAt={data?.data?.orders[selectedItem]?.createdAt}
                  />
                </div>
                <div className=" shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]    mb-20 rounded ">
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
  );
}
