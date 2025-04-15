import { Link, useParams } from "react-router-dom";
import PageLoader from "../../components/PageLoader";
import OrderProgress from "../../components/OrderProgress";
import ShippingAdress from "../../components/ShippingAdress";
import OrderDetails from "../../components/OrderDetails";
import ProductShowTable from "../../components/ProductShowTable";
import OrderActions from "../../components/OrderActions";
import { useGetOrderDetailsQuery } from "../../redux/apis/orderApiSlice";
import Message from "../../components/Message";
import { motion } from 'motion/react'
import { IoTime } from "react-icons/io5";
import { GoListOrdered } from "react-icons/go";
import { FaOrcid } from "react-icons/fa6";
import { useEffect } from "react";

export default function Order() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

  useEffect(() => {
    window.document.title = "Order #"+order?.data?.order?._id || "Order";
  }, [order]);

  if (error) {
    return (
      <div className="pt-[1rem] pr-[1rem]">
        <Message variant="dangers">
          {error?.data?.message || error?.data || "Something went wrong"}{" "}
          <Link
            to={"/shop"}
            className="cursor-pointer text-pink-500 hover:text-pink-600 hover:underline font-bold italic"
          >
            Go To Shopping
          </Link>
        </Message>
      </div>
    );
  }
  if (isLoading) return <PageLoader />;

  return (
    <div className="p-8 space-y-4 flex flex-col ml-[1rem] ">
      {/* header  */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex justify-between   items-center ">
          <div className="flex justify-start  gap-0.5 items-center ">
            <FaOrcid size={26} />{" "}
            <h1 className="text-base font-bold  sm:text-2xl">
              {order?.data?.order?._id}
            </h1>
          </div>
        </div>
        <div className="flex justify-start gap-0.5 items-center mt-5">
          <IoTime size={20} color="green" />
          <h3 className="font-medium text-base sm:text-md  text-green-200">
            Created At:{" "}
            <span className="font-semibold text-gray-500">
              {new Date(
                order?.data?.order?.createdAt
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

      <div
        className={`bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-2xl`}
      >
        <OrderActions order={order?.data?.order} />
      </div>

      <div
        className={`bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-2xl`}
      >
        <ProductShowTable
          px={"px-5 "}
          className={"mx-13"}
          orderItems={order?.data?.order?.orderItems}
        />
      </div>

      <div className="shadow-[0px_0px_10px_rgba(0,0,0,0.1)]  rounded-2xl">
        <OrderDetails order={order?.data?.order} />
      </div>

      <div className=" shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-2xl">
        <OrderProgress
          progress={order?.data?.order?.orderProgress}
          createAt={order?.data?.order?.createdAt}
        />
      </div>
      <div className=" shadow-[0px_0px_10px_rgba(0,0,0,0.1)]  rounded-2xl ">
        <ShippingAdress shippingAddress={order?.data?.order?.shippingAddress} />
      </div>
    </div>
  );
}
