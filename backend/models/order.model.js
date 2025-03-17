import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["pending", "delivered", 'ontheroute',"packed", "cancelled"],
    default: "pending"
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      brand: {
        type: String,
        required: true,
      },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
      }
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    firstPhone: { type: String, required: true },
    secondPhone: { type: String },
  },

  paymentMethod: {
    type: String,
    required: true,
  },
  orderProgress: {
    packedAt: {
      type: Date
    },
    transitAt: {
      type: Date
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  paymentResult: {
    // the id for transaction of paypal
    id: { type: String },
    // ther are three status COMPLETED PENDING DECLINED
    status: { type: String },
    update_time: { type: String },
    // email address of the payer
    email_address: { type: String },
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date,
  },
}, { timestamps: true });


const Order = mongoose.model("Order", orderSchema);
export default Order;