import Product from "../models/product.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { minMaxConvertFromString } from "../utils/min-max-convertFromString.js";
import mongoose from "mongoose";

const addProduct = asyncHandler(
  async (req, res, next) => {
    const { name, discription, countInStock, price, brand, quantity, category } = req.fields;
    switch (true) {
      case !countInStock:
        return res.status(400).json({ status: FAIL, message: "count In Stock is required" })
      case !name:
        return res.status(400).json({ status: FAIL, message: "Name is required" })
      case !discription:
        return res.status(400).json({ status: FAIL, message: "Discription is required" })
      case !price:
        return res.status(400).json({ status: FAIL, message: "Price is required" })
      case !brand:
        return res.status(400).json({ status: FAIL, message: "Brand is required" })
      case !quantity:
        return res.status(400).json({ status: FAIL, message: "Quantity is required" })
      case !category:
        return res.status(400).json({ status: FAIL, message: "Category is required" })
    }
    const product = new Product({ name, countInStock, discription, price, brand, quantity, category })
    product.img = "uploads/" + req.fields.img;
    await product.save();
    res.json({ status: SUCCESS, data: { product } })
  }
)

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, discription, price, countInStock, brand, quantity, category, img } = req.fields;
  switch (true) {
    case !name:
      return res.status(400).json({ status: FAIL, message: "Name is required" })
    case !discription:
      return res.status(400).json({ status: FAIL, message: "Discription is required" })
    case !price:
      return res.status(400).json({ status: FAIL, message: "Price is required" })
    case !brand:
      return res.status(400).json({ status: FAIL, message: "Brand is required" })
    case !quantity:
      return res.status(400).json({ status: FAIL, message: "Quantity is required" })
    case !category:
      return res.status(400).json({ status: FAIL, message: "Category is required" })
    case !img:
      return res.status(400).json({ status: FAIL, message: "Img is required" })
    case !countInStock:
      return res.status(400).json({ status: FAIL, message: "countInStock is required" })
  }

  const product = await Product.findByIdAndUpdate(id, { name, discription, price, countInStock, brand, quantity, category, img: ("uploads/" + img) });
  if (!product) {
    return res.status(404).json({ status: "FAIL", message: "Product not found" });
  }


  await product.save();
  res.json({ status: "SUCCESS", data: { product } });
});

const deleteProduct = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: "FAIL", message: "Product not found" });
    }
    await product.deleteOne();
    res.json({ status: "SUCCESS", data: null });
  }
)

const fetchProductById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    let product = await Product.findById(id).select("-reviews -__v");
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" })
    }
    res.json({ status: SUCCESS, data: { product } })
  }
)

const getRelatedProductsByCategory = asyncHandler(
  async (req, res, next) => {
    // get the product id from frontend and send realted products by category
    const page = 1;
    const pageSize = 15;
    const skip = (page - 1) * pageSize;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" })
    }

    let relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id } // Exclude the current product
    }).sort({ rating: -1 })
      .limit(pageSize + 1)
      .skip(skip)
      .select("-__v -updatedAt -createdAt -creatorId -reviews -countInStock -numReview  -discription -quantity");

    // this is should delete after testing phase i put it to test only 
    // start{
    if (relatedProducts.length < 6) {
      const plusProducts = await Product.find().sort({ rating: -1 }).
        limit(10).
        select("-__v -updatedAt -createdAt -creatorId -reviews -countInStock -numReview  -discription -quantity")
      relatedProducts = [...relatedProducts, ...plusProducts]
    }
    // end}

    const hasNextPage = relatedProducts.length > pageSize;
    if (hasNextPage) {
      relatedProducts.pop();
    }

    res.status(200).json({
      status: SUCCESS,
      data: { products: relatedProducts },
      currentPage: page,
      productsLength: relatedProducts.length,
      pageSize,
      hasNextPage,
      hasPrevPage: page > 1
    })
  }
)

/**************************
 * *** Product Reviews ****
 * ************************
**/
const fetchProductReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const page = req.query.page ? +req.query.page : 1;
  const pageSize = req.query.limit ? (+req.query.limit > 50 ? 50 : +req.query.limit) : 10; // make the page size configurable
  const skip = (page - 1) * pageSize;

  let product = await Product.findById(id).select("reviews"); // Only fetch reviews field to optimize

  if (!product) {
    return res.status(404).json({ status: FAIL, message: "Product not found" });
  }

  product.reviews = product.reviews.filter(review => review.rating !== -1);

  // if (product.reviews.length === 0) {
  //   return res.status(404).json({ status: FAIL, message: "Product has no reviews" });
  // }

  let filteredReviews = product.reviews || [];
  let plusOne = 0;
  if (page === 1 && req.user) {
    let ourReview = {};
    filteredReviews = product.reviews.
      filter(review => {
        if (review.user.toString() === req.user._id.toString()) {
          ourReview = review;
          return false;
        }
        return true;
      });
    if (filteredReviews.length !== product.reviews.length) {
      plusOne = 1;
      filteredReviews = [ourReview, ...filteredReviews];
    }
  }

  const totalReviews = product.reviews.length;

  let paginatedReviews = filteredReviews.slice(skip, skip + pageSize + plusOne);
  if (page !== 1) {
    paginatedReviews = paginatedReviews.filter(review => {
      return review.user.toString() !== req.user._id.toString();
    })
  }
  const totalPages = Math.ceil(totalReviews / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json({
    status: SUCCESS,
    data: {
      reviews: paginatedReviews,
    },
    currentPage: page,
    pageSize,
    totalReviews,
    totalPages,
    hasNextPage,
    hasPrevPage,
  });
});

const editProductReview = asyncHandler(async (req, res, next) => {
  const { id, reviewId } = req.params; // id is the product id
  const { comment } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ status: FAIL, message: "Product not found" });
  }
  const review = product.reviews.find(review => review._id.toString() === reviewId);
  if (!review || !review?.comment) {
    return res.status(404).json({ status: FAIL, message: "Review not found" });
  }
  review.comment = comment;
  review.img = req.user.img;
  review.name = req.user.username
  await product.save();
  res.json({ status: SUCCESS, data: { review } });
});

const addProductReview = asyncHandler(
  async (req, res, next) => {
    const { comment } = req.body;
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" });
    }
    let alreadyIndex = -1;
    const alreadyReviewed = product.reviews.find(
      (r, index) => {
        if (r.user.toString() === req.user._id.toString()) {
          alreadyIndex = index;
          return true
        }
        return false;
      });
    if (alreadyReviewed?.comment) {
      return res.status(400).json({ status: FAIL, message: "Product already reviewed" })
    }
    if (alreadyIndex !== -1) { // that mean the user is make comment in this product before
      product.reviews[alreadyIndex] = {
        ...product.reviews[alreadyIndex],
        comment,
        rating: product.reviews[alreadyIndex].rating,
        name: req.user.username,
        img: req.user.img,
        user: req.user._id,
      }
    } else {
      const review = {
        comment,
        name: req.user.username,
        img: req.user.img,
        user: req.user._id,
      }
      product.reviews.push(review)
    }

    product.numReview = product.reviews.length;

    await product.save();
    let sendingReview = {};
    if (alreadyIndex !== -1) {
      sendingReview = product.reviews[alreadyIndex].toObject();
    } else {
      sendingReview = product.reviews.at(-1).toObject(); // because it will return all Mongoose Document object search on it 
    }

    res.status(201).json({
      status: SUCCESS, data:
      {
        review: sendingReview
      }
    })
  }
);

const addOrUpdateProductRating = asyncHandler(
  async (req, res, next) => {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" });
    }
    let alreadyIndex = -1;
    const alreadyRating = product.reviews.
      find((r, index) => {
        if (r.user.toString() === req.user._id.toString()) {
          alreadyIndex = index;
          return true;
        }
        return false;
      });
    // if (alreadyRating?.rating !== undefined && alreadyRating?.rating !== -1) {
    //   return res.status(400).json({ status: FAIL, message: "Product already rating" })
    // }
    if (isNaN(rating) || !(+rating >= 0 && +rating <= 5)) {
      return res.status(400).json({ status: FAIL, message: "the rating should be number between 0 and 5" })
    }

    if (alreadyIndex !== -1) { // that mean the user is make comment in this product before
      product.reviews[alreadyIndex] = {
        ...product.reviews[alreadyIndex],
        comment: product.reviews[alreadyIndex].comment,
        rating: +rating,
        name: req.user.username,
        img: req.user.img,
        user: req.user._id,
      }
    } else {
      const review = {
        rating: +rating,
        name: req.user.username,
        img: req.user.img,
        user: req.user._id,
      }
      product.reviews.push(review)
    }
    product.numReview = product.reviews.length;

    // it is not correct but form performance but correct forom logic and i will add it
    // untill now and update the performance
    product.rating = product.reviews.reduce((acc, review) => {
      if (review.rating === -1) {
        return acc;
      }
      return review.rating + acc;
    }, 0) / product.reviews.length;
    await product.save();
    let sendingReview = {};
    if (alreadyIndex !== -1) {
      sendingReview = product.reviews[alreadyIndex].toObject();
    } else {
      sendingReview = product.reviews.at(-1).toObject(); // because it will return all Mongoose Document object search on it 
    }

    res.status(201).json({ status: SUCCESS, data: { review: sendingReview } })
  }
);

/**********************
 * Product filter ****
 * ********************
**/

// query params
// { page, limit, createdAt, id, name, brand, category, price, quantity, stock }
const fetchAllProducts = asyncHandler(
  async (req, res, next) => {
    const pageSize = req.query.limit >= 50 ? 50 : +req.query.limit || 50;
    const page = (req.query.page ? +req.query.page : 1) || 1;

    // { page, limit, createdAt, id, name, brand, category, price, rating, stock }
    let { createdAt, id, name, brand, category, price, rating, stock } = req.query;

    // the udefind send as a string so it is go as a string 
    if (createdAt === "undefined") {
      createdAt = "";
    }
    if (name === "undefined") {
      name = "";
    }
    if (id === "undefined") {
      id = "";
    }
    if (brand === "undefined") {
      brand = "";
    }
    if (category === "undefined") {
      category = "";
    }
    if (price === "undefined") {
      price = "";
    }
    if (rating === "undefined") {
      rating = "";
    }
    if (stock === "undefined") {
      stock = "";
    }

    let filter = {};
    if (createdAt && createdAt?.trim() !== "") {
      const [year, month, day] = createdAt.split("-"); // e.g., "2025-03-18"
      if (parseInt(year) < 2025 || (parseInt(year) <= 2025 && parseInt(month) < 2) || (parseInt(year) <= 2025 && parseInt(month) <= 3 && parseInt(day) < 5)) {
        return res.status(400).json({ status: "FAIL", data: { title: "this date is not valid" } });
      }
      const date = new Date(year, month - 1, day); // Month is 0-based
      filter.createdAt = {
        $gte: date,                // Start of day (e.g., 2025-03-18 00:00:00)
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Start of next day (2025-03-19 00:00:00)
      };
    }
    if (name && name?.trim() !== "") {
      filter.name = { $regex: name, $options: "i" };
    }
    if (id && id.trim() !== "") {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: "FAIL", message: "Invalid id" });
      }
      filter._id = id;
    }
    if (brand && brand.trim() !== "") {
      filter.brand = { $regex: brand, $options: "i" };
    }
    if (category && category.trim() !== "") {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ status: "FAIL", message: "Invalid category" });
      }
      filter.category = { $eq: category };
    }
    if (rating && rating.trim() !== "") {
      if (isNaN(rating) || !(+rating >= 0 && +rating <= 5)) {
        return res.status(400).json({ status: FAIL, message: "the rating should be number between 0 and 5" })
      }
      filter.rating = { $gte: +rating };
    }
    if (price && price.trim() !== "") {
      filter.price = minMaxConvertFromString(res, price, "-");
    }
    if (stock && stock !== "") {
      filter.countInStock = minMaxConvertFromString(res, stock, "-")
    }


    const productsCount = await Product.countDocuments(filter);
    const products = await Product.find(filter).populate("category",
      "-updatedAt -createdAt -creatorId -__v")
      .sort({ createdAt: -1 })
      .limit(pageSize + 1)
      .skip((page - 1) * pageSize)
      .select("-updatedAt -__v -reviews");

    let hasNextPage = false;
    if (products.length > pageSize) {
      hasNextPage = true;
      products.pop();
    }

    res.json({
      status: SUCCESS,
      data: {
        products,
      },
      page,
      pageSize,
      productsLength: productsCount,
      hasPrevPage: page > 1,
      hasNextPage
    })
  }
)

const fetchTopProducts = asyncHandler(
  async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const pageSize = 10;
    const products = await Product.find().sort({ rating: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    res.json({
      status: SUCCESS,
      data: {
        products,
        page
      }
    })
  }
)

const fetchnewProducts = asyncHandler(
  async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const pageSize = 10;
    const products = await Product.find().sort({ _id: -1 })
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    res.json({
      status: SUCCESS,
      data: {
        products,
        page
      }
    })
  }
)

// the differ between fetchAllProducts is i don't wanna change searchProduct logic
// because i make it befor and i don't want to change it
const searchProduct = asyncHandler(
  async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const pageSize = req.query.limit ? (+req.query.limit > 50 ? 50 : +req.query.limit) : 10;
    let searchName = req.query.searchName?.trim();
    const categoriesID = req.query.cateogries?.split(',') || []; 
    const price = req.query.price?.split(',').map(value => +value) || []; 
    let args = {};

    // validation
    if (searchName === "undefined" || searchName === "" || searchName === null || searchName === undefined) {
      searchName = "";
    }
    if (searchName !== "") {
      // clear extra spaces that insed the searchValue
      searchName = searchName.split(" ");      
      searchName = searchName.reduce((acc,word ) => {
        if(word === "") {
          return acc;
        } else {
          return `${acc} ${word}`
        }
      }, "");
      args.name = { $regex: searchName.trim(), $options: "i" }
    }
    if (req.query.cateogries !== "" && req.query.cateogries !== "undefined" && categoriesID.length > 0) {
      const validCategoryIds = categoriesID.filter(id =>mongoose.Types.ObjectId.isValid(id));
      if (validCategoryIds.length !== categoriesID.length) {
        return res.status(400).json({ status: FAIL, message: "The category id is not structured correctly" });
      }
      args.category = {
        $in: validCategoryIds
      };
    }
    if (req.query.price.trim() !== "" && req.query.price.trim() !== "undefined" && price.length === 1) {
      args.price = { $eq: price[0] }
    } else if (price.length === 2) {
      args.price = { $gte: price[0], $lte: price[1] }
    } else if (price.length > 2) {
      return res.status(400).json({ status: FAIL, message: "the price should be start or start-end" })
    }
    const products = await Product.find(args)
      .limit(pageSize + 1)
      .skip((page - 1) * pageSize)
      .sort({ createdAt: -1 })
      .select("-updatedAt -__v -reviews -creatorId -quantity -countInStock -category -numReview" );

    const hasNextPage = products.length > pageSize;
    if (hasNextPage) {
      products.pop();
    }
    res.json({
      status: SUCCESS,
      data: {
        products
      },
      currentPage: page,
      pageSize,
      hasPrevPage: page > 1,
      hasNextPage
    })
  }
)


export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchnewProducts,
  searchProduct,
  getRelatedProductsByCategory,
  fetchProductReviews,
  editProductReview,
  addOrUpdateProductRating,
}