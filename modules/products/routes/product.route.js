import express from "express";
import {
  getProducts,
  getProduct,
  searchProducts,
  likeProduct,
  unlikeProduct,
  isLiked,
  rateProduct,
  getProductRatings,
  getProductsByCategory,
  getAllCategoriesController
} from "../controllers/product.controller.js";

const router = express.Router();

// Public routes - Products
router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.get("/products/:id", getProduct);

// Public routes - Likes
router.post("/products/:id/like", likeProduct);
router.post("/products/:id/unlike", unlikeProduct);
router.get("/products/:id/is-liked", isLiked);

// Public routes - Ratings
router.post("/products/:id/rate", rateProduct);
router.get("/products/:id/ratings", getProductRatings);
// Products by category
router.get(
  "/products/category/:categoryId",
  getProductsByCategory
);
// Public: get all categories
router.get("/categories", getAllCategoriesController);
export default router;
