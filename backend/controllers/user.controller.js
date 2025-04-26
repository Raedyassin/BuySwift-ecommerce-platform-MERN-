import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import fs from "fs/promises";
import path from "path";
import bycrypt from "bcryptjs"
import generateJWT from "../utils/createJWT.js";
import asyncHandler from "../middlewares/asyncHandler.js"
import mongoose from "mongoose";


const createUser = asyncHandler(async (req, res, next) => {
  const { username, email, password, isAdmin } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(409).json({ status: FAIL, message: "Email already exists" })
  }
  const hashPassword = await bycrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    isAdmin: isAdmin === true
  });
  try {
    await newUser.save();
    generateJWT(res, newUser._id)
    return res.status(201).json({
      status: "success", data: {
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          img: newUser.img
        }
      }
    })
  } catch (err) {
    next(new AppError(400, FAIL, "Invalid data"))
  }
})

const loginUser = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  const UserExist = await User.findOne({ email });
  if (UserExist) {
    const passwordValid = await bycrypt.compare(password, UserExist.password)
    if (passwordValid) {
      generateJWT(res, UserExist._id);

      return res.status(200).json({
        status: SUCCESS, data: { 
          user: { 
            _id: UserExist._id,
            username: UserExist.username,
            email: UserExist.email,
            isAdmin: UserExist.isAdmin,
            img: UserExist.img
          }
        }
      });
    }
  }
  res.status(401).json({ status: FAIL, message: "Invalid email or password, Please try again" })
})

const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("jwt","", {
    httpOnly: true,
    secure: process.env.NODE_EMV !== "develpment",
    sameSite: "strict",
    expires: new Date(0)
  })
  return res.status(200).json({
    status: SUCCESS,
    data: null,
    message: "Logged out successfully"
  });
})

const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit) || 50;
  let { isAdmin, createdAt, email, name, id } = req.query;

  // the frontend sends undefined for empty fields this because i use query 
  // params to send data and send general case for empty fields
  if (email === "undefined") {
    email = "";
  }
  if (name === "undefined") {
    name = "";
  }
  if (id === "undefined") {
    id = "";
  }
  if (isAdmin === "undefined") {
    isAdmin = "";
  }
  if (createdAt === "undefined") {
    createdAt = "";
  }
  
  const skip = (page - 1) * pageSize;
  const filter = {};

  if (isAdmin && isAdmin !== "") {
    filter.isAdmin = isAdmin === "admin" ? true : false;
  }

  if (createdAt && createdAt !== "") {
    const [year, month, day] = createdAt.split("-"); // e.g., "2025-03-18"
    if (parseInt(year) < 2025 || (parseInt(year) <= 2025 && parseInt(month) < 2) || (parseInt(year) <= 2025 && parseInt(month) <= 3 && parseInt(day) < 5)) {
      return res.status(400).json({ status: "FAIL", data: { title: "this date is not valid" } });
    }
    const date = new Date(year, month - 1, day); // Month is 0-based
    filter.createdAt = {
      $gte: date,                // Start of day (e.g., 2025-03-18 00:00:00)
      $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Start of next day (2025-03-19 00:00:00)
    };
  } 
  // take selected fields value one only 
  if ((email && name) || (id && email) || (name && id)) {
    return res.status(400).json({ status: "FAIL", data: { title: "Invalid query parameters we only support one query at a time (email, name, id) one at a time" } });
  }

  if (email && email.trim() !== "") {
    filter.email = { $regex: email, $options: "i" };
  }
  if (name && name.trim() !== "") {
    filter.username = { $regex: name, $options: "i" };
  }
  if (id && id.trim() !== "") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "FAIL", message: "Invalid id"  });
    }
    filter._id = id;
  }
  
  const usersCount = await User.countDocuments(filter);
  const users = await User.find(filter)
  .select("-__v -updatedAt -password")
  .limit(pageSize + 1)
  .skip(skip)
  .sort({ createdAt: -1 });

  const hasNextPage = users.length > pageSize;
  if (hasNextPage) {
    users.pop();
  }
  res.status(200).json({
    status: SUCCESS,
    data: { users },
    currentPage: page,
    usersLength: usersCount,
    pageSize,
    hasNextPage,
    hasPrevPage: page > 1
  })

})

const updateCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const id  = req.user._id;
  const { username, email, password } = req.body;
  const user = await User.findById(id).select("-password -__v");
  if (user) {
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = await bycrypt.hash(password, 10);
    }
    try {
      await user.save();
      return res.status(200).json({ status: SUCCESS, data: { user } })
    } catch (err) {
      return next(new AppError(400, FAIL, "Email already exists"))
    }
  }
  res.status(404).json({ status: FAIL, message: "User not found" })
})

// update user image
const updateUserImage = asyncHandler(async (req, res, next) => {
  const id = req.user._id; // From authenticate middleware
  const user = await User.findById(id).select("-password -__v -updatedAt -createdAt");

  const imageUrl = "uploads/user/" + req.file.filename  // From upload route response
  if (!req?.file?.filename) {
    return res.status(400).json({ status: FAIL, message: "No image provided" });
  }

  if (!user) {
    // should delete the image here
    await fs.unlink(path.join(process.cwd(), imageUrl));
    return res.status(404).json({ status: FAIL, message: "User not found" });
  }

  // Delete old image if it exists
  if (user.img && user.img.split("/").pop() !== "defaultImage.png") {
    const oldImagePath = path.join(process.cwd(), "uploads/user/" +user.img.split("/").pop());
    try {
      await fs.unlink(oldImagePath);
    } catch (err) {
      return res.status(500).json({ status: FAIL, message: "Server error" });
    }
  }
  user.img = imageUrl;  
  await user.save();

  res.status(200).json({ status: SUCCESS, data: { user } });
})

const getCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ status: SUCCESS, data: { user } })
})

const deleteUserBySelf = asyncHandler(async (req, res, next) => {
  if (req.user.isAdmin) {
    return next(new AppError(400, FAIL, "Can't delete admin user"))
  }
  await User.deleteOne({ _id: req.user._id });
  return res.status(200).json({ status: SUCCESS, data: null })
})

/// Admin actions
const deleteUserByIdByAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      return next(new AppError(400, FAIL, "Can't delete admin user"))
    }
    await User.deleteOne({ _id: user._id });
    return res.status(200).json({ status: SUCCESS, data: null })
  }
  res.status(404).json({ status: FAIL, message: "User not found" })
})

const getUserByIdByAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  if (user) {
    return res.status(200).json({ status: SUCCESS, data: { user } })
  }
  next(new AppError(404, FAIL, "User not found"));
})

const updateUserByIdByAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  if (user) {
    if (user.isAdmin) {
      return next(new AppError(400, FAIL, "Can't update admin user"))
    }
    if(user.email === req.body.email) {
      return next(new AppError(400, FAIL, "Email already exists"))
    }
    if(user.username === req.body.username) {
      return next(new AppError(400, FAIL, "Username already exists"))
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, req.body).select("-password -__v");
      return res.status(200).json({ status: SUCCESS, data: { updatedUser } })
    } catch (err) {
      return next(new AppError(400, FAIL, "Email already exists"))
    }
  }
  next(new AppError(404, FAIL, "User not found"))
})  

const makeAsAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  if(user?.isAdmin) {
    return next(new AppError(400, FAIL, "User is already admin"))
  }
  if (user) {
    user.isAdmin = true;
    await user.save();
    return res.status(200).json({ status: SUCCESS, data: { user } })
  }
  next(new AppError(404, FAIL, "User not found"))
})

export {
  createUser, loginUser, logoutUser, getAllUsers,
  updateCurrentUserProfile, getCurrentUserProfile,
  deleteUserByIdByAdmin, getUserByIdByAdmin,
  updateUserByIdByAdmin, deleteUserBySelf,
  makeAsAdmin, updateUserImage
}