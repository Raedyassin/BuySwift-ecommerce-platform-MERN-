import Order from "../models/order.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { ERROR, FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { generateAccessToken } from '../utils/PayPalAccessToken.js'
import axios from 'axios'

  const payPalPayment = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    console.log(order);
    
    if (!order) {
      return res.status(404).json({ status: FAIL, data: { title: "Order not found" } });
    }

    if (order.isPaid) { 
      return res.status(409).json({ status: FAIL, message: "Order already paid" });
    }

    if(order.paymentMethod !== "PayPal") {
      return res.status(400).json({ status: FAIL, message: "Order payment method is not PayPal" });
    }

    try {
      const { orderItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = order;
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
              items: orderItems.map((item) => ({
                name: item.name,
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

      return res.json({
        status: SUCCESS,
        data: {
          paypalOrderId: paypalResponse.data.id, // For frontend PayPalButtons
        },
      });
    } catch (error) {
      console.error("PayPal API Error:", error.response?.data || error.message);
      return res.status(500).json({
        status: ERROR,
        message: "Failed to create PayPal order",
        error: error.response?.data || error.message,
      });
    }


  })

  const paypalConfig = asyncHandler(async (req, res, next) => {
    res.send({ status: SUCCESS, data: { clientId: process.env.PAYPAL_CLIENT_ID } })
  })

  const capturePayPalPayment = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const { paypalOrderId } = req.body; // Sent from frontend after approval
    console.log("paypalOrderId", paypalOrderId);
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ status: 'FAIL', data: { title: 'Order not found' } });
    }

    if (order.isPaid) {
      return res.status(409).json({ status: 'FAIL', message: 'Order already paid' });
    }

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

      // Update order in MongoDB
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: captureResponse.data.id,
        status: captureResponse.data.status,
        update_time: captureResponse.data.update_time,
        email_address: captureResponse.data.payer.email_address,
      };
      await order.save();

      return res.status(200).json({
        status: SUCCESS,
        data: { message: 'Payment captured successfully', order },
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


export { payPalPayment, paypalConfig, capturePayPalPayment }