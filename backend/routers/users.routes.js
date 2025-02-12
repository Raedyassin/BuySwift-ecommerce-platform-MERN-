import { Router } from "express";
import {
  createUser, loginUser, logoutUser, deleteUserBySelf,
  getAllUsers,
  updateCurrentUserProfile, getCurrentUserProfile,
  deleteUserByIdByAdmin, getUserByIdByAdmin,
  updateUserByIdByAdmin
} from "../controllers/user.controller.js";
import { authenticate, authorizeAdmin } from '../middlewares/authMeddileware.js'
const router = Router();

// user actions
router.route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers)
  .delete(authenticate, deleteUserBySelf)

router.post("/login", loginUser)

router.post("/logout", logoutUser)

router.route("/profile")
  .patch(authenticate, updateCurrentUserProfile)
  .get(authenticate, getCurrentUserProfile)

// admin actions
router.route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserByIdByAdmin)
  .get(authenticate, authorizeAdmin, getUserByIdByAdmin)
  .patch(authenticate, authorizeAdmin, updateUserByIdByAdmin)







export default router


