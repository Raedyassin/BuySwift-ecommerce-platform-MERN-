import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMeddileware.js";
import cechkID from "../middlewares/checkID.js";
import {
  intializePayPalPayment,
  paypalConfig,
  capturePayPalPayment
} from "../controllers/paypalPayment.controller.js";

const router = express.Router();

router.route("/paypal")
.post(authenticate, intializePayPalPayment)

router.post("/paypal/capture",authenticate, capturePayPalPayment)

router.get('/paypal/config', paypalConfig)

export default router;
