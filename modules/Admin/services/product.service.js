import Product from "../../products/models/products.model.js";
import Category from "../../products/models/category.model.js";
import { uploadImage } from "../../../utils/cloudinary.js";
import { ApiError } from "../../../utils/ApiError.js";
//import { ApiResponse } from "../../utils/ApiResponse.js";

export const createProduct = async (name, description, price, bottleSize, categoryId, stock, tags) => {
  try {
    const cat = await Category.findById(categoryId);
    if (!cat) {
      throw new ApiError(404, "Category not found");
    }

    let images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const url = await uploadImage(file.path);
        images.push(url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      bottleSize,
      category: categoryId,
      stock,
      tags,
      images,
    });

    return product;
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (productId, updateData, imageFile) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const fields = [
      "name",
      "description",
      "price",
      "bottleSize",
      "category",
      "stock",
      "tags",
      "isActive",
      "archived",
    ];

    fields.forEach((field) => {
      if (updateData[field] !== undefined) {
        product[field] = updateData[field];
      }
    });

    // upload new images if any
    if (imageFile?.length) {
      const uploaded = [];
      for (const file of imageFile) {
        const url = await uploadImage(file.path);
        uploaded.push(url);
      }
      product.images.push(...uploaded);
    }

    await product.save();

    return product;
  } catch (err) {
    throw err;
  }
};


export const deleteProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    product.archived = true;
    product.isActive = false;

    await product.save();

    return product;
  } catch (err) {
    throw err;
  }
};

export const getAllProducts = async (search, categoryId, tag, archived) => {
  try {
    const query = {};

    if (archived !== undefined) {
      query.archived = archived === "true";
    }

    if (categoryId) {
      query.category = categoryId;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return products;
  } catch (err) {
    throw err;
  }
};

export const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId).populate(
      "category",
      "name description"
    );

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  } catch (err) {
    throw err;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const products = await Product.find({
      category: categoryId,
      archived: false,
    }).populate("category", "name");

    return products;
  } catch (err) {
    throw err;
  }
};

