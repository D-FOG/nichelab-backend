import { Router } from "express";
import { createCategoryController, updateCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController } from "../controllers/category.controller.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = Router();

router.post("/admin/categories", superAdminOnly, createCategoryController);
router.put("/admin/categories/:categoryId", superAdminOnly, updateCategoryController);
router.delete("/admin/categories/:categoryId", superAdminOnly, deleteCategoryController);
router.get("/admin/categories", superAdminOnly, getAllCategoriesController);
router.get("/admin/categories/:categoryId", superAdminOnly, getCategoryByIdController);
export default router;