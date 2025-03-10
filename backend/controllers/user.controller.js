import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import bycrypt from "bcryptjs"
import generateJWT from "../utils/createJWT.js";
import asyncHandler from "../middlewares/asyncHandler.js"



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
          isAdmin: newUser.isAdmin
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
            isAdmin: UserExist.isAdmin
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
  const users = await User.find();
  return res.status(200).json({ status: SUCCESS, data: { users } })
})

const updateCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const id  = req.user._id;
  
  const { username, email,password } = req.body;
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

export {
  createUser, loginUser, logoutUser, getAllUsers,
  updateCurrentUserProfile, getCurrentUserProfile,
  deleteUserByIdByAdmin, getUserByIdByAdmin,
  updateUserByIdByAdmin, deleteUserBySelf
}