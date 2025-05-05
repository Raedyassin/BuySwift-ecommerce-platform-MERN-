import { useEffect } from "react";
import { useGetDashboardInfoQuery } from "../../redux/apis/dashboardApiSlic";
import AdminMenu from "./AdminMenu";
import { FaRegUserCircle } from "react-icons/fa";
import { FaKeyboard } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import PageHeader from "../../components/PageHeader";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {prefixImageUrl} from '../../utils/constance'
import PageLoader from "../../components/PageLoader";
import { useNavigate } from "react-router-dom";
import Message from "../../components/Message";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  useEffect(() => {
    window.document.title = "Dashboard";
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { data, isLoading, error } = useGetDashboardInfoQuery();

  if (isLoading) return <PageLoader height="h-screen" />;
  if (error)
    return (
      <Message variant="error">
        Error: {error?.data?.message || "Failed to load dashboard"}
      </Message>
    );

  const {
    totalUsers,
    totalOrders,
    totalRevenue,
    totalpaidOrders,
    totalProducts,
    ordersByStatus,
    topSoldProducts,
    topRatedProducts,
  } = data?.data || {};

  console.log("ordersByStatus", ordersByStatus);
  // Bar Chart Data for Orders by Status
  const StatusColorTemp = [
    "#EF4444", // indigo-500 (cancelled)
    "#10B981", // green-500 (delivered)
    "#5b9bbb", // yellow-500 (ontheroute)
    "#2DCCFF", // blue-500 (packed)
    "#FFB302", // red-500 (pending)
  ];
  const StatusColor = ordersByStatus?.map((status) => {
    return status._id === "cancelled"
      ? StatusColorTemp[0]
      : status._id === "delivered"
      ? StatusColorTemp[1]
      : status._id === "ontheroute"
      ? StatusColorTemp[2]
      : status._id === "packed"
      ? StatusColorTemp[3]
      : StatusColorTemp[4];
  });
  const ordersByStatusChart = {
    labels: ordersByStatus?.map((status) => status._id) || [],
    datasets: [
      {
        label: "Orders by Status",
        data: ordersByStatus?.map((status) => status.count || 1) || [],
        backgroundColor: StatusColor,
        borderColor: StatusColor,
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data (Placeholder for revenue breakdown, e.g., by payment method)
  const revenueChart = {
    labels: ["Paid Orders", "Unpaid Orders"],
    datasets: [
      {
        data: [totalpaidOrders, totalOrders - totalpaidOrders],
        backgroundColor: ["#46e570", "#D1D5DB"],
        borderColor: ["#46e570", "#9CA3AF"],
        borderWidth: 1,
      },
    ],
  };

  console.log(topRatedProducts)
  return (
    <div className="flex min-h-screen ">
      {/* Admin Menu */}
      <AdminMenu />

      {/* Main Content */}
      <div className="flex-1 mt-4 md:mt-0 p-4 sm:p-6 lg:p-8 ">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <PageHeader className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Admin Dashboard
          </PageHeader>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {[
            {
              icon: <FaRegUserCircle size={24} className="text-indigo-500" />,
              title: "Total Users",
              value: totalUsers || 0,
              color: "text-indigo-500",
            },
            {
              icon: (
                <MdOutlineProductionQuantityLimits
                  size={24}
                  className="text-teal-500"
                />
              ),
              title: "Total Products",
              value: totalProducts || 0,
              color: "text-teal-500",
            },
            {
              icon: <FaKeyboard size={24} className="text-purple-500" />,
              title: "Total Orders",
              value: totalOrders || 0,
              color: "text-purple-500",
            },
            {
              icon: (
                <RiMoneyDollarCircleLine size={24} className="text-green-500" />
              ),
              title: "Total Revenue",
              value: `$${(totalRevenue || 0).toFixed(2)}`,
              color: "text-green-500",
            },
          ].map((metric) => (
            <div
              key={metric.title}
              className="bg-white p-4 sm:p-5 rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] hover:shadow-[0px_0px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex items-start space-x-3 sm:space-x-4"
            >
              <div className="flex-shrink-0">{metric.icon}</div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-600">
                  {metric.title}
                </h2>
                <p
                  className={`text-lg sm:text-xl lg:text-2xl font-bold ${metric.color} mt-1 `}
                >
                  {metric.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Top-Rated Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Charts Container */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Orders by Status */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                Orders by Status
              </h2>
              <div className="h-60 sm:h-72 lg:h-80">
                <Bar
                  data={ordersByStatusChart}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { backgroundColor: "#4F46E5" },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Number of Orders" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                Revenue Breakdown
              </h2>
              <div className="h-60 sm:h-72 lg:h-80">
                <Pie
                  data={revenueChart}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "right" },
                      tooltip: { backgroundColor: "#4F46E5" },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top-Rated Products */}
          <div className=" space-y-5 ">
            <div className="p-4 sm:p-6 rounded-xl  shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 mb-4">
                Top Sold Products
              </h2>
              <ul className="space-y-1 grid grid-cols-1 gap-1 md:grid-cols-2  pr-2">
                {topSoldProducts?.length ? (
                  topSoldProducts.map((product) => (
                    <li
                      key={product._id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition duration-200"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={prefixImageUrl + product.img.split("/").pop()}
                          alt={product.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-fill"
                        />
                        <span
                          className="text-sm sm:text-base text-gray-800 
                          hover:text-indigo-600 cursor-pointer transition-colors 
                          duration-200 line-clamp-2"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {product.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 text-right">
                        ({product.sold})
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm sm:text-base text-center">
                    No top-sold products
                  </li>
                )}
              </ul>
            </div>
            <div className="p-4 sm:p-6 rounded-xl  shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700 mb-4">
                Top Rated Products
              </h2>
              <ul className="space-y-1  grid grid-cols-1 md:grid-cols-2 gap-1  pr-2">
                {topRatedProducts?.length ? (
                  topRatedProducts.map((product) => (
                    <li
                      key={product._id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition duration-200"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                          src={prefixImageUrl + product.img.split("/").pop()}
                          alt={product.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-fill"
                        />
                        <span
                          className="text-sm sm:text-base text-gray-800 
                          hover:text-indigo-600 cursor-pointer transition-colors 
                          duration-200 line-clamp-2"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {product.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 text-right">
                        <span className="font-semibold text-yellow-500">
                          {product.rating.toFixed(2)}
                        </span>{" "}
                        ({product.numRatings})
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm sm:text-base text-center">
                    No top-Related products
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
