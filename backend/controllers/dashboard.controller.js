import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { SUCCESS } from "../utils/httpStatucText.js";

const getDashboardData = asyncHandler(async (req, res) => {
  // Total Users
  const totalUsers = await User.countDocuments();

  // Total Orders
  const totalOrders = await Order.countDocuments();

  // Total Products
  const totalProducts = await Product.countDocuments();

  // Total Revenue (sum of totalPrice for paid orders)
  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  // Orders by Status
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

  // Recent Orders (last 5)
  const recentOrders = await Order.find()
    .select("user totalPrice status createdAt")
    .populate("user", "username email")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Top-Rated Products (top 5 by rating)
  const topRatedProducts = await Product.find()
    .select("name brand price rating numReview")
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  // Low Stock Products (countInStock < 5)
  const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } })
    .select("name brand countInStock")
    .lean();

  // Recent Reviews (last 5 reviews across all products)
  const recentReviews = await Product.aggregate([
    { $unwind: "$reviews" },
    { $sort: { "reviews.createdAt": -1 } },
    {
      $project: {
        productName: "$name",
        review: "$reviews",
      },
    },
    { $limit: 5 },
  ]);

  res.json({
    status: SUCCESS,
    data: {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
    ordersByStatus,
    recentOrders,
    topRatedProducts,
    lowStockProducts,
    recentReviews,
  }});
});

export { getDashboardData };