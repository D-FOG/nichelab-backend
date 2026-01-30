import { Router } from "express";
import { createProductController, updateProductController, deleteProductController, getAllProductsController, getProductByIdController, getProductsByCategoryController } from "../controllers/product.controller";

const router = Router();
router.post("/admin/products", createProductController);
router.put("/admin/products/:productId", updateProductController);
router.delete("/admin/products/:productId", deleteProductController);
router.get("/admin/products", getAllProductsController);
router.get("/admin/products/:productId", getProductByIdController);
router.get("/admin/categories/:categoryId/products", getProductsByCategoryController);

export default router;