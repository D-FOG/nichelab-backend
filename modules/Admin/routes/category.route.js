import { Router } from "express";
import { createCategoryController, updateCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController } from "../controllers/category.controller";

const router = Router();

router.post("/admin/categories", createCategoryController);
router.put("/admin/categories/:categoryId", updateCategoryController);
router.delete("/admin/categories/:categoryId", deleteCategoryController);
router.get("/admin/categories", getAllCategoriesController);
router.get("/admin/categories/:categoryId", getCategoryByIdController);
export default router;