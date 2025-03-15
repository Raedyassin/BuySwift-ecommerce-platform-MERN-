import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMeddileware.js";
import cechkID from "../middlewares/checkID.js";
import {
  payPalPayment,
  paypalConfig,
  capturePayPalPayment
} from "../controllers/payment.controller.js";

const router = express.Router();

router.route("/paypal/:id")
.post(authenticate, cechkID, payPalPayment)

router.post("/paypal/:id/capture",authenticate,cechkID, capturePayPalPayment)

router.get('/paypal/config', paypalConfig)

export default router;
