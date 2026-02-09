import { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById } from "../services/category.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createCategoryController = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await createCategory(name, description);
    return new ApiResponse(201, "Category created successfully", category);
  } catch (err) {
    next(err);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;  
    const { name, description, isActive } = req.body;
    const category = await updateCategory(categoryId, name, description, isActive);
    return res.status(200).json(new ApiResponse(200, "Category updated successfully", category));
  }catch (err) {
    next(err);
  }
};


export const deleteCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await deleteCategory(categoryId);
    return res.status(200).json(new ApiResponse(200, "Category deleted successfully", category));
    } catch (err) {
    next(err);
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(new ApiResponse(200, "Categories fetched successfully", categories));
    } catch (err) {
    next(err);
    }
};
export const getCategoryByIdController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryById(categoryId);
    return res.status(200).json(new ApiResponse(200, "Category fetched successfully", category));
  } catch (err) {
    next(err);
  }
};



