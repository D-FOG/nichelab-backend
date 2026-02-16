import Product from "../models/products.model.js";
import { uploadImage } from "../../../utils/cloudinary.js";
import * as productService from "../services/product.service.js";

// Admin: Create product
export const createProduct = async (req, res) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const url = await uploadImage(file.path);
        imageUrls.push(url);
      }
    }

    const product = await Product.create({
      ...req.body,
      images: imageUrls,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Update product
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    return res.json({ message: "Product updated", product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Archive product
export const archiveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );

    return res.json({ message: "Product archived", product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Restore archived product
export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { archived: false },
      { new: true }
    );

    return res.json({ message: "Product restored", product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: Update stock
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    return res.json({ message: "Stock updated", product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Get all products with pagination
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, size, search } = req.query;

    const result = await productService.getAllProducts({
      page,
      limit,
      category,
      tag,
      size,
      search,
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Get single product by ID
export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return res.json(product);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

// Public: Search products with pagination
export const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query (q) is required" });
    }

    const result = await productService.searchProducts(q, { page, limit });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Like a product
export const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productService.likeProduct(id);
    return res.json(result);
  } catch (err) {
    if (err.message === "You already liked this product") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Public: Unlike a product
export const unlikeProduct = async (req, res) => {
  try {
    const { id } = req.params;
  
    const result = await productService.unlikeProduct(id);
    return res.json(result);
  } catch (err) {
    if (err.message === "You haven't liked this product yet") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
};

// Public: Check if user liked a product
export const isLiked = async (req, res) => {
  try {
    const { id } = req.params;
    
    const liked = await productService.isProductLiked(id);
    return res.json({ liked });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Rate a product
export const rateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, name } = req.body;

    if (!rating) {
      return res.status(400).json({ error: "Rating is required" });
    }

    const result = await productService.rateProduct(id, rating, comment, name);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Get product ratings
export const getProductRatings = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.getProductRatings(id);
    return res.json(result);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

// Public: Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await productService.getProductsByCategory(categoryId, {
      page,
      limit,
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await productService.getAllCategories({ page, limit });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
