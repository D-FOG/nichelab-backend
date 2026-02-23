import Category from "../../products/models/category.model.js";
//import Product from "../../products/modelss/product.model.js";
import { ApiError } from "../../../utils/ApiError.js";
//import { ApiResponse } from "../../utils/ApiResponse.js";

export const createCategory = async (name, description) => {
  try {

    if (!name) {
      throw new ApiError(400, "Category name is required");
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({ name, description });

    return category;
  } catch (err) {
    throw err;
  }
};

export const updateCategory = async (categoryId, name, description, isActive) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return category;
  } catch (err) {
    throw err;
  }
};

export const deleteCategory = async (categoryId) => {
  try {

    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    category.isActive = false;
    await category.save();

    return category;
  } catch (err) {
    throw err;
  }
};

export const getAllCategories = async () => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products", // collection name in MongoDB (usually lowercase plural)
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $addFields: {
          productCount: {
            $size: {
              $filter: {
                input: "$products",
                as: "product",
                cond: {
                  $and: [
                    { $eq: ["$$product.isActive", true] },
                    { $eq: ["$$product.archived", false] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          products: 0, // remove products array from response
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return categories;
  } catch (err) {
    throw err;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  } catch (err) {
    throw err;
  }
};





