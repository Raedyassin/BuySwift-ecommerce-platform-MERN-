import { Router } from "express";
import formidable from 'express-formidable'
import { authenticate, authorizeAdmin } from '../middlewares/authMeddileware.js'
import checkID from "../middlewares/checkID.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fechProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchnewProducts,
  filterProduct
} from "../controllers/product.controller.js";

const route = Router();

route.route("/")
  .get(fechProducts)
  .post(authenticate, authorizeAdmin, formidable(), addProduct)

route.route("/allproducts")
  .get(fetchAllProducts)

route.route("/top")
  .get(fetchTopProducts)
route.route("/new")
  .get(fetchnewProducts)

route.route("/:id")
  .put(authenticate, authorizeAdmin,checkID,formidable(),updateProduct)
  .delete(authenticate, authorizeAdmin, checkID, deleteProduct)
  .get(checkID, fetchProductById)

route.route("/:id/reviews")
  .post(authenticate, checkID, addProductReview)


route.route("/filter-products").post(filterProduct)






export default route;