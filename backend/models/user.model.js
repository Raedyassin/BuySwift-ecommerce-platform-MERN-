import { Schema, model } from "mongoose";

const UserShema = new Schema({  
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  img: {
    type: String,
    default:'uploads/user/defaultImage.png'
  }
},{timestamps:true})

const User = model("User", UserShema);
export default User;