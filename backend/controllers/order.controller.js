import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { json } from "express";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { calcTotalPrice } from '../utils/clacTotalPrice.js'

const createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (orderItems?.length === 0) {
    return res.status(400).json({ status: FAIL, message: "No order items" })
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map(x => x.productId) }
  })

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemsFromDB = itemsFromDB.find(
      item => item._id.toString() === itemFromClient.productId
    );

    if (!matchingItemsFromDB) {
      return res.status(404).json({
        status: FAIL, data: {
          title: "Product Not found",
          porduct: itemFromClient
        }
      })
    }
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

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createOrder = await order.save();
  res.status(201).json({
    status: SUCCESS,
    data: {
      order: createOrder
    }
  })



});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("user",'username email');
  res.status(200).json({ status: SUCCESS, data: { orders } })
})

const getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ status: SUCCESS, data: { orders } })
})

// i will create it but i thing may be they in front-end dont' use it
const getOrderDetails = asyncHandler(async (req, res, next) => {
  const {id} = req.params
  const order = await Order.findById(id).populate("user","username email");
  res.status(200).json({ status: SUCCESS, data: { order } })
})

const markOrderAsPaid = asyncHandler(async (req, res, next) => {
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
    status: req.body.status ,
    update_time: req.body.update_time,
    email_address: req.body?.payer?.email_address || "in test phase",
  }
  await order.save();
  res.json({ status: SUCCESS, data: {order} })
})

const markorderDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
  }
  if (order.isDelivered) {
    return res.status(409).json({ status: FAIL, data: { title: "Order already Delivered" } })
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.json({ status: SUCCESS, data: { order } })
})


export {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetails,
  markOrderAsPaid,
  markorderDeliver
}