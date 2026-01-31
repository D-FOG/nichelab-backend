import express from "express";
import {
  createProduct,
  updateProduct,
  archiveProduct,
  restoreProduct,
  updateStock,
  getProducts,
  getProduct,
  searchProducts,
} from "../controllers/product.controller.js";
import { adminAuth } from "../../../middlewares/adminAuth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Admin protected routes
router.post(
  "/admin/products",
  adminAuth,
  upload.array("images", 5),
  createProduct
);

router.put("/admin/products/:id", adminAuth, updateProduct);
router.patch("/admin/products/:id/archive", adminAuth, archiveProduct);
router.patch("/admin/products/:id/restore", adminAuth, restoreProduct);
router.patch("/admin/products/:id/stock", adminAuth, updateStock);

// Public routes
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.get("/products/search", searchProducts);

export default router;
