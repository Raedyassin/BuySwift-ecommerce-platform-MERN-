import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { SUCCESS } from "../utils/httpStatucText.js";

const getDashboardData = asyncHandler(async (req, res) => {

  // *************************************************************************************
  // *** i use bad logic on this API untill now, so it is demo i will improve it later ***
  // *************************************************************************************
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Total Revenue
  const totalRevenueOrders = await Order.find({}).lean();
  const totalRevenue = totalRevenueOrders.reduce((acc, order) => {
    acc += +order.totalPrice;
    return acc;
  },0);

  
  const totalpaidOrders = (await Order.find({isPaid: true}).lean()).length;

  const ordersByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);


  const topRatedProducts = await Product.find()
    .select("name brand price rating img numRatings")
    .sort({ rating: -1 })
    .limit(10)
    .lean();
  const topSoldProducts = await Product.find()
    .select("name sold brand price img ")
    .sort({ sold: -1 })
    .limit(10)
    .lean();



  res.json({
    status: SUCCESS,
    data: {
    totalUsers,
    totalRevenue,
    totalpaidOrders,
    totalOrders,
    totalProducts,
    ordersByStatus,
      topSoldProducts,
      topRatedProducts
  }});
});

export { getDashboardData };