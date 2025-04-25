import AppError from "../utils/appError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { FAIL, SUCCESS } from "../utils/httpStatucText.js";
import Category from "../models/category.model.js";

const createCategory = asyncHandler(
  async (req, res, next) => {
    const name = req.body.name.toLowerCase();
    
    if (!name) {
      return res.status(400).json({status:FAIL,message:"Category Name is required"})
    }
    const creatorId = req.user._id;
    const newCategory = new Category({ name, creatorId });
    try {
      await newCategory.save();
      const category = newCategory.toObject();
      delete category.__v;
      res.json({ status: SUCCESS, data: { category } });
    } catch (err) {
      next(new AppError(409, FAIL, "This Category Name already exist"));
    }
  }
)

const updateCategory = asyncHandler(
  async (req, res, next) => {
    const categoryId = req.params.id;
    const name  = req.body?.name?.toLowerCase().trim();
    if (name.length > 20) {
      return res.status(400).json({ status: FAIL, message: "Category Name is too long (20 characters max)" });
    }
    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ status: FAIL, message: "Category not existed" });
    }
    const newName = await Category.find({ name });
    if (newName.length !== 0) {//This Category Name already exist
      return res.status(409).json({ status: FAIL, message: "This Category Name already exist" });
    }
    category.name = name;
    await category.save();
    return res.status(200).json({ status: SUCCESS, data: { category: category.toObject() } })
  }
)

const deleteCategory = asyncHandler(
  async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId)
    if (!category) {
      return res.status(404).json({ status: FAIL, message: "Category not existed" });
    }
    res.status(200).json({ status: SUCCESS, data:null })
  }
)

const listCategories = asyncHandler(
  async (req, res, next) => { 
    const categories = await Category.find({}, { __v: 0, updatedAt: 0, createdAt: 0, creatorId: 0 });
    res.json({ status: SUCCESS, data: { categories } })
  }
)

const getCategory = asyncHandler(
  async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId, { __v: 0, updatedAt: 0, createdAt: 0, creatorId: 0 });
    if (!category) {
      return res.status(404).json({ status: FAIL, message: "Category not existed" });
    }
    res.status(200).json({ status: SUCCESS, data: { category: category.toObject() } })
  }
)

export {
  createCategory,
  listCategories,
  deleteCategory,
  getCategory,
  updateCategory
}