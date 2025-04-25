import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    default:-1,
  },
  comment:{
    type: String,
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
  // AVG rating
  rating: {
    type: Number,
    required: true,
    default:0
  },
  // i make allRating because i use rating in all project 
  // so i don't change all things because it will take a lot of time
  allRating: {
    type: Number,
    required: true,
    default:0
  },
  numRatings: {
    type: Number,
    required: true,
    default:0,
  },
  numComments: {
    type: Number,
    required: true,
    default:0,
  },
  price: {
    type: Number,
    required: true,
    default:0,
  },
  sold: {
    type: Number,
    required: true,
    default:0
  },
  originalPrice: {
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