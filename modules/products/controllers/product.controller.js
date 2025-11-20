import Product from "../models/products.model.js";
import { uploadImage } from "../../../utils/cloudinary.js";

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

// Public: Get all products
export const getProducts = async (req, res) => {
  try {
    const { category, tag, size } = req.query;

    const filter = { archived: false };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (size) filter.bottleSize = size;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Public: Search
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const products = await Product.find({
      archived: false,
      name: { $regex: q, $options: "i" },
    });

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
