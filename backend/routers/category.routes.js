import { Router } from "express";
import { authenticate,authorizeAdmin } from "../middlewares/authMeddileware.js";
import {
  createCategory,
  listCategories,
  updateCategory,
  getCategory,
  deleteCategory
} from "../controllers/category.controller.js";
const route = Router();

route.route("/")
  .post(authenticate, authorizeAdmin, createCategory)

route.get("/categories",listCategories)

route.route("/:id")
  .patch(authenticate, authorizeAdmin, updateCategory)
  .delete(authenticate, authorizeAdmin, deleteCategory)
  .get(getCategory)





export default route;