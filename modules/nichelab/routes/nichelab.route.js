import { Router } from "express";
import { getAllNicheCategoriesController } from "../controllers/category.controller.js";
import {
	getAllNicheProductsController,
	getNicheProductByIdController,
	getNicheProductsByCategoryController,
} from "../controllers/product.controller.js";

const router = Router();

// Categories
router.get("/niche/categories", getAllNicheCategoriesController);

// Products
router.get("/niche/products", getAllNicheProductsController);
router.get("/niche/products/:id", getNicheProductByIdController);
router.get(
	"/niche/products/category/:categoryId",
	getNicheProductsByCategoryController
);

export default router;