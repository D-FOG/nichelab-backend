import Product from "../models/products.model.js";

/**
 * Get all products with pagination and filters
 */
export const getAllProducts = async ({
  page = 1,
  limit = 10,
  category,
  tag,
  size,
  search,
} = {}) => {
  const skip = (page - 1) * limit;
  const filter = { archived: false };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (size) filter.bottleSize = size;
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return {
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate("ratings.userId", "name email");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/**
 * Like a product
 */
export const likeProduct = async (productId, userId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if user already liked it
  const alreadyLiked = product.likedBy.includes(userId);

  if (alreadyLiked) {
    throw new Error("You already liked this product");
  }

  product.likedBy.push(userId);
  await product.save();

  return {
    message: "Product liked successfully",
    liked: true,
    likesCount: product.likedBy.length,
  };
};

/**
 * Unlike a product
 */
export const unlikeProduct = async (productId, userId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const alreadyLiked = product.likedBy.includes(userId);

  if (!alreadyLiked) {
    throw new Error("You haven't liked this product yet");
  }

  product.likedBy = product.likedBy.filter(
    (id) => id.toString() !== userId.toString()
  );
  await product.save();

  return {
    message: "Product unliked successfully",
    liked: false,
    likesCount: product.likedBy.length,
  };
};

/**
 * Check if user liked a product
 */
export const isProductLiked = async (productId, userId) => {
  if (!userId) return false;

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product.likedBy.some((id) => id.toString() === userId.toString());
};

/**
 * Add or update rating for a product
 */
export const rateProduct = async (productId, userId, rating, comment = "") => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if user already rated this product
  const existingRatingIndex = product.ratings.findIndex(
    (r) => r.userId.toString() === userId.toString()
  );

  if (existingRatingIndex !== -1) {
    // Update existing rating
    product.ratings[existingRatingIndex].rating = rating;
    product.ratings[existingRatingIndex].comment = comment;
  } else {
    // Add new rating
    product.ratings.push({
      userId,
      rating,
      comment,
    });
  }

  await product.save();
  await product.populate("ratings.userId", "name email");

  return {
    message: "Rating added successfully",
    averageRating: product.averageRating,
    totalRatings: product.ratings.length,
  };
};

/**
 * Get ratings for a product
 */
export const getProductRatings = async (productId) => {
  const product = await Product.findById(productId)
    .select("ratings averageRating")
    .populate("ratings.userId", "name email");

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    averageRating: product.averageRating,
    totalRatings: product.ratings.length,
    ratings: product.ratings,
  };
};

/**
 * Search products
 */
export const searchProducts = async (query, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({
      archived: false,
      name: { $regex: query, $options: "i" },
    })
      .populate("category", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Product.countDocuments({
      archived: false,
      name: { $regex: query, $options: "i" },
    }),
  ]);

  return {
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};
