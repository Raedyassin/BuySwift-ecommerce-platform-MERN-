import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  img: {
    type: String,
    default:'../uploads/user/defaultImage.png'
  },
  rating: {
    type: Number,
    // required: true,
    default:-1,
  },
  comment:{
    type: String,
    // required:true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
  },
},{ timestamps: true })


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
  },
  img: {
    type: String,
    required:true,
  },
  brand: {
    type: String,
    required:true,    
  },
  quantity: {
    type: Number,
    required:true
  },
  category: {
    type: ObjectId,
    ref: "Category",
    required:true,
  },
  discription: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    required: true,
    default:0
  },
  numReview: {
    type: Number,
    required: true,
    default:0,
  },
  price: {
    type: Number,
    required: true,
    default:0,
  },
  discount: {
    type: Number,
    default:0,
  },
},{timestamps:true})

export default mongoose.model("Product", productSchema);