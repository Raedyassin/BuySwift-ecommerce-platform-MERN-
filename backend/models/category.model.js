import mongoose from "mongoose";

const categorySchem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
    unique:true
  },
  creatorId: {
    type: String,
    required: true,
  }
}, { timestamps: true })

const Category = mongoose.model("Category", categorySchem);
export default Category;