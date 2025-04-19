import mongoose from "mongoose";


// i created this model to store the order items and the info about the order
// when the user is chose to pay with paypal
// so when the use is initiated the order this model will be created
// to store the data(ordersItems, shippingAddress , prices) so when caputer process
// i can't found this info becuase id don't make the order in the initial state
// i prefer create it in caputer phase so i create it to sotre teh data in initial phase
// then delete it when the caputer process is done
const tempPaypalOrderSchema = new mongoose.Schema({
  paypalOrderId: {
    type: String,
    required: true
  },
  orderItems: [
    {
      quantity: { type: Number, required: true },
      product: {
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
}, { timestamps: true });


const TempPaypalOrder = mongoose.model("TempPaypalOrder", tempPaypalOrderSchema);
export default TempPaypalOrder;