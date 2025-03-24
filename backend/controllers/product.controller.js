import Product from "../models/product.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";

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

const fechProducts = asyncHandler(
  async (req, res, next) => {

    const page = req.query.page ? +req.query.page : 1;
    const pageSize = 10;

    const keyword = req.query.keyword ?
      {
        name: {
          $regex: req.query.keyword,
          $options: "i"
        }
      } : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
      .select("-__v")
      .limit(pageSize + 10)
      .skip((page - 1) * pageSize);
    res.json({
      status: SUCCESS, data: {
        products,
        currentPage: page,
        pages: Math.ceil(count / pageSize),
      }
    })
  }
)

const fetchProductById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    let product = await Product.findById(id)
    // .select("-updatedAt -createdAt -creatorId -__v -reviews")
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" })
    }
    res.json({ status: SUCCESS, data: { product } })
  }
)

/**********************
 * Product Reviews ****
 * ********************
 */
const fetchProductReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const page = req.query.page ? +req.query.page : 1;
  const pageSize = req.query.limit ? (+req.query.limit > 50 ? 50 : +req.query.limit) : 10; // make the page size configurable
  const skip = (page - 1) * pageSize;

  const product = await Product.findById(id).select("reviews"); // Only fetch reviews field to optimize

  if (!product) {
    return res.status(404).json({ status: FAIL, message: "Product not found" });
  }

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
  if (!review) {
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
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" });
    }
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ status: FAIL, message: "Product already reviewed" })
    }
    const review = {
      name: req.user.username,
      rating: +rating,
      comment,
      img: req.user.img,
      user: req.user._id,
    }
    product.reviews.push(review)
    product.numReview = product.reviews.length;

    // product.rating = product.reviews.reduce((acc, review) => {
    //   return review.rating + acc;
    // }, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ status: SUCCESS, data: { review: { ...review, createdAt: new Date(), updatedAt: new Date() } } })
  }
)



/**********************
 * Product filter ****
 * ********************
 */

const fetchAllProducts = asyncHandler(
  async (req, res, next) => {
    const pageSize = 10;
    const page = req.query.page ? +req.query.page : 1;
    const count = await Product.countDocuments();
    const products = await Product.find().populate("category",
      "-updatedAt -createdAt -creatorId -__v")
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .select("-updatedAt -__v")
    res.json({
      status: SUCCESS,
      data: {
        products,
        page,
        pages: Math.ceil(count / pageSize)
      }
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

const filterProduct = asyncHandler(
  async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length > 0) {
      args.price = { $gte: radio[0], $lte: radio[1] }
    }
    const pageSize = 10;
    const count = await Product.countDocuments(args);
    const products = await Product.find(args)
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    res.json({
      status: SUCCESS,
      data: {
        products,
        currentPage: page,
        pages: Math.ceil(count / pageSize),
      }
    })
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


export {
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
  editProductReview
}