import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import User from "../models/user.model.js"
import AppError from "../utils/appError.js";
import { ERROR, FAIL } from "../utils/httpStatucText.js";


const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const tokenDecrypt = jwt.verify(token, process.env.JWT_SEKRYT);
      req.user = await User.findById(tokenDecrypt.userId).select("-password -createdAt -updatedAt -__v");
      return next()
    } catch (err) {
      return next(new AppError(401, FAIL, "Not authorized, token invalid."));
    }
  }
  next(new AppError(401,FAIL,"Not authorized, token is require."))
})

// check if user is authenticated for routes that don't require authentication
// i make it to add user in req.user to help me in some routes that show details
// for user that is authenticated to hellp me 
const ifAuthenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const tokenDecrypt = jwt.verify(token, process.env.JWT_SEKRYT);
      req.user = await User.findById(tokenDecrypt.userId).select("-password -createdAt -updatedAt -__v");
      return next()
    } catch (err) {
      return next(new AppError(500, ERROR, "Internal server error."));
    }
  }
  next()
})

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.isAdmin) {
    return next();
  }
  next(new AppError(401, FAIL, "Not authorized access."))
})

export { authenticate, authorizeAdmin, ifAuthenticate };