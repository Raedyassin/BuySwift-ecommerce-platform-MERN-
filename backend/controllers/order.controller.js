import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { calcTotalPrice } from '../utils/clacTotalPrice.js'
import { generateAccessToken } from '../utils/PayPalAccessToken.js'
import axios from 'axios'//npm install axios

const createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (!orderItems?.length) {
    return res.status(400).json({ status: FAIL, message: "No order items" })
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map(x => x._id) }
  })
  // Check if all requested products exist in DB
  const missingProducts = orderItems.filter(
    itemFromClient => !itemsFromDB.some(item => item._id.toString() === itemFromClient._id)
  );

  if (missingProducts.length > 0) {
    return res.status(404).json({
      status: FAIL,
      data: {
        title: "Some products were not found",
        products: missingProducts,
      },
    });
  }

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemsFromDB = itemsFromDB.find(
      item => item._id.toString() === itemFromClient._id
    );
    
    return {
      ...itemFromClient,
      productId: matchingItemsFromDB._id,
      price: matchingItemsFromDB.price,
      image: matchingItemsFromDB.img
    }
  });

  const {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = calcTotalPrice(dbOrderItems)


  // finish validation of the order

  console.log("dbOrderItems", dbOrderItems);
  console.log("shippingAddress", shippingAddress);
  
  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress:{
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      firstPhone: shippingAddress.firstPhone,
      secondPhone: shippingAddress.secondPhone,
    },
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // intergrate with paypal


  await order.save();
  return res.status(201).json({
    status: SUCCESS,
    data: { order },
  });

});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("user", 'username email');
  res.status(200).json({ status: SUCCESS, data: { orders } })
})

const getUserOrders = asyncHandler(async (req, res, next) => {
  const page  = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit) || 10;
  const skip = (page - 1) * pageSize;
  const ordersCount = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id }).populate("user", 'username email')
    .limit(pageSize+1)
    .skip(skip)
    .sort({ createdAt: -1 });
  const hasNextPage = orders.length > pageSize;
  if (hasNextPage){
    orders.pop();
  }
  res.status(200).json({
    status: SUCCESS,
    data: { orders },
    currentPage: page,
    ordersLength: ordersCount,
    pageSize,
    hasNextPage,
    hasPrevPage: page > 1
  })
})

const getOrderDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const order = await Order.findById(id).populate("user", "username email");
  if (!order) {
    res.status(404).json({ status: FAIL, message:"Order not found"})
  }
  res.status(200).json({ status: SUCCESS, data: { order } })
})

// i make the payed after paypal
// this is will be available for the deliver on home or not online pay
const markOrderAsPaidManual = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
  }
  if (order.isPaid) {
    return res.status(409).json({ status: FAIL, data: { title: "Order already Paid" } })
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body?.payer?.email_address || "in test phase",
  }
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})

const markorderDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
  }
  if (order.deliveredAt) {
    return res.status(409).json({ status: FAIL, data: { title: "Order already Delivered" } })
  }
  if (order.status !== "ontheroute"){
    return res.status(409).json({ status: FAIL, data: { title: "Order not on the route yet" } })
  }
  order.orderProgress.deliveredAt = Date.now();
  order.status = "delivered";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})

const markorderPacked = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
  }
  if (order.orderProgress.packedAt) {
    return res.status(409).json({ status: FAIL, data: { title: "Order already Pakced" } })
  }
  if (order.status !== "pending"){
    return res.status(409).json({ status: FAIL, data: { title: "Order not on created yet" } })
  }
  order.orderProgress.packedAt = Date.now();
  order.status = "packed";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})

const markorderTransit = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
  }
  if (order.orderProgress.transitAt) {
    return res.status(409).json({ status: FAIL, data: { title: "Order already Transited" } })
  }
  if (order.status !== "packed"){
    return res.status(409).json({ status: FAIL, data: { title: "Order not on packed yet" } })
  }
  order.orderProgress.transitAt = Date.now();
  order.status = "ontheroute";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})
// until now i will make the adimin cancle the order only
const cancleOrderByAdmin = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
  }
  order.orderProgress.cancelledAt = Date.now();
  order.status = "cancelled";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})


export {
  cancleOrderByAdmin,
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetails,
  markOrderAsPaidManual,
  markorderDeliver,
  markorderPacked,
  markorderTransit
}