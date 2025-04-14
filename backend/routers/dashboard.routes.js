import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authenticate,authorizeAdmin } from "../middlewares/authMeddileware.js"; 

const router = express.Router();

router.get("/", authenticate, authorizeAdmin, getDashboardData);

export default router;