import Product from "../models/product.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import { minMaxConvertFromString } from "../utils/min-max-convertFromString.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

const addProduct = asyncHandler(
  async (req, res, next) => {
    let { name, discription, price, brand, quantity, category, discount } = req?.body;
    const imageUrl = "uploads/" + req.file.filename
    const error = async(message) => {
      res.status(400).json({ status: FAIL, message})
      await fs.unlink(path.join(process.cwd(), imageUrl));
    }
    switch (true) {
      case !req?.file?.filename:
        return res.status(400).json({ status: FAIL, message: "Image is required" })
      case !req.body:
        return error("All fields are required") 
      case !name:
        return error("Name is required") 
      case !discription:
        return error("Discription is required") 
      case !price:
        return error("Price is required") 
      case !brand:
        return error("Brand is required") 
      case !quantity:
        return error("Quantity is required") 
      case !category:
        return error("Category is required") 
    }
    if (isNaN(price)) return error("Price should be number") ;
    if (isNaN(quantity)) return error("Quantity should be number") ;
    if (price <= 0) return error("Price should be greater than 0") ;
    if (quantity <= 0) return error("Quantity should be greater than 0") ;
    if (discount && isNaN(discount)) return error("Discount should be number") ;
    if (discount && (discount > 100 || discount < 0)) return error("Discount should be between 0 and 100") ;
    // after i add discount and all thing use price so i will add originalPrice 
    // that have price wtihout discount and the price will be the price with discount
    // i name this name becasue i use price in all thing(order and product) so i will add originalPrice
    price = Number(price);
    let originalPrice = price.toFixed(2);
    if (+discount > 0) {
      price = +(+originalPrice * (1 - discount / 100)).toFixed(2);
    }

    const product = new Product({
      name, discription,
      originalPrice,
      price,
      brand: brand.toLowerCase(), quantity, category, discount,
      img: imageUrl,
    })
    await product.save();
    res.json({ status: SUCCESS, data: { product } })
  }
)

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ status: "FAIL", message: "Product not found" });
  }

  let imageUrl = "";
  if (req?.file?.filename) {
    imageUrl = "uploads/" + req.file.filename
  }
  const error = async (message) => {
    res.status(400).json({ status: FAIL, message })
    if (imageUrl) {
      await fs.unlink(path.join(process.cwd(), imageUrl));
    }
  }

  let { name, discription, price, brand,
    quantity, category, discount } = req.body;
  price = Number(price);

  let originalPrice = price;
  switch (true) {
    case !name:
      return error("Name is required") 
    case !discription:
      return error("Discription is required") 
    case !price:
      return error("Price is required") 
    case !brand:
      return error("Brand is required") 
    case !quantity:
      return error("Quantity is required") 
    case !category:
      return error("Category is required") 
    case !discount:
      return error("Discount is required") 
  }

  if (isNaN(price)) return error("Price should be number") ;
  if (isNaN(quantity)) return error("Quantity should be number") ;
  if (isNaN(discount)) return error("Discount should be number") ;
  if (discount > 100 || discount < 0) return error("Discount should be between 0 and 100") ;
  if (+discount > 0) {
    price = +(originalPrice * (1 - discount / 100)).toFixed(2);
  }

  product.name = name;
  product.discription = discription;
  product.price = price;
  product.originalPrice = originalPrice;
  product.brand = brand.toLowerCase();
  product.quantity = quantity;
  product.category = category;
  product.discount = discount;
  if (imageUrl) {
    await fs.unlink(path.join(process.cwd(), "uploads/"+product.img.split("/").pop()));
    product.img = imageUrl;
  }

  await product.save();
  res.json({ status: SUCCESS, data: { product } });
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

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" })
    }

    let relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id } // Exclude the current product
    }).sort({ rating: -1 })
      .limit(10)
      .select("-__v -updatedAt -createdAt -creatorId -reviews -numRatings  -discription -quantity")
      .lean();


    res.status(200).json({
      status: SUCCESS,
      data: { products: relatedProducts },
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

  let product = await Product.findById(id)
    .populate("reviews.user", 'username img')
    .select("reviews numComments");

  if (!product) {
    return res.status(404).json({ status: FAIL, message: "Product not found" });
  }

  // get all reviews that hame comment only
  const reviews = product.reviews.filter(review => review.comment);

  let myReviewIndex = -1;
  if (page === 1 && req.user) {
    myReviewIndex = reviews.findIndex(review => (
      review.user._id.toString() === req.user._id.toString()));
  }

  let paginatedReviews = [];
  if (myReviewIndex !== -1) {
    paginatedReviews = [reviews[myReviewIndex], ...reviews.slice(skip, skip + pageSize)];
  } else {
    paginatedReviews = reviews.slice(skip, skip + pageSize);
  }

  // this is not perefect but it works
  paginatedReviews = paginatedReviews.filter((review,index) => {
    return (index === 0 && myReviewIndex !== -1) || review.user._id.toString() !== req.user._id.toString();
  })

  const hasNextPage = page < Math.ceil(product.numComments / pageSize);
  const hasPrevPage = page > 1;

  res.json({
    status: SUCCESS,
    data: {
      reviews: paginatedReviews,
    },
    currentPage: page,
    pageSize,
    hasNextPage,
    hasPrevPage,
  });
});

const editProductComment = asyncHandler(async (req, res, next) => {
  const { id, reviewId } = req.params; // id is the product id
  const { comment } = req.body;
  if (!comment?.trim()) {
    return res.status(400).json({ status: FAIL, message: "comment is required" });
  }
  let productFound = await Product.findById(id)
    .populate("reviews.user", 'username img')
    .select("numComments reviews")
  if (!productFound) {
    return res.status(404).json({ status: FAIL, message: "Product not found" });
  }

  const reviewIndex = productFound.reviews.findIndex(review => review._id.toString() === reviewId.toString());
  if (reviewIndex === -1) {
    return res.status(404).json({ status: FAIL, message: "comment not found" });
  }
  if (!productFound.reviews[reviewIndex].comment) {
    return res.status(404).json({ status: FAIL, message: "you don not have a comment" });
  }
  productFound.reviews[reviewIndex].comment = comment;
  await productFound.save();
  productFound = await productFound.populate("reviews.user", 'username img')
  res.json({ status: SUCCESS, data: { review: productFound.reviews[reviewIndex] } });
});

const addProductComment = asyncHandler(
  async (req, res, next) => {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ status: FAIL, message: "comment is required" });
    }
    let productFound = await Product.findById(req.params.id)
      .populate("reviews.user", 'username img')
      .select("numComments reviews")
    if (!productFound) {
      return res.status(404).json({ status: FAIL, message: "Product not found" });
    }

    const reviewIndex = productFound.reviews.findIndex(review => review.user._id.toString() === req.user._id.toString());
    if (reviewIndex === -1) {
      // i you dont' make Review (rating or comment) it will be -1
      productFound.reviews.push({
        comment,
        user: req.user._id,
      })
    } else {
      // if you already have a review (make a comment or rating or both)
      if (productFound.reviews[reviewIndex].comment) {
        return res.status(400).json({ status: FAIL, message: "You already have a review" });
      } else {
        productFound.reviews[reviewIndex].comment = comment
      }
    }
    productFound.numComments += 1;
    await productFound.save();
    productFound = await productFound.populate("reviews.user", 'username img')
    let review = {}
    if (reviewIndex === -1) {
      review = productFound.reviews.at(-1).toObject();
    } else {
      review = productFound.reviews[reviewIndex].toObject();
    }
    res.status(201).json({
      status: SUCCESS,
      data: { review, numComments: productFound.numComments }
    })
  }
);

const addOrUpdateProductRating = asyncHandler(
  async (req, res, next) => {
    const { rating } = req.body;
    if (isNaN(rating) || !(+rating >= 0 && +rating <= 5)) {
      return res.status(400).json({ status: FAIL, message: "the rating should be number between 0 and 5" })
    }

    let productFound = await Product.findById(req.params.id)
      .populate("reviews.user", 'username img')
      .select("numRatings allRating rating reviews")

    if (!productFound) {
      return res.status(404).json({ status: FAIL, message: "Product not found" });
    }

    // check by user id
    const reviewIndex = productFound.reviews.findIndex(review => review.user._id.toString() === req.user._id.toString());

    // if user don't have a review
    if (reviewIndex === -1) {
      productFound.reviews.push({
        rating: +rating,
        user: req.user._id,
      })
      productFound.numRatings += 1;
    } else {
      // product have comment and don't have rating
      if (productFound.reviews[reviewIndex].rating === -1) {
        productFound.reviews[reviewIndex].rating = +rating;
        productFound.numRatings += 1;
      } else {
        // product have comment and have rating
        productFound.allRating -= productFound.reviews[reviewIndex].rating;
        productFound.reviews[reviewIndex].rating = +rating;
      }
    }
    productFound.allRating += +rating;
    productFound.rating = (productFound.allRating / productFound.numRatings).toFixed(1);

    await productFound.save();
    productFound = await productFound.populate("reviews.user", 'username img')

    let review = {};
    if (reviewIndex === -1) {
      review = productFound.reviews.at(-1).toObject();
    } else {
      review = productFound.reviews[reviewIndex].toObject();
    }
    res.status(201).json({ status: SUCCESS, data: { review } })
  }
);

/**********************
 * Product filter ****
 * ********************
**/

// query params
// { page, limit, createdAt, id, name, brand, category, price, quantity }
const fetchAllProducts = asyncHandler(
  async (req, res, next) => {
    const pageSize = req.query.limit >= 50 ? 50 : +req.query.limit || 50;
    const page = (req.query.page ? +req.query.page : 1) || 1;

    // { page, limit, createdAt, id, name, brand, category, price, rating, quantity }
    let { createdAt, id, name, brand, category, price, rating, quantity } = req.query;
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
    if (quantity === "undefined") {
      quantity = "";
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
    if (quantity && quantity !== "") {
      filter.quantity = minMaxConvertFromString(res, quantity, "-")
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

const fetchHomeProducts = asyncHandler(
  async (req, res, next) => {
    const pageSize = req.query.limit ? +req.query.limit : 12;
    const newProducts = await Product.find().sort({ createdAt: -1 })
      .limit(pageSize)

    const topRatingProducts = await Product.find().sort({ rating: -1 })
      .limit(pageSize)

    const topSoldProducts = await Product.find().sort({ sold: -1 })
      .limit(pageSize)

    const topDiscountProducts = await Product.find().sort({ discount: -1 })
      .limit(pageSize)

    res.json({
      status: SUCCESS,
      data: {
        newProducts,
        topRatingProducts,
        topSoldProducts,
        topDiscountProducts
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
      searchName = searchName.reduce((acc, word) => {
        if (word === "") {
          return acc;
        } else {
          return `${acc} ${word}`
        }
      }, "");
      args.name = { $regex: searchName.trim(), $options: "i" }
    }
    if (req.query.cateogries !== "" && req.query.cateogries !== "undefined" && categoriesID.length > 0) {
      const validCategoryIds = categoriesID.filter(id => mongoose.Types.ObjectId.isValid(id));
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
      .select("-updatedAt -__v -reviews -creatorId -quantity  -category ");

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
  addProductComment,
  fetchHomeProducts,
  searchProduct,
  getRelatedProductsByCategory,
  fetchProductReviews,
  editProductComment,
  addOrUpdateProductRating,
}