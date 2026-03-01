import { Router } from "express";
import {
  getTopCategoriesBySalesController,
  getTopProductsBySalesController,
  getAdminTotalsController,
} from "../controllers/admin.stats.controller.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = Router();

router.get(
  "/admin/stats/categories/top",
  superAdminOnly,
  getTopCategoriesBySalesController
);

router.get(
  "/admin/stats/products/top",
  superAdminOnly,
  getTopProductsBySalesController
);

router.get(
  "/admin/stats/overview",
  superAdminOnly,
  getAdminTotalsController
);

export default router;