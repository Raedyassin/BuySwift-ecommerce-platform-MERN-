import { Router } from "express";
import { authenticate, authorizeAdmin, ifAuthenticate } from '../middlewares/authMeddileware.js'
import checkID from "../middlewares/checkID.js";
import { uploadImageSettings }from "../utils/uploadImageSettings.js"
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
  fetchAllProducts,
  addProductComment,
  fetchHomeProducts,
  searchProduct,
  getRelatedProductsByCategory,
  fetchProductReviews,
  editProductComment,
  addOrUpdateProductRating,
} from "../controllers/product.controller.js";

const route = Router();

route.route("/")
  .post(authenticate, authorizeAdmin, uploadImageSettings(false), addProduct)

route.route("/products-list")
  .get(fetchAllProducts)
  route.route("/search")
  .get(searchProduct)
route.route("/home")
  .get(fetchHomeProducts)

route.route("/related/:id")
  .get(getRelatedProductsByCategory)

route.route("/:id")
  .put(authenticate, authorizeAdmin, checkID, uploadImageSettings(false), updateProduct)
  .delete(authenticate, authorizeAdmin, checkID, deleteProduct)
  .get(checkID, fetchProductById)

route.route("/:id/reviews")
  .post(authenticate, checkID, addProductComment)
  .get(ifAuthenticate, checkID, fetchProductReviews)

route.route("/:id/rating")
  .post(authenticate, checkID, addOrUpdateProductRating)

route.route("/reviewsedit/:id/:reviewId")
  .patch(authenticate, checkID, editProductComment)

export default route;