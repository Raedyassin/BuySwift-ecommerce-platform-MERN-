import Order from "../models/order.model.js";
import TempPaypalOrder from "../models/tempPaypalOrder.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ERROR, FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { generateAccessToken } from '../utils/PayPalAccessToken.js'
import axios from 'axios'
import { calcTotalPrice } from "../utils/clacTotalPrice.js";
import productsIsFound from "../utils/productsIsFound.js"
import { reduceQuantity, increaseQuantity } from "../utils/changeQuantity.js";

const paypalConfig = asyncHandler(async (req, res, next) => {
  res.send({ status: SUCCESS, data: { clientId: process.env.PAYPAL_CLIENT_ID } })
})

const intializePayPalPayment = asyncHandler(async (req, res, next) => {

  const { order } = req.body;
  if (!order) {
    return res.status(404).json({ status: FAIL, message: "You should pass an order" });
  }

  const { orderItems, shippingAddress } = order;

  // Check if the order items exist
  const dbOrderItems = await productsIsFound(res, orderItems);
  if (!dbOrderItems) return;

  const {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = calcTotalPrice(dbOrderItems)

  // Reduce Quantity if the quantity of the oreder is available
  // the items will reduce from db temporarily untill the payment is done
  const reducesQuantitySuccess = await reduceQuantity(res,dbOrderItems);
  if (!reducesQuantitySuccess) return;

  try {
    const accessToken = await generateAccessToken();
    const paypalResponse = await axios.post(
      `${process.env.BASE_PAYPAL_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: totalPrice.toString(), // Ensure string for PayPal API
              breakdown: {
                item_total: { currency_code: "USD", value: itemsPrice.toString() },
                shipping: { currency_code: "USD", value: shippingPrice.toString() },
                tax_total: { currency_code: "USD", value: taxPrice.toString() },
              },
            },
            items: dbOrderItems.map((item) => ({
              name: item.name.slice(0, 127),
              quantity: item.quantity.toString(), // PayPal expects string
              unit_amount: {
                currency_code: "USD",
                value: item.price.toString(), // Use price, not taxPrice
              },
              id: item._id.toString(),
            })),
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const tempPaypalOrder = new TempPaypalOrder({
      paypalOrderId: paypalResponse.data.id,
      orderItems: dbOrderItems.map((item) => ({
        quantity: item.quantity,
        product: item._id,
      })),
      shippingAddress,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    await tempPaypalOrder.save();

    return res.json({
      status: SUCCESS,
      data: {
        paypalOrderId: paypalResponse.data.id, // For frontend PayPalButtons
      },
    });
  } catch (error) {
    console.error("PayPal API Error:", error.response?.data || error.message);
    
    // Increase Quantity that we reduced it when we created the order if there is an error
    await increaseQuantity(dbOrderItems);

    return res.status(500).json({
      status: ERROR,
      message: "Failed to create PayPal order",
      error: error.response?.data || error.message,
    });
  }
})

const capturePayPalPayment = asyncHandler(async (req, res, next) => {
  const { paypalOrderId } = req.body; // Sent from frontend after approval

  try {
    const accessToken = await generateAccessToken();
    const captureResponse = await axios.post(
      `${process.env.BASE_PAYPAL_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const tempOrder = await TempPaypalOrder.findOne({ paypalOrderId });
    if (!tempOrder) {
      return res.status(404).json({
        status: FAIL,
        message: 'Order not found, maybe you don',
      });
    }

    const order = new Order({
      orderItems: tempOrder.orderItems,
      shippingAddress: tempOrder.shippingAddress,
      itemsPrice: tempOrder.itemsPrice,
      shippingPrice: tempOrder.shippingPrice,
      taxPrice: tempOrder.taxPrice,
      totalPrice: tempOrder.totalPrice,
      user: req.user._id,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethod: 'PayPal',
      paymentResult: {
        id: captureResponse.data.id,
        status: captureResponse.data.status,
        update_time: captureResponse.data.update_time,
        email_address: captureResponse.data.payer.email_address,
      },
    });

    await TempPaypalOrder.deleteOne({ _id: tempOrder._id });
    await order.save();



    return res.status(201).json({
      status: SUCCESS,
      data: { message: 'Payment captured successfully' },
    });
  } catch (error) {
    console.error('Capture Error:', error.response?.data || error.message);
    return res.status(500).json({
      status: FAIL,
      message: 'Failed to capture payment',
      error: error.response?.data || error.message,
    });
  }
})


export { intializePayPalPayment, paypalConfig, capturePayPalPayment }