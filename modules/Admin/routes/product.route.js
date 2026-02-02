import { Router } from "express";
import { createProductController, updateProductController, deleteProductController, getAllProductsController, getProductByIdController, getProductsByCategoryController } from "../controllers/product.controller.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });


router.post("/admin/products", superAdminOnly, upload.array("images", 5), createProductController);
router.put("/admin/products/:productId", superAdminOnly, upload.array("images", 5), updateProductController);
router.delete("/admin/products/:productId", superAdminOnly, deleteProductController);
router.get("/admin/products", superAdminOnly, getAllProductsController);
router.get("/admin/products/:productId", superAdminOnly, getProductByIdController);
router.get("/admin/categories/:categoryId/products", superAdminOnly, getProductsByCategoryController);

export default router;