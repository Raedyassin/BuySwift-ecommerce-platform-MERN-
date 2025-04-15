import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMeddileware.js";
import cechkID from "../middlewares/checkID.js";
import {
  createOrder, getAllOrders, getUserOrders, getOrderDetails,
  markOrderAsPaidManual, markorderDeliver, markorderPacked, markorderTransit,
  cancleOrderByAdmin
} from "../controllers/order.controller.js";

const router = express.Router();


router.route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders)

router.get("/myorders", authenticate, getUserOrders)
router.get("/:id", authenticate, cechkID, getOrderDetails)

router.patch("/:id/pay", authenticate, authorizeAdmin, cechkID, markOrderAsPaidManual)
router.patch("/:id/packed", authenticate, authorizeAdmin, cechkID, markorderPacked)
router.patch("/:id/transited", authenticate, authorizeAdmin, cechkID, markorderTransit)
router.patch("/:id/delivered", authenticate, authorizeAdmin, cechkID, markorderDeliver)
// utill now i will make the admin only can cancel the order
router.patch("/:id/cancel", authenticate, authorizeAdmin, cechkID,cancleOrderByAdmin)


export default router;