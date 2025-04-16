import { Link, useParams } from "react-router-dom";
import PageLoader from "../../components/PageLoader";
import OrderProgress from "../../components/OrderProgress";
import ShippingAdress from "../../components/ShippingAdress";
import OrderDetails from "../../components/OrderDetails";
import ProductShowTable from "../../components/ProductShowTable";
import OrderActions from "../../components/OrderActions";
import { useGetOrderDetailsQuery } from "../../redux/apis/orderApiSlice";
import Message from "../../components/Message";
import { motion } from "motion/react";
import { IoTime } from "react-icons/io5";
import { FaOrcid } from "react-icons/fa6";
import { useEffect } from "react";

export default function Order() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);
  useEffect(() => {
    window.document.title = "Order #" + order?.data?.order?._id || "Order";
  }, [order]);

  if (error) {
    return (
      <div className="pt-4 px-4 max-w-7xl flex flex-col gap-4 items-center mx-auto">
        <div className="w-full">
          <Message variant="danger">
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
  if (isLoading) return <PageLoader />;

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 
    min-h-screen"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-6 rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] "
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center gap-3">
            <FaOrcid className="text-indigo-600" size={30} />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Order #{order?.data?.order?._id}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <IoTime className="text-emerald-500" size={24} />
          <h3 className="text-sm sm:text-base font-medium text-gray-600">
            Created At:{" "}
            <span className="font-semibold text-gray-800">
              {new Date(order?.data?.order?.createdAt).toLocaleString("en-US", {
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] ">
            <OrderActions order={order?.data?.order} />
          </div>

          <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] ">
            <OrderDetails order={order?.data?.order} />
          </div>

          <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] ">
            <ProductShowTable
              px="px-5"
              className="px-13"
              orderItems={order?.data?.order?.orderItems}
            />
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] ">
            <OrderProgress
              isPaid={order?.data?.order?.isPaid}
              progress={order?.data?.order?.orderProgress}
              createAt={order?.data?.order?.createdAt}
            />
          </div>

          <div className="bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 transition-all duration-300 hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] ">
            <ShippingAdress
              shippingAddress={order?.data?.order?.shippingAddress}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
