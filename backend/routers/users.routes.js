import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  deleteUserBySelf,
  getAllUsers,
  updateCurrentUserProfile,
  getCurrentUserProfile,
  deleteUserByIdByAdmin,
  getUserByIdByAdmin,
  updateUserByIdByAdmin,
  makeAsAdmin,
  updateUserImage,
} from "../controllers/user.controller.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMeddileware.js";
import ckekID from "../middlewares/checkID.js";
import { uploadImageSettings } from "../utils/uploadImageSettings.js";
const router = Router();

// User actions
router.route("/").post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers)
  .delete(authenticate, deleteUserBySelf);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/profile")
  .patch(authenticate, updateCurrentUserProfile)
  .get(authenticate, getCurrentUserProfile);

// Update user image
router.post("/profile/img", authenticate, uploadImageSettings(true), updateUserImage);
// Admin actions
router.route("/:id/admin").patch(authenticate, authorizeAdmin, ckekID, makeAsAdmin);
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserByIdByAdmin)
  .get(authenticate, authorizeAdmin, getUserByIdByAdmin)
  .patch(authenticate, authorizeAdmin, updateUserByIdByAdmin);

export default router;