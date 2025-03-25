import { Router } from "express";
import formidable from 'express-formidable'
import { authenticate, authorizeAdmin, ifAuthenticate } from '../middlewares/authMeddileware.js'
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
  filterProduct,
  getRelatedProductsByCategory,
  fetchProductReviews,
  editProductReview,
  addOrUpdateProductRating,
  // editProductRating,
  clearReviews
} from "../controllers/product.controller.js";

const route = Router();

route.route("/")
  .post(authenticate, authorizeAdmin, formidable(), addProduct)
  .get(fechProducts)

route.route("/allproducts")
  .get(fetchAllProducts)
route.route("/top")
  .get(fetchTopProducts)
route.route("/new")
  .get(fetchnewProducts)
route.route("/filter-products")
  .post(filterProduct)
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

// route.route("/ratingsedit/:id/:reviewId")
//   .patch(authenticate, checkID, editProductRating)

route.route("/clear").get(clearReviews);
export default route;