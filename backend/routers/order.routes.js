import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMeddileware.js";
import cechkID from "../middlewares/checkID.js";
import {
  createOrder, getAllOrders, getUserOrders, getOrderDetails,
  markOrderAsPaid, markorderDeliver
} from "../controllers/order.controller.js";

const router = express.Router();


router.route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders)

router.get("/:id", authenticate, cechkID, getOrderDetails)
router.patch("/:id/pay", authenticate, cechkID, markOrderAsPaid)
router.patch("/:id/deliver", authenticate, authorizeAdmin, cechkID, markorderDeliver)

router.get("/myorders", authenticate, getUserOrders)
export default router;