import { Router } from "express";
import multer from "multer";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";
import {
  createNicheCategoryController,
  getAllNicheCategoriesController,
  deleteNicheCategoryController,
  updateNicheCategoryController,
} from "../controllers/category.controller.js";
import {
  createNicheProductController,
  updateNicheProductController,
  deleteNicheProductController,
  getAllNicheProductsController,
  getNicheProductByIdController,
  restoreNicheProductController,
} from "../controllers/product.controller.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Categories
router.post("/admin/niche/categories", superAdminOnly, createNicheCategoryController);
router.get("/admin/niche/categories", superAdminOnly, getAllNicheCategoriesController);
router.delete(
  "/admin/niche/categories/:id",
  superAdminOnly,
  deleteNicheCategoryController
);

// Products
router.post(
  "/admin/niche/products",
  superAdminOnly,
  upload.array("images", 5),
  createNicheProductController
);

router.put(
  "/admin/niche/products/:id",
  superAdminOnly,
  upload.array("images", 5),
  updateNicheProductController
);

router.delete("/admin/niche/products/:id", superAdminOnly, deleteNicheProductController);
router.get("/admin/niche/products", superAdminOnly, getAllNicheProductsController);
router.get("/admin/niche/products/:id", superAdminOnly, getNicheProductByIdController);
router.patch("/admin/niche/products/:id/restore", superAdminOnly, restoreNicheProductController);

export default router;