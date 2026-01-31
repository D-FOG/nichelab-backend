import { Router } from "express";
import { getAllOrdersController, getOrderByIdController, updateOrderStatusController, deleteOrderController, getAdminDashboardStatsController } from "../controllers/order.controller.js";
import { adminAuth } from "../../../middlewares/adminAuth.js";
import { superAdminOnly } from "../../../middlewares/superAdminAuth.js";

const router = Router();

router.get("/admin/orders", superAdminOnly, getAllOrdersController);
router.get("/admin/orders/:orderId", superAdminOnly, getOrderByIdController);
router.patch("/admin/orders/:orderId/status", superAdminOnly, updateOrderStatusController);
router.delete("/admin/orders/:orderId", superAdminOnly, deleteOrderController);
router.get("/admin/dashboard/stats", superAdminOnly, getAdminDashboardStatsController);

export default router;