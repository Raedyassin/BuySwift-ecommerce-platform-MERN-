import { Router } from "express";
import formidable from 'express-formidable'
import { authenticate, authorizeAdmin, ifAuthenticate } from '../middlewares/authMeddileware.js'
import checkID from "../middlewares/checkID.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchHomeProducts,
  searchProduct,
  getRelatedProductsByCategory,
  fetchProductReviews,
  editProductReview,
  addOrUpdateProductRating,
} from "../controllers/product.controller.js";

const route = Router();

route.route("/")
  .post(authenticate, authorizeAdmin, formidable(), addProduct)

route.route("/products-list")
  .get(fetchAllProducts)
  route.route("/search")
  .get(searchProduct)
route.route("/home")
  .get(fetchHomeProducts)


route.route("/related/:id")
  .get(getRelatedProductsByCategory)

route.route("/:id")
  .put(authenticate, authorizeAdmin, checkID, formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, checkID, deleteProduct)
  .get(checkID, fetchProductById)

route.route("/:id/reviews")
  .post(authenticate, checkID, addProductReview)
  .get(ifAuthenticate, checkID, fetchProductReviews)

route.route("/:id/rating")
  .post(authenticate, checkID, addOrUpdateProductRating)

route.route("/reviewsedit/:id/:reviewId")
  .patch(authenticate, checkID, editProductReview)

export default route;