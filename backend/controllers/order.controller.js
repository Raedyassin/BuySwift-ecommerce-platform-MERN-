import Order from "../models/order.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { calcTotalPrice } from '../utils/clacTotalPrice.js'
import productsIsFound from '../utils/productsIsFound.js'
import { reduceQuantity } from "../utils/changeQuantity.js";

// this is for manual order payied
const createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress } = req.body;
  let { paymentMethod } = req.body;

  const dbOrderItems = await productsIsFound(res, orderItems);
  if (!dbOrderItems) return; 

  const {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = calcTotalPrice(dbOrderItems)

  // **************************************
  // paypal add in payment.controller.js **
  // **************************************
  
  // enum: ['VodafoneCash', 'PayPal', 'OnDelivery'], VodafoneCash will add later
  // PayPal hase it's own Controller
  if(paymentMethod.trim().toLowerCase() === "paypal") {
    return res.status(400).json({ status: FAIL, message: "PayPal payment method is called by anotehr API (url/order/paypal)" })
  }
  paymentMethod = paymentMethod.trim().toLowerCase() === "ondelivery" ? "OnDelivery" : paymentMethod;
    if (paymentMethod.trim().toLowerCase() === "vodafonecash") { 
    paymentMethod = "VodafoneCash"
    return res.status(400).json({ status: FAIL, message: "Vodafone Cash payment method is not Work yet (We Work On It), please choose another method" })
  }
  else if (paymentMethod.trim().toLowerCase() !== "ondelivery"){ 
    return res.status(400).json({ status: FAIL, message: "Unsupported (Invalid) payment method we support only (PayPal, OnDelivery)" })
  }

  const reducesQuantitySuccess = await reduceQuantity(res,dbOrderItems);
  if (!reducesQuantitySuccess) return;

  const order = new Order({
    orderItems: dbOrderItems.map((item) => ({
      quantity: item.quantity,
      product: item._id,
    })),
    user: req.user._id,
    shippingAddress:{
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      firstPhone: shippingAddress.firstPhone,
      secondPhone: shippingAddress.secondPhone||"",
    },
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  await order.save();
  return res.status(201).json({
    status: SUCCESS,
    data: { message: "Order created successfully"},
  });

});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit) || 50;
  const { status, createdAt, price, payment } = req.query
  
  // start validatiaon
  const filter = {};
  if (status && status !== "") {
    if (!["pending", "delivered", "ontheroute", "packed", "cancelled"].includes(status)) {
      return res.status(400).json({ status: "FAIL", data: { title: "Invalid status" } });
    }
    filter.status = status;
  }
  if (createdAt && createdAt !== "") {
    const [year, month, day] = createdAt.split("-"); // e.g., "2025-03-18"
    if (parseInt(year) < 2025 || (parseInt(year) <= 2025 && parseInt(month) < 3) || (parseInt(year) <= 2025 && parseInt(month) <= 3 && parseInt(day) < 16)) {
      return res.status(400).json({ status: "FAIL", data: { title: "this date is not valid" } });
    }
    const date = new Date(year, month - 1, day); // Month is 0-based
    filter.createdAt = {
      $gte: date,                // Start of day (e.g., 2025-03-18 00:00:00)
      $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Start of next day (2025-03-19 00:00:00)
    };
  }
  if (price && price !== "") {
    const [start, end] = price.split("-").map(Number); // e.g., "100-500"
    filter.totalPrice = { $gte: parseInt(start)||Infinity, $lte: parseInt(end)||Infinity };
  }
  if (payment && payment !== "") {
    filter.isPaid = payment === "paid";
  }
  

  const skip = (page - 1) * pageSize;
  const ordersCount = await Order.countDocuments(filter);
  const orders = await Order.find(filter).populate("user", 'username')
    .select("-__v -shippingAddress  -paymentResult -paidAt -updatedAt -shippingPrice -taxPrice -itemsPrice -orderItems ")
    .limit(pageSize + 1)
    .skip(skip)
    .sort({ createdAt: -1 });
  
  const hasNextPage = orders.length > pageSize;
  if (hasNextPage) {
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

const getUserOrders = asyncHandler(async (req, res, next) => {
  const page  = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit) || 10;
  const skip = (page - 1) * pageSize;
  const ordersCount = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product", "brand img name price") //////////////
    .populate("user", 'username email')
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
  const order = await Order.findById(id)
    .populate("user", "username email")
    .populate("orderItems.product", "brand img name price") //////////////
    .select("-__v")

  if (!order) {
    res.status(404).json({ status: FAIL, message:"Order not found"})
  }
  res.status(200).json({ status: SUCCESS, data: { order } })
})

// i make the payed after paypal
// this is will be available for the deliver on home or not online pay
const markOrderAsPaidManual = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("orderItems.product", "brand img name price") //////////////
  if (!order) {
    return res.status(404).json({ status: FAIL, message: "Order not found" });
  }
  if (order.status === "cancelled") {
    return res.status(409).json({ status: FAIL, message: "Order cancelled" } )
  }
  if (order.isPaid) {
    return res.status(409).json({ status: FAIL, message: "Order already Paid"  })
  }
  if (order.status !== "ontheroute"){
    return res.status(409).json({ status: FAIL, message: "Order is not On Tthe Route yet or Order payed then delivered" })
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  // order.paymentMethod = "OnDelivery";
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
    .populate("orderItems.product", "brand img name price") //////////////
  if (!order) {
    return res.status(404).json({ status: FAIL, message: "Order not found"  });
  }
  if (order.status === "cancelled") {
    return res.status(409).json({ status: FAIL, message: "Order cancelled" })
  }
  if (order.deliveredAt) {
    return res.status(409).json({ status: FAIL, message: "Order already Delivered" })
  }
  if (order.status !== "ontheroute"){
    return res.status(409).json({ status: FAIL, message: "Order not on the route yet" })
  }
  if(order.isPaid === false){
    return res.status(409).json({ status: FAIL, message: "Order not on paid yet" })
  }

  order.orderProgress.deliveredAt = Date.now();
  order.status = "delivered";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})

const markorderPacked = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("orderItems.product", "brand img name price") //////////////
  if (!order) {
    return res.status(404).json({ status: FAIL, message: "Order not found" } );
  }
  if (order.status === "cancelled") {
    return res.status(409).json({ status: FAIL, message: "Order cancelled" })
  }
  if (order.orderProgress.packedAt) {
    return res.status(409).json({ status: FAIL, message: "Order already Pakced" } )
  }
  if (order.status !== "pending"){
    return res.status(409).json({ status: FAIL, message: "Order not on created yet" } )
  }
  order.orderProgress.packedAt = Date.now();
  order.status = "packed";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})

const markorderTransit = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("orderItems.product", "brand img name price") //////////////
  if (!order) {
    return res.status(404).json({ status: FAIL, message: "Order not found" } );
  }
  if (order.status === "cancelled") {
    return res.status(409).json({ status: FAIL, message: "Order cancelled" })
  }
  if (order.orderProgress.transitAt) {
    return res.status(409).json({ status: FAIL, message: "Order already Transited" } )
  }
  if (order.status !== "packed"){
    return res.status(409).json({ status: FAIL, message: "Order not on packed yet" } )
  }
  order.orderProgress.transitAt = Date.now();
  order.status = "ontheroute";
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})
// until now i will make the adimin cancle the order only
const cancleOrderByAdmin = asyncHandler(async (req, res, next) => {
  // should when admin cancle the order the orderItems in Prouct Model 
  // sould increase but i now i don't make this i will make this later
  const order = await Order.findById(req.params.id)
    .populate("orderItems.product", "brand img name price") //////////////
  if(order.status === "delivered"){
    return res.status(409).json({ status: FAIL, message: "Order already Delivered" })
  }
  if(order.status === "cancelled"){
    return res.status(409).json({ status: FAIL, message: "Order already Cancelled" })
  }
  if (!order) {
    return res.status(404).json({ status: FAIL, message: "Order not found" });
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