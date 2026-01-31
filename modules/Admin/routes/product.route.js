import { Router } from "express";
import { createProductController, updateProductController, deleteProductController, getAllProductsController, getProductByIdController, getProductsByCategoryController } from "../controllers/product.controller.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = Router();

router.post("/admin/products", superAdminOnly, createProductController);
router.put("/admin/products/:productId", superAdminOnly, updateProductController);
router.delete("/admin/products/:productId", superAdminOnly, deleteProductController);
router.get("/admin/products", superAdminOnly, getAllProductsController);
router.get("/admin/products/:productId", superAdminOnly, getProductByIdController);
router.get("/admin/categories/:categoryId/products", superAdminOnly, getProductsByCategoryController);

export default router;