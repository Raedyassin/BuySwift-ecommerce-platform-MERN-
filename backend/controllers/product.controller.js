import Product from "../models/product.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";

const addProduct = asyncHandler(
  async (req, res, next) => {
    const { name, discription, countInStock, price, brand, quantity, category } = req.fields;
    switch (true) {
      case !countInStock:
        return res.status(400).json({ status: FAIL, message:"count In Stock is required"})
      case !name:
        return res.status(400).json({status:FAIL,message:"Name is required"})
      case !discription:
        return res.status(400).json({ status: FAIL, message:"Discription is required"})
      case !price:
        return res.status(400).json({ status: FAIL, message:"Price is required"})
      case !brand:
        return res.status(400).json({ status: FAIL, message:"Brand is required"})
      case !quantity:
        return res.status(400).json({ status: FAIL, message:"Quantity is required"})
      case !category:
        return res.status(400).json({ status: FAIL, message:"Category is required"})
    }
    const product = new Product({ name, countInStock, discription, price, brand, quantity, category })
    product.img = "uploads/" + req.fields.img;
    await product.save();
    res.json({status:SUCCESS,data:{product}})
  }
)


const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { name, discription, price, countInStock,brand, quantity, category,img } = req.fields;
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

    const count = await Product.countDocuments({...keyword});

    const products = await Product.find({ ...keyword })
      .select("-__v")
      .limit(pageSize+10)
      .skip((page - 1) * pageSize);
    res.json({
      status: SUCCESS, data: {
        products,
        currentPage:page,
        pages: Math.ceil(count / pageSize),
      }
    })
  }
)

const fetchProductById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: FAIL, message: "Product not found" })
    }
    res.json({ status: SUCCESS, data:{product} })
  }
)

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
        pages:Math.ceil(count/pageSize)
      }
    })
  }
)

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
      user: req.user._id,
    }
    product.reviews.push(review)
    product.numReview = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ status: SUCCESS, data: { review } })
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
    if (checked.length>0) {
      args.category = checked;
    }
    if (radio.length>0) {
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
        currentPage:page,
        pages: Math.ceil(count / pageSize),
      }
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
  filterProduct
}